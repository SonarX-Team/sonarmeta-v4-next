"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TokenboundClient } from "@tokenbound/sdk";
import { useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead } from "wagmi";
import { http, createWalletClient, WalletClient, custom } from "viem";
import { polygonMumbai } from "viem/chains";
import toast from "react-hot-toast";

import AppButton from "../ui/AppButton";
import TitleCard from "../cards/TitleCard";

import { AUTHORIZATION_CONTRACT, CREATION_CONTRACT, MAIN_CONTRACT } from "@/constants";
import mainContractAbi from "@/contracts/sonarmeta/SonarMeta.json";
import authorizationContractAbi from "@/contracts/sonarmeta/Authorization.json";
import { hiddenAddress } from "@/lib/utils";

export default function TbaFactory({ address, tokenId }: { address: `0x${string}`; tokenId: number }) {
  const router = useRouter();

  const [tba, setTba] = useState<`0x${string}`>("0x");
  const [tbaDeployed, setTbaDeployed] = useState<boolean>(false);
  const [deployTxHash, setDeployTxHash] = useState<`0x${string}`>();
  const [walletClient, setWalletClient] = useState<WalletClient>();

  const { chain } = useNetwork();

  // @ts-ignore
  const tokenboundClient = useMemo(() => new TokenboundClient({ walletClient, chain: polygonMumbai }), [walletClient]);

  const { data: isTbaSigned } = useContractRead({
    address: MAIN_CONTRACT,
    abi: mainContractAbi,
    functionName: "isTbaSigned",
    chainId: chain?.id,
    // @ts-ignore
    args: [tba],
  });

  const { data: isTbaActivated } = useContractRead({
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
    functionName: "signToUse",
    chainId: chain?.id,
    // @ts-ignore
    args: [tba, tokenId],
  });

  const { data: signTx, write: signWrite } = useContractWrite(signConfig);

  const { config: activateConfig } = usePrepareContractWrite({
    address: MAIN_CONTRACT,
    abi: mainContractAbi,
    functionName: "activateAuthorization",
    chainId: chain?.id,
    // @ts-ignore
    args: [tba, tokenId],
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
      const tba = tokenboundClient.getAccount({
        tokenContract: CREATION_CONTRACT,
        tokenId: tokenId.toString(),
      });

      setTba(tba);

      const isAccountDeployed = await tokenboundClient.checkAccountDeployment({
        accountAddress: tba,
      });

      setTbaDeployed(isAccountDeployed);
    }

    watchTba();
  }, [tokenId, tokenboundClient]);

  // Create TBA tx watcher
  useEffect(() => {
    if (isDeploySuccess) {
      toast.custom(
        <div className="w-[350px] bg-light-1 shadow-lg rounded-lg text-body-normal flex items-center gap-3 py-4 px-5">
          <div>😃</div>
          <div>
            Token-bound account deployed successfully. You can check the tx on{" "}
            <Link
              className="text-violet-700 hover:text-violet-600 duration-200"
              href={`https://mumbai.polygonscan.com/tx/${deployTxHash}`}
              target="_blank"
            >
              Polygonscan
            </Link>
          </div>
        </div>
      );

      router.refresh();
    }

    if (isDeployError) toast.error(`Failed with error: ${deployError?.message}`);
  }, [isDeploySuccess, isDeployError, deployError?.message, deployTxHash, router]);

  // Sign TBA tx watcher
  useEffect(() => {
    if (isSignSuccess) {
      toast.custom(
        <div className="w-[350px] bg-light-1 shadow-lg rounded-lg text-body-normal flex items-center gap-3 py-4 px-5">
          <div>😃</div>
          <div>
            Token-bound account signed successfully. You can check the tx on{" "}
            <Link
              className="text-violet-700 hover:text-violet-600 duration-200"
              href={`https://mumbai.polygonscan.com/tx/${signTx?.hash}`}
              target="_blank"
            >
              Polygonscan
            </Link>
          </div>
        </div>
      );

      router.refresh();
    }

    if (isSignError) toast.error(`Failed with error: ${signError?.message}`);
  }, [isSignSuccess, isSignError, signError?.message, signTx?.hash, router]);

  // Activate TBA tx watcher
  useEffect(() => {
    if (isActivateSuccess) {
      toast.custom(
        <div className="w-[350px] bg-light-1 shadow-lg rounded-lg text-body-normal flex items-center gap-3 py-4 px-5">
          <div>😃</div>
          <div>
            Token-bound account activated successfully. You can check the tx on{" "}
            <Link
              className="text-violet-700 hover:text-violet-600 duration-200"
              href={`https://mumbai.polygonscan.com/tx/${activateTx?.hash}`}
              target="_blank"
            >
              Polygonscan
            </Link>
          </div>
        </div>
      );

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
    if (isTbaActivated || !tbaDeployed) return;

    toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

    activateWrite?.();
  }

  const tbaInfo = [
    { info: hiddenAddress(tba), title: "Token-bound account" },
    { info: tbaDeployed ? "Deployed" : "Not deployed", title: "TBA deployed" },
    { info: isTbaSigned ? "Signed" : "Not signed", title: "TBA signed" },
    { info: isTbaActivated ? "Activated" : "Not activated", title: "TBA authorization" },
  ];
  const tbaCard: JSX.Element[] = tbaInfo.map((info, index) => (
    <div key={index} className="flex flex-col gap-2">
      <div className="text-small-medium text-zinc-500">{info.title}</div>
      <div className="text-small-medium line-clamp-1">{info.info}</div>
    </div>
  ));

  return (
    <>
      <TitleCard title="Token-bound account">
        <div className="grid grid-cols-4 gap-8">{tbaCard}</div>
      </TitleCard>

      <div className="flex flex-col justify-start gap-4">
        <form action={deployAction} className="h-[50px]">
          <AppButton
            text={tbaDeployed ? "TBA already deployed" : "Deploy this TBA"}
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
                  ? Boolean(isTbaSigned)
                    ? "TBA already signed"
                    : "Sign TBA to use SonarMeta"
                  : "TBA must be deployed to sign"
                : "Cannot sign"
            }
            otherPendingStatus={isSignLoading}
            pendingText={isSignLoading ? "Writing contract..." : "Deploying..."}
            disabled={!tbaDeployed || Boolean(isTbaSigned) || !signWrite}
            type="submit"
          />
        </form>

        <form action={activateAction} className="h-[50px]">
          <AppButton
            text={
              isTbaActivated
                ? "TBA already activated"
                : tbaDeployed
                ? "Activate authorization functionality"
                : "Only deployed and signed TBA can be activated"
            }
            otherPendingStatus={isActivateLoading}
            pendingText={isActivateLoading ? "Writing contract..." : "Activating..."}
            disabled={!tbaDeployed || Boolean(isTbaActivated) || !activateWrite}
            type="submit"
          />
        </form>
      </div>
    </>
  );
}
