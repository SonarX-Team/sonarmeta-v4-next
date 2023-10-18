"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faGear, faSignOut, faUser, faWallet } from "@fortawesome/free-solid-svg-icons";

import { ConnectBtnRow } from "../wallet/ConnectBtnRow";
import { navLinks } from "@/constants";
import { signOutUser } from "@/actions/user.action";

export default function Topbar({
  userId,
  phone,
  username,
  avatar,
}: {
  userId: string;
  phone: string;
  username: string;
  avatar: string;
}) {
  const router = useRouter();

  const [sidebarStatus, setSidebarStatus] = useState<boolean>(false);
  const [userLinkFlag, setUserLinkFlag] = useState<boolean>(false);

  async function handleSignOut() {
    const res = await signOutUser();
    if (res.message === "Signed out") router.replace("/sign-in");
  }

  return (
    <nav className="topbar">
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
        <ConnectBtnRow />

        <button
          className="md:hidden flex justify-center items-center bg-violet-100 hover:bg-violet-200/70 duration-200 rounded-lg w-[42px] h-[42px] gap-2"
          type="button"
          onClick={() => {
            const sidebar = document.getElementById("rightSidebar");
            sidebarStatus ? sidebar?.classList.add("translate-x-full") : sidebar?.classList.remove("translate-x-full");
            setSidebarStatus((prev) => !prev);
          }}
        >
          <FontAwesomeIcon className="w-[16px] h-[16px] text-slate-500" icon={faBars} />
        </button>

        {userId && username && avatar && (
          <div className="relative">
            <button
              className="flex justify-center items-center bg-violet-100 hover:bg-violet-200/70 duration-200 rounded-lg w-[42px] h-[42px] gap-2"
              onMouseEnter={() => setUserLinkFlag(true)}
              onMouseLeave={() => setUserLinkFlag(false)}
              type="button"
              onClick={() => setUserLinkFlag(true)}
            >
              <img src={avatar} alt="user-avatar" className="w-[30px] h-[30px] rounded-full" />
            </button>

            {userLinkFlag && (
              <div
                className="flex flex-col gap-2 min-w-[260px] text-zinc-700 text-sm bg-light-1 shadow-lg absolute top-11 right-0 rounded-xl py-3"
                onMouseEnter={() => setUserLinkFlag(true)}
                onMouseLeave={() => setUserLinkFlag(false)}
              >
                <div className="flex items-center px-6 py-2 gap-2">
                  <div className="w-[42px] h-[42px]">
                    <img className="rounded-full" src={avatar} alt="avatar" />
                  </div>

                  <div>
                    <h3 className="text-body-bold">{username}</h3>
                    <p className="text-sm text-zinc-500">{phone}</p>
                  </div>
                </div>

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
                  onClick={handleSignOut}
                  type="button"
                >
                  <FontAwesomeIcon className="w-[16px] h-[16px] text-slate-500" icon={faSignOut} />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        )}

        {(!userId || !username || !avatar) && (
          <Link
            className="flex justify-center items-center h-[42px] bg-violet-200 hover:bg-violet-200/70 duration-200 text-zinc-800 rounded-md px-4"
            href="/sign-in"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
