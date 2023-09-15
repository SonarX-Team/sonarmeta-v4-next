"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faWallet } from "@fortawesome/free-solid-svg-icons";

import { sidebarLinks } from "@/constants";

export default function LeftSidebar() {
  const pathname = usePathname();

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex flex-col justify-between h-full px-6">
        <div className="flex flex-col flex-1 w-full gap-4">
          {sidebarLinks.map((link) => {
            const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

            return (
              <Link href={link.route} key={link.label} className={`leftsidebar_link ${isActive && "bg-primary-500 "}`}>
                <FontAwesomeIcon className="w-[24px] h-[24px] text-light-2" icon={link.icon} />
                <p className="text-light-1 max-lg:hidden">{link.label}</p>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col w-full gap-4">
          <div className="leftsidebar_link cursor-pointer">
            <FontAwesomeIcon className="w-[24px] h-[24px] text-light-2" icon={faWallet} />
            <p className="text-light-1 max-lg:hidden">连接钱包</p>
          </div>
          <div className="leftsidebar_link cursor-pointer">
            <FontAwesomeIcon className="w-[24px] h-[24px] text-light-2" icon={faArrowRightFromBracket} />
            <p className="text-light-1 max-lg:hidden">退出登录</p>
          </div>
        </div>
      </div>
    </section>
  );
}
