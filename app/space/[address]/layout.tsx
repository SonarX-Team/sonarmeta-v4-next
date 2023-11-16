import Link from "next/link";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faDove, faEnvelope, faHandshakeAngle, faWallet } from "@fortawesome/free-solid-svg-icons";

import { fetchUser, getCurrentUser } from "@/actions/user.action";
import CategoryTab from "@/components/shared/CategoryTab";
import { hiddenAddress } from "@/lib/utils";

export default async function layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { address: `0x${string}` };
}) {
  const { user } = await getCurrentUser();

  let tabNames: string[] = [];
  let tabRoutes: string[] = [];

  if (user && user.address === params.address) {
    tabNames = ["Overview", "Creations", "IP DAOs", "Approvals"];
    tabRoutes = ["", "/creations", "/ip-daos", "/approvals"];
  } else {
    tabNames = ["Overview", "Creations", "IP DAOs"];
    tabRoutes = ["", "/creations", "/ip-daos"];
  }

  const res = await fetchUser({ address: params.address, isBasic: false });

  if (res.status === 404) notFound();

  return (
    <div className="sm:flex max-w-7xl mx-auto p-8">
      <div className="flex flex-col justify-start gap-8 basis-1/4">
        <div className="flex flex-col justify-start gap-3">
          {res.avatar ? (
            <img
              className="w-[270px] aspect-[1] bg-violet-300 hover:bg-violet-200 duration-200 border-2 border-zinc-400 rounded-full"
              src={res.avatar}
              alt="user-avatar"
            />
          ) : (
            <img
              className="w-[270px] aspect-[1] bg-violet-300 hover:bg-violet-200 duration-200 border-2 border-zinc-400 rounded-full"
              src="/user.png"
              alt="user-avatar"
            />
          )}

          <h1 className="text-heading2-semibold text-dark-1">{res.username}</h1>
          <p className="text-base-regular text-zinc-700 whitespace-pre-line">{res.bio}</p>
        </div>

        <div className="flex flex-col justify-start gap-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon className="w-[14px] h-[14px] text-slate-500" icon={faEnvelope} />
            <p className="text-small-regular text-zinc-700 leading-none">
              {res.email ? res.email : "No email provided"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon className="w-[14px] h-[14px] text-slate-500" icon={faWallet} />
            <p className="text-small-regular text-zinc-700 leading-none">
              {res.address ? hiddenAddress(res.address) : "No wallet connected"}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-start gap-3">
          {user?.address === params.address && (
            <Link
              className="bg-violet-200 hover:bg-violet-200/70 duration-200 text-small-regular text-center rounded-md px-3 py-2"
              href="/account"
            >
              Edit account
            </Link>
          )}
          <button
            className="bg-orange-500 hover:bg-orange-400 duration-200 disabled:bg-zinc-400 disabled:text-zinc-200 text-small-regular text-center rounded-md px-3 py-2"
            disabled={!user || user.address === params.address}
          >
            + Follow
          </button>
        </div>

        <div className="flex flex-col justify-start gap-4">
          <div className="flex items-center gap-2 text-zinc-700">
            <FontAwesomeIcon className="w-[14px] h-[14px]" icon={faDove} />
            <p className="text-small-semibold text-dark-1 leading-none">{7}</p>
            <p className="text-small-regular">Creations created</p>
          </div>
          <div className="flex items-center gap-2 text-zinc-700">
            <FontAwesomeIcon className="w-[14px] h-[14px]" icon={faHandshakeAngle} />
            <p className="text-small-semibold text-dark-1 leading-none">{0}</p>
            <p className="text-small-regular">IP DAOs joined</p>
          </div>
          <div className="flex items-center gap-2 text-zinc-700">
            <FontAwesomeIcon className="w-[14px] h-[14px]" icon={faBell} />
            <p className="text-small-semibold text-dark-1 leading-none">{res.followers.length}</p>
            <p className="text-small-regular">Followers</p>
            <p className="text-small-regular">·</p>
            <p className="text-small-semibold text-dark-1 leading-none">{res.follows.length}</p>
            <p className="text-small-regular">Follows</p>
          </div>
        </div>
      </div>

      <div className="basis-3/4 flex flex-col gap-8 sm:pl-10 sm:mt-0 mt-6">
        <CategoryTab tabs={tabNames} routes={tabRoutes} root={`/space/${params.address}`} />

        {children}
      </div>
    </div>
  );
}
