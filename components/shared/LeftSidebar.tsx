"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

import { sidebarLinks } from "@/constants";
import { signOutUser } from "@/actions/user.action";

import { ConnectBtn } from "../wallet/ConnectBtn";

export default function LeftSidebar({ loginStatus }: { loginStatus: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const res = await signOutUser();
    if (res.message === "Signed out") router.replace("/sign-in");
  }

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex flex-col justify-between h-full px-6">
        <div className="flex flex-col flex-1 w-full gap-4">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.route;

            return (
              <Link
                href={link.route}
                key={link.label}
                className={`leftsidebar_link ${
                  isActive && "bg-violet-600 hover:bg-violet-600"
                } hover:bg-zinc-800 duration-100`}
              >
                <FontAwesomeIcon className="w-[20px] h-[20px] text-light-2" icon={link.icon} />
                <p className="text-light-1 max-lg:hidden">{link.label}</p>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col w-full gap-4">
          <ConnectBtn />

          {loginStatus && (
            <button className="leftsidebar_link hover:bg-zinc-800 duration-100" type="button" onClick={handleSignOut}>
              <FontAwesomeIcon className="w-[20px] h-[20px] text-light-2" icon={faArrowRightFromBracket} />
              <p className="text-light-1 max-lg:hidden">Sign out</p>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
