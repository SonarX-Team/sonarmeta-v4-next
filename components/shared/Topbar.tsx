"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faFeather, faGear, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAccount, useDisconnect, useNetwork, useSignMessage } from "wagmi";
import toast from "react-hot-toast";

import { ConnectBtnRow } from "../wallet/ConnectBtnRow";
import AppToaster from "../ui/AppToaster";

import { navLinks } from "@/constants";
import { requestMessage, signOutUser, verifySignature } from "@/actions/user.action";
import { hiddenAddress } from "@/lib/utils";
import { lineaTestnet } from "viem/chains";

export default function Topbar({
  address,
  username,
  avatar,
}: {
  address: `0x${string}`;
  username: string;
  avatar: string;
}) {
  const [sidebarStatus, setSidebarStatus] = useState<boolean>(false);
  const [userLinkFlag, setUserLinkFlag] = useState<boolean>(false);
  const [wrongNetworkFlag, setWrongNetworkFlag] = useState<boolean>(false);

  const { address: signAddr, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();

  const handleSignOut = useCallback(
    async (normal?: boolean) => {
      disconnect(); // 先断开连接
      await signOutUser();
      if (normal) toast.success("Sign out successfully!");
    },
    [disconnect]
  );

  // 对于连接钱包以后，还没登录的用户进行签名
  useEffect(() => {
    async function handleSignIn() {
      if (!signAddr) return; // 回避typescript报错

      toast("You will be prompted to sign a message to authenticate, please check your wallet.", { icon: "✍️" });

      try {
        // 获取需要签名的信息
        const { message } = await requestMessage({ address: signAddr });

        if (message === "") return toast.error("Something went wrong with server!");

        // 发起签名
        const signature = await signMessageAsync({ message });

        // 验证签名
        const { status } = await verifySignature({ address: signAddr, message, signature });

        if (status === 200) toast.success("Sign in successfully!");
        else {
          disconnect();
          handleSignOut();
          toast.error("Failed to sign in!");
        }
      } catch (error) {
        disconnect();
        handleSignOut();
        toast.error("You rejected the request in your wallet!");
      }
    }

    if (address !== signAddr && isConnected) handleSignIn();
  }, [address, isConnected, disconnect, handleSignOut, signAddr, signMessageAsync]);

  useEffect(() => {
    // Wrong network watcher
    setWrongNetworkFlag(false);
    if (isConnected && chain?.name !== lineaTestnet.name) setWrongNetworkFlag(true);
  }, [chain?.name, isConnected]);

  return (
    <nav className="fixed top-0 z-30 w-full h-[60px] bg-light-1 shadow-sm">
      {wrongNetworkFlag && (
        <div className="fixed top-[60px] w-full text-center bg-violet-400 text-light-1 top-[100%] py-2">
          You are viewing data from the Linea Goerli Testnet, but your wallet is connected to an other network.
        </div>
      )}

      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex justify-between items-center gap-6">
          <Link href="/">
            <img className="w-[150px]" src="/logo-full.png" alt="logo" />
          </Link>

          <div className="w-[1px] h-[30px] bg-zinc-300 max-lg:hidden" />

          <div className="flex items-center text-base-semibold gap-8 leading-none max-lg:hidden">
            {navLinks.map((link, index) => (
              <Link href={link.route} key={index} className="text-zinc-800 hover:text-violet-700 duration-100">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center text-small-regular gap-2 leading-none">
          <ConnectBtnRow signed={address ? true : false} />

          <button
            className="lg:hidden flex justify-center items-center bg-violet-100 hover:bg-violet-200/70 duration-200 rounded-lg w-[42px] h-[42px] gap-2"
            type="button"
            onClick={() => {
              const sidebar = document.getElementById("rightSidebar");
              sidebarStatus
                ? sidebar?.classList.add("translate-x-full")
                : sidebar?.classList.remove("translate-x-full");
              setSidebarStatus((prev) => !prev);
            }}
          >
            <FontAwesomeIcon className="w-[16px] h-[16px] text-slate-500" icon={faBars} />
          </button>

          {address && username && (
            <div className="relative">
              <button
                className="flex justify-center items-center bg-violet-100 hover:bg-violet-200/70 duration-200 rounded-lg w-[42px] h-[42px] gap-2"
                onMouseEnter={() => setUserLinkFlag(true)}
                onMouseLeave={() => setUserLinkFlag(false)}
                type="button"
                onClick={() => setUserLinkFlag(true)}
              >
                {avatar ? (
                  <img src={avatar} alt="user-avatar" className="w-[30px] h-[30px] rounded-full" />
                ) : (
                  <img src="/user.png" alt="user-avatar" className="w-[30px] h-[30px] rounded-full" />
                )}
              </button>

              {userLinkFlag && (
                <div
                  className="flex flex-col gap-2 min-w-[260px] text-zinc-700 text-sm bg-light-1 shadow-lg absolute top-11 right-0 rounded-xl py-3"
                  onMouseEnter={() => setUserLinkFlag(true)}
                  onMouseLeave={() => setUserLinkFlag(false)}
                >
                  <div className="flex items-center px-6 py-2 gap-2">
                    {avatar ? (
                      <img className="w-[42px] h-[42px] bg-violet-100 rounded-full" src={avatar} alt="avatar" />
                    ) : (
                      <img className="w-[42px] h-[42px] bg-violet-100 rounded-full" src="/user.png" alt="avatar" />
                    )}

                    <div>
                      <h3 className="text-body-bold line-clamp-1">{username}</h3>
                      {address && <p className="text-sm text-zinc-500">{hiddenAddress(address)}</p>}
                    </div>
                  </div>

                  <div className="border-b-[1px] border-zinc-200" />

                  <Link
                    className="flex gap-2 items-center text-base-semibold hover:bg-zinc-100 duration-200 rounded-md mx-4 p-4"
                    href="/studio"
                  >
                    <FontAwesomeIcon className="w-[16px] h-[16px] text-slate-500" icon={faFeather} />
                    <span>Studio</span>
                  </Link>

                  <div className="border-b-[1px] border-zinc-200" />

                  <Link
                    className="flex gap-2 items-center text-base-semibold hover:bg-zinc-100 duration-200 rounded-md mx-4 p-4"
                    href="/space"
                  >
                    <FontAwesomeIcon className="w-[16px] h-[16px] text-slate-500" icon={faUser} />
                    <span>Profile space</span>
                  </Link>

                  <Link
                    className="flex gap-2 items-center text-base-semibold hover:bg-zinc-100 duration-200 rounded-md mx-4 p-4"
                    href="/account"
                  >
                    <FontAwesomeIcon className="w-[16px] h-[16px] text-slate-500" icon={faGear} />
                    <span>Account settings</span>
                  </Link>

                  <div className="border-b-[1px] border-zinc-200" />

                  <button
                    className="flex gap-2 items-center text-base-semibold hover:bg-zinc-100 duration-200 rounded-md mx-4 p-4"
                    onClick={() => handleSignOut(true)}
                    type="button"
                  >
                    <FontAwesomeIcon className="w-[16px] h-[16px] text-slate-500" icon={faSignOut} />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AppToaster />
    </nav>
  );
}
