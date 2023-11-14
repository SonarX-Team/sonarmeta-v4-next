import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";

import { hiddenAddress } from "@/lib/utils";

export default function UserCard({
  address,
  username,
  avatar,
  bio,
}: {
  address: `0x${string}`;
  username: string;
  avatar: string;
  bio: string;
}) {
  return (
    <Link
      href={`/space/${address}`}
      className="flex items-center bg-light-1 shadow-sm hover:shadow-md duration-200 rounded-xl gap-4 p-3"
    >
      <div>
        <img className="w-[48px] aspect-[1] rounded-full" src={avatar} alt="user-avatar" />
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-center">
          <h1 className="text-body-bold text-dark-2">{username}</h1>
          <p className="flex items-center text-small-regular text-violet-600">
            <FontAwesomeIcon className="w-[16px] h-[16px]" icon={faEthereum} />
            {hiddenAddress(address)}
          </p>
        </div>

        <p className="text-small-regular text-zinc-700 line-clamp-2">{bio}</p>
      </div>
    </Link>
  );
}
