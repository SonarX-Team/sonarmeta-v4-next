"use client";

import { useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDisconnect } from "wagmi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

import { navLinks } from "@/constants";
import { signOutUser } from "@/actions/user.action";

import { ConnectBtnCol } from "../wallet/ConnectBtnCol";

export default function RightSidebar({ loginStatus }: { loginStatus: boolean }) {
  const pathname = usePathname();

  const { disconnect } = useDisconnect();

  const handleSignOut = useCallback(async () => {
    disconnect(); // 先断开连接
    await signOutUser();
    toast.success("Sign out successfully!");
  }, [disconnect]);

  return (
    <section id="rightSidebar" className="custom-scrollbar rightsidebar translate-x-full">
      <div className="flex flex-col justify-between h-full px-6">
        <div className="flex flex-col flex-1 w-full gap-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.route;

            return (
              <Link
                href={link.route}
                key={link.label}
                className={`rightsidebar_link ${
                  isActive ? "bg-violet-200 hover:bg-violet-200/70" : "hover:bg-violet-100"
                } duration-100`}
              >
                <FontAwesomeIcon className="w-[20px] h-[20px] text-slate-500" icon={link.icon} />
                <p className="text-dark-1">{link.label}</p>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col w-full gap-4">
          <ConnectBtnCol signed={loginStatus} />

          {loginStatus && (
            <button className="rightsidebar_link hover:bg-zinc-100 duration-100" type="button" onClick={handleSignOut}>
              <FontAwesomeIcon className="w-[20px] h-[20px] text-slate-500" icon={faArrowRightFromBracket} />
              <p className="text-dark-1">Sign out</p>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
