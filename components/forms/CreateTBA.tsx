"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TokenboundClient } from "@tokenbound/sdk";
import { useContractRead, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { http, createWalletClient, WalletClient, custom } from "viem";
import { polygonMumbai } from "viem/chains";
import toast from "react-hot-toast";

import TitleCard from "../cards/TitleCard";
import CreationPicker from "../ui/CreationPicker";
import AppButton from "../ui/AppButton";
import SadPlaceholder from "../shared/SadPlaceholder";

import { MAIN_CONTRACT, AUTHORIZATION_CONTRACT, CREATION_CONTRACT } from "@/constants";
import { creationsType } from "@/types/creation.type";
import { formatDateString, hiddenAddress } from "@/lib/utils";

import mainContractAbi from "@/contracts/sonarmeta/SonarMeta.json";
import authorizationContractAbi from "@/contracts/sonarmeta/Authorization.json";
import { useRouter } from "next/navigation";

export default function CreateTBA({ address, creations }: { address: `0x${string}`; creations: creationsType[] }) {
  const router = useRouter();

  const [currentTba, setCurrentTba] = useState<`0x${string}`>("0x");
  const [currentTbaDeployed, setCurrentTbaDeployed] = useState<boolean>(false);
  const [pickedTokenId, setPickedTokenId] = useState<number>(0);
  const [createTxHash, setCreateTxHash] = useState<`0x${string}`>();
  const [walletClient, setWalletClient] = useState<WalletClient>();

  // @ts-ignore
  const tokenboundClient = useMemo(() => new TokenboundClient({ walletClient, chain: polygonMumbai }), [walletClient]);

  const { chain } = useNetwork();

  const { data: isCurrentTbaSigned } = useContractRead({
    address: MAIN_CONTRACT,
    abi: mainContractAbi,
    functionName: "isTbaSigned",
    chainId: chain?.id,
    // @ts-ignore
    args: [currentTba],
  });

  const { data: isCurrentTbaActivated } = useContractRead({
    address: AUTHORIZATION_CONTRACT,
    abi: authorizationContractAbi,
    functionName: "exists",
    chainId: chain?.id,
    // @ts-ignore
    args: [pickedTokenId],
  });

  const { config: signConfig } = usePrepareContractWrite({
    address: MAIN_CONTRACT,
    abi: mainContractAbi,
    functionName: "signToUse",
    chainId: chain?.id,
    // @ts-ignore
    args: [currentTba, pickedTokenId],
  });

  const { data: signTx, write: signWrite } = useContractWrite(signConfig);

  const { config: activateConfig } = usePrepareContractWrite({
    address: MAIN_CONTRACT,
    abi: mainContractAbi,
    functionName: "activateAuthorization",
    chainId: chain?.id,
    // @ts-ignore
    args: [currentTba, pickedTokenId],
  });

  const { data: activateTx, write: activateWrite } = useContractWrite(activateConfig);

  const {
    error: createError,
    isSuccess: isCreateSuccess,
    isLoading: isCreateLoading,
    isError: isCreateError,
  } = useWaitForTransaction({
    hash: createTxHash,
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
        tokenId: pickedTokenId.toString(),
      });

      setCurrentTba(tba);

      const isAccountDeployed = await tokenboundClient.checkAccountDeployment({
        accountAddress: tba,
      });

      setCurrentTbaDeployed(isAccountDeployed);
    }

    watchTba();
  }, [pickedTokenId, tokenboundClient]);

  // Create TBA tx watcher
  useEffect(() => {
    if (isCreateSuccess) {
      toast.custom(
        <div className="w-[350px] bg-light-1 shadow-lg rounded-lg text-body-normal flex items-center gap-3 py-4 px-5">
          <div>😃</div>
          <div>
            Token-bound account deployed successfully. You can check the tx on{" "}
            <Link
              className="text-violet-700 hover:text-violet-600 duration-200"
              href={`https://mumbai.polygonscan.com/tx/${createTxHash}`}
              target="_blank"
            >
              Polygonscan
            </Link>
          </div>
        </div>
      );

      router.refresh();
      setPickedTokenId(0);
    }

    if (isCreateError) toast.error(`Failed with error: ${createError?.message}`);
  }, [isCreateSuccess, isCreateError, createError?.message, createTxHash, router]);

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
      setPickedTokenId(0);
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
      setPickedTokenId(0);
    }

    if (isActivateError) toast.error(`Failed with error: ${activateError?.message}`);
  }, [isActivateSuccess, isActivateError, activateError?.message, activateTx?.hash, router]);

  async function createAction() {
    if (currentTbaDeployed) return;

    toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

    try {
      const { account, txHash: createTxHash } = await tokenboundClient.createAccount({
        tokenContract: CREATION_CONTRACT,
        tokenId: pickedTokenId.toString(),
      });

      setCreateTxHash(createTxHash);
      setCurrentTba(account);
    } catch (error) {
      toast.error("You denied transaction signature.");
    }
  }

  async function signAction() {
    if (!currentTbaDeployed) return;

    toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

    signWrite?.();
  }

  async function activateAction() {
    if (isCurrentTbaActivated || !currentTbaDeployed) return;

    toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

    activateWrite?.();
  }

  return (
    <>
      <CreationPicker
        label="Pick a creation"
        creations={creations}
        getCreation={(tokenId) => setPickedTokenId(tokenId)}
        required={true}
      />

      <TitleCard title="Token details">
        <>
          {creations?.map((creation, index) => {
            if (creation.tokenId !== pickedTokenId) return;

            const detailInfo = [
              { info: `#${pickedTokenId}`, title: "Token ID" },
              { info: "ERC-721", title: "Token standard" },
              { info: hiddenAddress(CREATION_CONTRACT), title: "Contract address" },
              { info: hiddenAddress(address), title: "Owner" },
              { info: hiddenAddress(currentTba), title: "Token-bound account" },
              { info: currentTbaDeployed ? "Deployed" : "Not deployed", title: "TBA deployed" },
              { info: isCurrentTbaSigned ? "Signed" : "Not signed", title: "TBA Signed" },
              { info: isCurrentTbaActivated ? "Activated" : "Not activated", title: "TBA Authorization" },
              { info: creation.externalLink ? creation.externalLink : "-", title: "External link" },
              { info: formatDateString(creation.createdAt), title: "Minted at" },
            ];
            const detailCard: JSX.Element[] = detailInfo.map((info, index) => (
              <div key={index} className="flex flex-col gap-2">
                <p className="text-small-medium text-zinc-500">{info.title}</p>
                <p className="text-small-medium line-clamp-1">{info.info}</p>
              </div>
            ));

            return (
              <div key={index} className="flex flex-col gap-8">
                <div className="grid grid-cols-4 gap-8">{detailCard}</div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-small-medium text-zinc-500">Description</h3>
                  <p className="text-small-medium line-clamp-6 whitespace-pre-line">{creation.description}</p>
                </div>
              </div>
            );
          })}

          {pickedTokenId === 0 && <SadPlaceholder size={300} text="No creation picked" />}
        </>
      </TitleCard>

      <div className="flex flex-col justify-start gap-4">
        <form action={createAction} className="h-[50px]">
          <AppButton
            text={
              pickedTokenId === 0 ? "Pick a creation first" : currentTbaDeployed ? "Already deployed" : "Deploy the TBA"
            }
            otherPendingStatus={isCreateLoading}
            pendingText={isCreateLoading ? "Writing contract..." : "Deploying..."}
            disabled={pickedTokenId === 0 || currentTbaDeployed}
            type="submit"
          />
        </form>

        <form action={signAction} className="h-[50px]">
          <AppButton
            text={
              pickedTokenId === 0
                ? "Pick a creation first"
                : signWrite
                ? currentTbaDeployed
                  ? Boolean(isCurrentTbaSigned)
                    ? "Already signed"
                    : "Sign TBA to use SonarMeta"
                  : "TBA must be deployed to sign"
                : "Cannot sign"
            }
            otherPendingStatus={isSignLoading}
            pendingText={isSignLoading ? "Writing contract..." : "Deploying..."}
            disabled={pickedTokenId === 0 || !currentTbaDeployed || Boolean(isCurrentTbaSigned) || !signWrite}
            type="submit"
          />
        </form>

        <form action={activateAction} className="h-[50px]">
          <AppButton
            text={
              pickedTokenId === 0
                ? "Pick a creation first"
                : activateWrite
                ? isCurrentTbaActivated
                  ? "Already activated"
                  : currentTbaDeployed
                  ? "Activate authorization functionality"
                  : "Only deployed and signed TBA can be activated"
                : "Cannot activate"
            }
            otherPendingStatus={isActivateLoading}
            pendingText={isActivateLoading ? "Writing contract..." : "Activating..."}
            disabled={pickedTokenId === 0 || !currentTbaDeployed || Boolean(isCurrentTbaActivated) || !activateWrite}
            type="submit"
          />
        </form>
      </div>
    </>
  );
}
