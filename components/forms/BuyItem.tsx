"use client";

import { useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { prepareWriteContract, writeContract, waitForTransaction, readContract } from "@wagmi/core";
import { decodeAbiParameters, keccak256, toBytes } from "viem";

import AppButton from "../ui/AppButton";

import tokenMessengerAbi from "@/contracts/cctp/TokenMessenger.json";
import messageAbi from "@/contracts/cctp/Message.json";
import usdcAbi from "@/contracts/cctp/Usdc.json";
import messageTransmitterAbi from "@/contracts/cctp/MessageTransmitter.json";
import marketplaceAbi from "@/contracts/sonarmeta/marketplace.json";

import {
  AVAX_MESSAGE_TRANSMITTER_CONTRACT_ADDRESS,
  ETH_MESSAGE_CONTRACT_ADDRESS,
  ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS,
  MARKETPLACE_CONTRACT,
  USDC_ETH_CONTRACT_ADDRESS,
} from "@/constants";

export default function BuyItem({ price, tokenId, amount }: { price: number; tokenId: number; amount: number }) {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const [messageBytes, setMessageBytes] = useState<string>("");
  const [attestationSignature, setAttestationSignature] = useState<string>("");

  const AVAX_DESTINATION_DOMAIN = 1;

  async function cctpAction() {
    // STEP 1: Approve messenger contract to withdraw from our active eth address
    const approveTx = await writeContract(
      await prepareWriteContract({
        address: USDC_ETH_CONTRACT_ADDRESS,
        abi: usdcAbi,
        functionName: "approve",
        chainId: chain?.id,
        // @ts-ignore
        args: [ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS, price],
      })
    );
    const approveTxReceipt = await waitForTransaction({ hash: approveTx.hash });
    console.log("Successfully with ApproveTx and Receipt: ", approveTxReceipt);

    // STEP 2: Burn USDC
    const destinationAddressInBytes32 = await readContract({
      address: ETH_MESSAGE_CONTRACT_ADDRESS,
      abi: messageAbi,
      functionName: "addressToBytes32",
      chainId: chain?.id,
      // @ts-ignore
      args: [address],
    });

    console.log("Destination address in bytes32 is: ", destinationAddressInBytes32);

    const burnTx = await writeContract(
      await prepareWriteContract({
        address: ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS,
        abi: tokenMessengerAbi,
        functionName: "depositForBurn",
        chainId: chain?.id,
        // @ts-ignore
        args: [price, AVAX_DESTINATION_DOMAIN, destinationAddressInBytes32, USDC_ETH_CONTRACT_ADDRESS],
      })
    );
    const burnTxReceipt = await waitForTransaction({ hash: burnTx.hash });
    console.log("Successfully with BurnTx and Receipt: ", burnTxReceipt);

    // STEP 3: Retrieve message bytes from logs
    const eventTopic = keccak256(toBytes("MessageSent(bytes)"));
    console.log("event topic is: ", eventTopic);
    const log = burnTxReceipt.logs.find((l: any) => l.topics[0] === eventTopic);
    console.log("log data is: ", log?.data);

    // @ts-ignore
    const messageBytes = decodeAbiParameters([{ name: "bytes", type: "bytes" }], log.data)[0];
    const messageHash = keccak256(toBytes(messageBytes));

    console.log(`MessageBytes: ${messageBytes}`);
    console.log(`MessageHash: ${messageHash}`);

    setMessageBytes(messageBytes);

    // STEP 4: Fetch attestation signature
    console.log("Now start while loop, please wait a moment...");

    let attestationResponse = { status: "pending", attestation: "" };
    while (attestationResponse.status != "complete") {
      const response = await fetch(`https://iris-api-sandbox.circle.com/attestations/${messageHash}`);
      attestationResponse = await response.json();
      await new Promise((r) => setTimeout(r, 2000));
    }

    const attestationSignature = attestationResponse.attestation;
    console.log(`Signature: ${attestationSignature}`);

    setAttestationSignature(attestationSignature);

    alert("Now you can switch network to Avalanch Fuji to receive and purchase.");
  }

  async function receiveAction() {
    console.log(messageBytes);
    console.log(attestationSignature);

    // STEP 5: Using the message bytes and signature recieve the funds on destination chain and address
    const receiveTx = await writeContract(
      await prepareWriteContract({
        address: AVAX_MESSAGE_TRANSMITTER_CONTRACT_ADDRESS,
        abi: messageTransmitterAbi,
        functionName: "receiveMessage",
        chainId: chain?.id,
        // @ts-ignore
        args: [messageBytes, attestationSignature],
      })
    );
    const receiveTxReceipt = await waitForTransaction({ hash: receiveTx.hash });
    console.log("ReceiveTxReceipt: ", receiveTxReceipt);

    alert("Now you can purchase.");
  }

  async function buyAction() {
    const buyTx = await writeContract(
      await prepareWriteContract({
        address: MARKETPLACE_CONTRACT,
        abi: marketplaceAbi,
        functionName: "buyItem",
        chainId: chain?.id,
        // @ts-ignore
        args: [tokenId, amount],
      })
    );
    const buyTxReceipt = await waitForTransaction({ hash: buyTx.hash });
    console.log("BuyTxReceipt: ", buyTxReceipt);
  }

  return (
    <div className="flex flex-col gap-4">
      <form action={buyAction} className="h-[50px]">
        <AppButton text="Purchase" pendingText="Purchasing..." type="submit" />
      </form>

      <div className="flex items-center">
        <hr className="w-full" />
        <p className="px-4 py-2 leading-none text-small-regular text-zinc-500">OR</p>
        <hr className="w-full" />
      </div>

      <form action={cctpAction} className="h-[50px]">
        <AppButton text="Bridge" pendingText="Transfering..." type="submit" />
      </form>
      <form action={receiveAction} className="h-[50px]">
        <AppButton text="Receive" pendingText="Receiving..." type="submit" />
      </form>
    </div>
  );
}
