"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TBVersion, TokenboundClient } from "@tokenbound/sdk";
import { useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead } from "wagmi";
import { http, createWalletClient, WalletClient, custom } from "viem";
import toast from "react-hot-toast";

import AppButton from "../ui/AppButton";
import TxToast from "../ui/TxToast";
import TitleCard from "../cards/TitleCard";

import { makeNode } from "@/actions/creation.action";
import {
  AUTHORIZATION_CONTRACT,
  CREATION_CONTRACT,
  MAIN_CONTRACT,
  NODE_MAX_SUPPLY,
  REGISTRY_CONTRACT,
  TOKENBOUND_CONTRACT,
} from "@/constants";
import mainContractAbi from "@/contracts/sonarmeta/SonarMeta.json";
import authorizationContractAbi from "@/contracts/sonarmeta/Authorization.json";
import registryContractAbi from "@/contracts/tokenbound/ERC6551Registry.json";
import { hiddenAddress } from "@/lib/utils";
import { victionTestnet } from "@/lib/viction";

export default function NodeFactory({ userAddr, tokenId }: { userAddr: `0x${string}`; tokenId: number }) {
  const router = useRouter();

  const [tba, setTba] = useState<`0x${string}`>("0x");
  const [tbaDeployed, setTbaDeployed] = useState<boolean>(false);
  const [walletClient, setWalletClient] = useState<WalletClient>();

  const { chain } = useNetwork();

  const tokenboundClient = useMemo(
    () =>
      new TokenboundClient({
        // @ts-ignore
        walletClient,
        chain: victionTestnet,
        implementationAddress: TOKENBOUND_CONTRACT,
        registryAddress: REGISTRY_CONTRACT,
        version: TBVersion.V2,
      }),
    [walletClient]
  );

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

  const { config: deployConfig } = usePrepareContractWrite({
    address: REGISTRY_CONTRACT,
    abi: registryContractAbi,
    functionName: "createAccount",
    chainId: chain?.id,
    // @ts-ignore
    args: [TOKENBOUND_CONTRACT, chain?.id, CREATION_CONTRACT, tokenId, 0n],
  });

  const { data: deployTx, write: deployWrite } = useContractWrite(deployConfig);

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
    hash: deployTx?.hash,
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
      account: userAddr,
      chain: victionTestnet,
      // @ts-ignore
      transport: window.ethereum ? custom(window.ethereum) : http(),
    });
    setWalletClient(wc);
  }, [userAddr]);

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
    async function watchTba() {
      if (isDeploySuccess) {
        await makeNode({ tokenId, tbaAddr: tba });

        toast.custom(<TxToast title="Token-bound account deployed successfully!" hash={deployTx?.hash} />);
        router.refresh();
      } else if (isDeployError) toast.error(`Failed with error: ${deployError?.message}`);
    }

    watchTba();
  }, [isDeploySuccess, isDeployError, deployError?.message, deployTx?.hash, router]);

  // Sign node tx receipt watcher
  useEffect(() => {
    if (isSignSuccess) {
      toast.custom(<TxToast title="Token-bound account signed successfully!" hash={signTx?.hash} />);
      router.refresh();
    } else if (isSignError) toast.error(`Failed with error: ${signError?.message}`);
  }, [isSignSuccess, isSignError, signError?.message, signTx?.hash, router]);

  // Activate node tx receipt watcher
  useEffect(() => {
    if (isActivateSuccess) {
      toast.custom(<TxToast title="Token-bound account activated successfully!" hash={activateTx?.hash} />);
      router.refresh();
    } else if (isActivateError) toast.error(`Failed with error: ${activateError?.message}`);
  }, [isActivateSuccess, isActivateError, activateError?.message, activateTx?.hash, router]);

  async function deployAction() {
    if (tbaDeployed) return;

    toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

    try {
      deployWrite?.();
    } catch (error) {
      toast.error("You denied transaction signature.");
    }
  }

  async function signAction() {
    if (!tbaDeployed) return;

    toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

    try {
      signWrite?.();
    } catch (error) {
      toast.error("You denied transaction signature.");
    }
  }

  async function activateAction() {
    if (isNodeActivated || !tbaDeployed) return;

    toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

    try {
      activateWrite?.();
    } catch (error) {
      toast.error("You denied transaction signature.");
    }
  }

  const nodeInfo = [
    { info: hiddenAddress(tba), title: "Token-bound account" },
    { info: tbaDeployed ? "Generated" : "Not generated", title: "Node generated" },
    { info: isNodeSigned ? "Signed" : "Not signed", title: "Node signed" },
    { info: isNodeActivated ? "Activated" : "Not activated", title: "Node authorization" },
  ];
  const nodeCard: JSX.Element[] = nodeInfo.map((info, index) => (
    <div key={index} className="flex flex-col gap-2">
      <div className="text-small-regular text-zinc-500">{info.title}</div>
      <div className="text-small-regular line-clamp-1">{info.info}</div>
    </div>
  ));

  return (
    <>
      <TitleCard title="Node">
        <div className="grid grid-cols-4 gap-8">{nodeCard}</div>
      </TitleCard>

      <div className="flex flex-col justify-start gap-4">
        <form action={deployAction}>
          <AppButton
            text={tbaDeployed ? "Node generated" : "Generate node"}
            otherPendingStatus={isDeployLoading}
            pendingText={isDeployLoading ? "Writing contract..." : "Deploying..."}
            disabled={tbaDeployed}
            type="submit"
          />
        </form>

        <form action={signAction}>
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

        <form action={activateAction}>
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
