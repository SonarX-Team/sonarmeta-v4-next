import Image from "next/image";

export default function UserCard({ username, avatar, bio }: { username: string; avatar: string; bio: string }) {
  return (
    <div className="flex bg-dark-2 rounded-xl gap-4 p-2">
      <div>
        <Image className="rounded-full" src={avatar} alt="user-avatar" width={48} height={48} />
      </div>

      <div className="flex-1">
        <h1 className="text-body-bold text-light-2 mb-1">{username}</h1>
        <p className="text-small-regular text-zinc-400 line-clamp-2">{bio}</p>
      </div>
    </div>
  );
}
