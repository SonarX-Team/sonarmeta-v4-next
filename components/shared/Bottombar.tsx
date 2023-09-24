"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { sidebarLinks } from "@/constants";

export default function Bottombar() {
  const pathname = usePathname();

  return (
    <footer className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => {
          const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

          return (
            <Link href={link.route} key={link.label} className={`bottombar_link ${isActive && "bg-primary-500"}`}>
              <FontAwesomeIcon className="w-[20px] h-[20px] text-light-2" icon={link.icon} />
              <p className="text-subtle-medium text-light-1 max-sm:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
