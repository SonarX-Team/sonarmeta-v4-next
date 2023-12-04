"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useContractRead, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { formatEther, parseEther } from "viem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import toast from "react-hot-toast";

import AppButton from "../ui/AppButton";
import AppModal from "../ui/AppModal";
import TxToast from "../ui/TxToast";

import { removeListing } from "@/actions/listing.action";
import { MARKETPLACE_CONTRACT } from "@/constants";
import marketplaceContractAbi from "@/contracts/sonarmeta/Marketplace.json";
import { hiddenAddress } from "@/lib/utils";

export default function BuyListing({
  tokenId,
  title,
  description,
  avatar,
  seller,
}: {
  tokenId: number;
  title: string;
  description: string;
  avatar: string;
  seller: `0x${string}`;
}) {
  const path = usePathname();
  const router = useRouter();

  const [amount, setAmount] = useState<number>(1);
  const [available, setAvailable] = useState<string>("");
  const [basePrice, setBasePrice] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const { chain } = useNetwork();

  const { data: listing } = useContractRead({
    address: MARKETPLACE_CONTRACT,
    abi: marketplaceContractAbi,
    functionName: "getListing",
    chainId: chain?.id,
    // @ts-ignore
    args: [tokenId, seller],
  }) as { data: { amount: bigint; basePrice: bigint } };

  const { config } = usePrepareContractWrite({
    address: MARKETPLACE_CONTRACT,
    abi: marketplaceContractAbi,
    functionName: "buyItem",
    value: parseEther((Number(basePrice) * amount).toString()),
    chainId: chain?.id,
    // @ts-ignore
    args: [tokenId, seller, amount], // _from, _to, _tokenId
  });

  const { data: tx, writeAsync } = useContractWrite(config);

  const { error, isSuccess, isError, isLoading } = useWaitForTransaction({
    hash: tx?.hash,
  });

  // Tx receipt watcher
  useEffect(() => {
    if (isSuccess) {
      toast.custom(<TxToast title="Bought listing successfully!" hash={tx?.hash} />);
      router.refresh();
    }

    if (isError) toast.error(`Failed with error: ${error?.message}`);
  }, [isSuccess, isError, tx?.hash, error?.message, router]);

  // onMounted
  useEffect(() => {
    if (!listing) return;

    setBasePrice(formatEther(listing.basePrice));
    setAvailable(listing.amount.toString());
  }, [listing]);

  async function buyAction() {
    toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

    try {
      await writeAsync?.();

      if (amount === Number(available)) await removeListing({ tokenId, seller, path });
    } catch (error: any) {
      if (error.message.includes("User rejected the request.")) toast.error("You rejected the request in your wallet.");
    }
  }

  return (
    <>
      <AppModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex flex-col gap-8">
          <h1 className="text-heading3-normal">Buy authorization token</h1>

          <div className="flex items-center gap-4">
            <img src={avatar} alt="creation-image" className="w-[108px] aspect-[1] rounded-md" />

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <p className="text-body-bold leading-none">{title}</p>
                <FontAwesomeIcon className="w-[18px] text-violet-400" icon={faEthereum} />
                <p className="text-body-bold leading-none">#{tokenId}</p>
              </div>

              <div className="text-base-regular text-zinc-700 line-clamp-3">{description}</div>
            </div>
          </div>

          <hr />

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-2">
              <div className="flex-1">
                <label className="text-body-bold">Amount</label>
                <p className="text-zinc-500">Set the amount you want to buy</p>
              </div>

              <div className="flex items-center max-w-[150px] border-[1px] border-zinc-300 rounded-xl p-2">
                <button
                  className="flex justify-center items-center text-body-normal text-zinc-700 px-2"
                  onClick={() =>
                    setAmount((prev) => {
                      if (prev > 1) return prev - 1;
                      else return 1;
                    })
                  }
                >
                  -
                </button>
                <input
                  className="w-full text-center border-none outline-none bg-transparent text-body-normal"
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    if (Number(e.target.value) >= Number(available)) setAmount(Number(available));
                    else if (Number(e.target.value) > 0) setAmount(Number(e.target.value));
                    else setAmount(1);
                  }}
                />
                <button
                  className="flex justify-center items-center text-body-normal text-zinc-700 px-2"
                  onClick={() =>
                    setAmount((prev) => {
                      if (prev < Number(available)) return prev + 1;
                      else return Number(available);
                    })
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center gap-4">
              <div className="flex-1">
                <label className="text-body-bold">Total price</label>
                <p className="text-zinc-500">price = amount * base price</p>
              </div>
              <p className="text-body-bold">{(Number(basePrice) * amount).toFixed(4)} MATIC</p>
            </div>
          </div>

          <hr />

          <form action={buyAction} className="h-[50px]">
            <AppButton
              text={writeAsync ? "Buy now" : "Cannot buy"}
              otherPendingStatus={isLoading}
              pendingText={isLoading ? "Writing contract..." : "Buying..."}
              disabled={!writeAsync}
              type="submit"
            />
          </form>
        </div>
      </AppModal>

      <tr>
        {/* Represent for */}
        <td className="border-b-[1px] border-zinc-300 py-6">
          <div className="flex items-center gap-2">
            <img src={avatar} alt="creation-image" className="w-[81px] aspect-[1] rounded-md" />

            <div className="flex items-center gap-1">
              <FontAwesomeIcon className="w-[18px] text-violet-400" icon={faEthereum} />
              <p className="text-body-bold leading-none">#{tokenId}</p>
            </div>
          </div>
        </td>

        {/* Seller */}
        <td className="border-b-[1px] border-zinc-300 py-6">{hiddenAddress(seller)}</td>

        {/* Base price */}
        <td className="border-b-[1px] border-zinc-300 py-6">{basePrice} MATIC</td>

        {/* Available */}
        <td className="border-b-[1px] border-zinc-300 py-6">{Number(available)}</td>

        <td className="border-b-[1px] border-zinc-300 text-small-regular py-6">
          <AppButton text="Buy now" handleClick={() => setModalOpen(true)} />
        </td>
      </tr>
    </>
  );
}
