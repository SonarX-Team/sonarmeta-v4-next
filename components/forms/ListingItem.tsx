"use client";

import { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TokenboundClient } from "@tokenbound/sdk";
import { useContractRead, useNetwork } from "wagmi";
import { parseEther, WalletClient, createWalletClient, encodeFunctionData, custom, formatEther } from "viem";
import { polygonMumbai } from "viem/chains";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import toast from "react-hot-toast";

import AppButton from "../ui/AppButton";
import AppModal from "../ui/AppModal";
import TxToast from "../ui/TxToast";

import { upsertListing } from "@/actions/listing.action";
import { AUTHORIZATION_CONTRACT, MAIN_CONTRACT, MARKETPLACE_CONTRACT } from "@/constants";
import authorizationContractAbi from "@/contracts/sonarmeta/Authorization.json";
import marketplaceContractAbi from "@/contracts/sonarmeta/Marketplace.json";
import { creationsType } from "@/types/creation.type";

export default function ListingItem({
  tokenId,
  title,
  description,
  avatar,
  userAddr,
  tbaAddr,
}: creationsType & { userAddr: `0x${string}`; tbaAddr: `0x${string}` }) {
  const path = usePathname();
  const router = useRouter();

  const [basePrice, setBasePrice] = useState<number>(0);
  const [amount, setAmount] = useState<number>(1);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [walletClient, setWalletClient] = useState<WalletClient>();

  const { chain } = useNetwork();

  // @ts-ignore
  const tokenboundClient = useMemo(() => new TokenboundClient({ walletClient, chain: polygonMumbai }), [walletClient]);

  const { data: listing } = useContractRead({
    address: MARKETPLACE_CONTRACT,
    abi: marketplaceContractAbi,
    functionName: "getListing",
    chainId: chain?.id,
    // @ts-ignore
    args: [tokenId, tbaAddr],
  }) as { data: { amount: bigint; basePrice: bigint } };

  const { data: available } = useContractRead({
    address: AUTHORIZATION_CONTRACT,
    abi: authorizationContractAbi,
    functionName: "balanceOf",
    chainId: chain?.id,
    // @ts-ignore
    args: [tbaAddr, tokenId],
  }) as { data: bigint };

  // onMounted, when window object is available
  useEffect(() => {
    if (!window) return;

    const wc: WalletClient = createWalletClient({
      account: userAddr,
      chain: polygonMumbai,
      // @ts-ignore
      transport: window.ethereum ? custom(window.ethereum) : http(),
    });
    setWalletClient(wc);

    if (!listing) return;

    setBasePrice(Number(formatEther(listing.basePrice)));
    setAmount(Number(listing.amount));
  }, [userAddr, listing]);

  async function listAction() {
    const isValidSigner = await tokenboundClient.isValidSigner({
      account: tbaAddr,
    });

    if (!isValidSigner) return toast.error("Your account is not the valid signer of your TBA");

    //@ts-ignore
    const functionData = encodeFunctionData({
      abi: marketplaceContractAbi,
      functionName: "listAuthorization",
      args: [tokenId, amount, parseEther(basePrice.toString()), MAIN_CONTRACT],
    });

    try {
      toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

      const txHash = await tokenboundClient.execute({
        account: tbaAddr,
        to: MARKETPLACE_CONTRACT,
        // @ts-ignore
        value: 0n,
        data: functionData,
      });

      toast.custom(<TxToast title="Listed successfully!" hash={txHash} />);

      const { status } = await upsertListing({ tokenId, seller: tbaAddr, path });

      if (status === 500) toast.error("Internal server error.");

      router.refresh();
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

          <form action={listAction} className="flex flex-col gap-6">
            <div>
              <label className="text-body-bold">Base price</label>
              <p className="text-zinc-500 mb-2">Set the price per token in MATIC</p>

              <div className="flex border-[1px] bg-transparent border-zinc-300 hover:border-zinc-500 rounded-md duration-200">
                <input
                  className="flex-1 border-none outline-none bg-transparent py-2 mx-4"
                  placeholder="Set the price per token in MATIC"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  type="number"
                />
              </div>
            </div>

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
                  type="button"
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
                  type="button"
                >
                  +
                </button>
              </div>
            </div>

            <hr />

            <div className="h-[50px]">
              <AppButton text="List" pendingText="Writing contract..." />
            </div>
          </form>
        </div>
      </AppModal>

      <tr>
        {/* Represent for */}
        <td className="border-b-[1px] border-zinc-300 py-6">
          <div className="flex items-center gap-2">
            <img src={avatar} alt="creation-image" className="w-[64px] aspect-[1] rounded-md" />

            <div className="flex items-center gap-1">
              <FontAwesomeIcon className="w-[18px] text-violet-400" icon={faEthereum} />
              <p className="text-body-bold leading-none">#{tokenId}</p>
            </div>
          </div>
        </td>

        {/* Available */}
        <td className="border-b-[1px] border-zinc-300 py-6">{Number(available)}</td>

        {/* Base price */}
        <td className="border-b-[1px] border-zinc-300 py-6">{listing && Number(formatEther(listing.basePrice))}</td>

        {/* Amount to sell */}
        <td className="border-b-[1px] border-zinc-300 py-6">{listing && Number(listing.amount)}</td>

        <td className="border-b-[1px] border-zinc-300 text-small-regular py-6">
          <AppButton text="List" handleClick={() => setModalOpen(true)} />
        </td>
      </tr>
    </>
  );
}
