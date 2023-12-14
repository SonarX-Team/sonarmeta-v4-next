"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TokenboundClient } from "@tokenbound/sdk";
import { useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead } from "wagmi";
import { http, createWalletClient, WalletClient, custom } from "viem";
import { polygonMumbai } from "viem/chains";
import toast from "react-hot-toast";

import AppButton from "../ui/AppButton";
import TxToast from "../ui/TxToast";
import TitleCard from "../cards/TitleCard";

import { AUTHORIZATION_CONTRACT, CREATION_CONTRACT, MAIN_CONTRACT, NODE_MAX_SUPPLY } from "@/constants";
import mainContractAbi from "@/contracts/sonarmeta/SonarMeta.json";
import authorizationContractAbi from "@/contracts/sonarmeta/Authorization.json";
import { hiddenAddress } from "@/lib/utils";

export default function NodeFactory({ address, tokenId }: { address: `0x${string}`; tokenId: number }) {
  const router = useRouter();

  const [tba, setTba] = useState<`0x${string}`>("0x");
  const [tbaDeployed, setTbaDeployed] = useState<boolean>(false);
  const [deployTxHash, setDeployTxHash] = useState<`0x${string}`>();
  const [walletClient, setWalletClient] = useState<WalletClient>();

  const { chain } = useNetwork();

  // @ts-ignore
  const tokenboundClient = useMemo(() => new TokenboundClient({ walletClient, chain: polygonMumbai }), [walletClient]);

  const { data: isNodeSigned } = useContractRead({
    address: MAIN_CONTRACT,
    abi: mainContractAbi,
    functionName: "isNodeSigned",
    chainId: chain?.id,
    // @ts-ignore
    args: [tba],
  });

  const { data: isNodeActivated } = useContractRead({
    address: AUTHORIZATION_CONTRACT,
    abi: authorizationContractAbi,
    functionName: "exists",
    chainId: chain?.id,
    // @ts-ignore
    args: [tokenId],
  });

  const { config: signConfig } = usePrepareContractWrite({
    address: MAIN_CONTRACT,
    abi: mainContractAbi,
    functionName: "signNodeToUse",
    chainId: chain?.id,
    // @ts-ignore
    args: [tba, tokenId],
  });

  const { data: signTx, write: signWrite } = useContractWrite(signConfig);

  const { config: activateConfig } = usePrepareContractWrite({
    address: MAIN_CONTRACT,
    abi: mainContractAbi,
    functionName: "activateNode",
    chainId: chain?.id,
    // @ts-ignore
    args: [tba, tokenId, NODE_MAX_SUPPLY],
  });

  const { data: activateTx, write: activateWrite } = useContractWrite(activateConfig);

  const {
    error: deployError,
    isSuccess: isDeploySuccess,
    isLoading: isDeployLoading,
    isError: isDeployError,
  } = useWaitForTransaction({
    hash: deployTxHash,
  });

  const {
    error: signError,
    isSuccess: isSignSuccess,
    isLoading: isSignLoading,
    isError: isSignError,
  } = useWaitForTransaction({
    hash: signTx?.hash,
  });

  const {
    error: activateError,
    isSuccess: isActivateSuccess,
    isLoading: isActivateLoading,
    isError: isActivateError,
  } = useWaitForTransaction({
    hash: activateTx?.hash,
  });

  // onMounted, when window object is available
  useEffect(() => {
    if (!window) return;

    const wc: WalletClient = createWalletClient({
      account: address,
      chain: polygonMumbai,
      // @ts-ignore
      transport: window.ethereum ? custom(window.ethereum) : http(),
    });
    setWalletClient(wc);
  }, [address]);

  // TBA watcher
  useEffect(() => {
    async function watchTba() {
      const creationTba = tokenboundClient.getAccount({
        tokenContract: CREATION_CONTRACT,
        tokenId: tokenId.toString(),
      });

      setTba(creationTba);

      const isAccountDeployed = await tokenboundClient.checkAccountDeployment({
        accountAddress: creationTba,
      });

      setTbaDeployed(isAccountDeployed);
    }

    watchTba();
  }, [tokenId, tokenboundClient]);

  // Create TBA tx watcher
  useEffect(() => {
    if (isDeploySuccess) {
      toast.custom(<TxToast title="Token-bound account deployed successfully!" hash={deployTxHash} />);
      router.refresh();
    }

    if (isDeployError) toast.error(`Failed with error: ${deployError?.message}`);
  }, [isDeploySuccess, isDeployError, deployError?.message, deployTxHash, router]);

  // Sign node tx receipt watcher
  useEffect(() => {
    if (isSignSuccess) {
      toast.custom(<TxToast title="Token-bound account signed successfully!" hash={signTx?.hash} />);
      router.refresh();
    }

    if (isSignError) toast.error(`Failed with error: ${signError?.message}`);
  }, [isSignSuccess, isSignError, signError?.message, signTx?.hash, router]);

  // Activate node tx receipt watcher
  useEffect(() => {
    if (isActivateSuccess) {
      toast.custom(<TxToast title="Token-bound account activated successfully!" hash={activateTx?.hash} />);
      router.refresh();
    }

    if (isActivateError) toast.error(`Failed with error: ${activateError?.message}`);
  }, [isActivateSuccess, isActivateError, activateError?.message, activateTx?.hash, router]);

  async function deployAction() {
    if (tbaDeployed) return;

    toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

    try {
      const { account, txHash: deployTxHash } = await tokenboundClient.createAccount({
        tokenContract: CREATION_CONTRACT,
        tokenId: tokenId.toString(),
      });

      setDeployTxHash(deployTxHash);
      setTba(account);
    } catch (error) {
      toast.error("You denied transaction signature.");
    }
  }

  async function signAction() {
    if (!tbaDeployed) return;

    toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

    signWrite?.();
  }

  async function activateAction() {
    if (isNodeActivated || !tbaDeployed) return;

    toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

    activateWrite?.();
  }

  const nodeInfo = [
    { info: hiddenAddress(tba), title: "Token-bound account" },
    { info: tbaDeployed ? "Generated" : "Not generated", title: "Node generated" },
    { info: isNodeSigned ? "Signed" : "Not signed", title: "Node signed" },
    { info: isNodeActivated ? "Activated" : "Not activated", title: "Node authorization" },
  ];
  const nodeCard: JSX.Element[] = nodeInfo.map((info, index) => (
    <div key={index} className="flex flex-col gap-2">
      <div className="text-small-medium text-zinc-500">{info.title}</div>
      <div className="text-small-medium line-clamp-1">{info.info}</div>
    </div>
  ));

  return (
    <>
      <TitleCard title="Node">
        <div className="grid grid-cols-4 gap-8">{nodeCard}</div>
      </TitleCard>

      <div className="flex flex-col justify-start gap-4">
        <form action={deployAction} className="h-[50px]">
          <AppButton
            text={tbaDeployed ? "Node generated" : "Generate node"}
            otherPendingStatus={isDeployLoading}
            pendingText={isDeployLoading ? "Writing contract..." : "Deploying..."}
            disabled={tbaDeployed}
            type="submit"
          />
        </form>

        <form action={signAction} className="h-[50px]">
          <AppButton
            text={
              signWrite
                ? tbaDeployed
                  ? Boolean(isNodeSigned)
                    ? "Node signed"
                    : "Sign node to use SonarMeta"
                  : "Node must be generated to sign"
                : "Cannot sign"
            }
            otherPendingStatus={isSignLoading}
            pendingText={isSignLoading ? "Writing contract..." : "Signing..."}
            disabled={!tbaDeployed || Boolean(isNodeSigned) || !signWrite}
            type="submit"
          />
        </form>

        <form action={activateAction} className="h-[50px]">
          <AppButton
            text={
              isNodeActivated
                ? "Node activated"
                : tbaDeployed
                ? "Activate authorization functionality"
                : "Only signed node can be activated"
            }
            otherPendingStatus={isActivateLoading}
            pendingText={isActivateLoading ? "Writing contract..." : "Activating..."}
            disabled={!tbaDeployed || Boolean(isNodeActivated) || !activateWrite}
            type="submit"
          />
        </form>
      </div>
    </>
  );
}
