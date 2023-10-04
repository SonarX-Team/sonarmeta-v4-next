import Link from "next/link";
import Image from "next/image";

export default function UserCard({
  id,
  username,
  avatar,
  bio,
}: {
  id: string;
  username: string;
  avatar: string;
  bio: string;
}) {
  return (
    <Link href={`/space/${id}`} className="flex bg-zinc-900 hover:bg-zinc-800 duration-200 rounded-xl gap-4 p-2">
      <div>
        <Image className="rounded-full" src={avatar} alt="user-avatar" width={48} height={48} />
      </div>

      <div className="flex-1">
        <h1 className="text-body-bold text-light-2 mb-1">{username}</h1>
        <p className="text-small-regular text-zinc-400 line-clamp-2">{bio}</p>
      </div>
    </Link>
  );
}
