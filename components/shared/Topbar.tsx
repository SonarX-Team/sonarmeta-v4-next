"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import { ConnectBtnRow } from "../wallet/ConnectBtnRow";
import { navLinks } from "@/constants";
import { useState } from "react";

export default function Topbar({ userId, username, avatar }: { userId: string; username: string; avatar: string }) {
  const [sidebarStatus, setSidebarStatus] = useState<boolean>(false);

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

        {username && avatar && (
          <Link
            className="flex justify-center items-center bg-violet-100 hover:bg-violet-200/70 duration-200 rounded-lg w-[42px] h-[42px] gap-2"
            href="/space"
          >
            <img src={avatar} alt="user-avatar" className="w-[30px] h-[30px] rounded-full" />
          </Link>
        )}
        {(!username || !avatar) && (
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
