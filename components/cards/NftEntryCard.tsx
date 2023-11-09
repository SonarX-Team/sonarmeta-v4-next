import Link from "next/link";

export default function NftEntryCard({
  url,
  title,
  avatar,
  price,
  nodeValue,
  holderId,
  holder,
  holderAvatar,
}: {
  url: string;
  title: string;
  avatar: string;
  price: string;
  nodeValue: string;
  holderId: string;
  holder: string;
  holderAvatar: string;
}) {
  return (
    <div className="bg-light-1 shadow-sm hover:shadow-md duration-200 rounded-xl overflow-hidden h-full">
      <div className="w-full aspect-[1] bg-zinc-700 hover:bg-zinc-600 duration-200">
        <Link href={url} className="w-fit">
          <img className="w-full" src={avatar} alt="nft-avatar" />
        </Link>
      </div>

      <div className="p-4">
        <h3 className="text-body-bold mb-1">{title}</h3>

        <Link
          href={`/creations/${holderId}`}
          className="flex items-center text-violet-700 hover:text-violet-600 duration-200 mb-3"
        >
          <p>{holder}</p>
          <img className="w-[24px] h-[24px] ml-1 rounded-full object-cover" src={holderAvatar} alt={holder} />
        </Link>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-small-medium text-zinc-500">Price</p>
            <p>{price} ETH</p>
          </div>
          <div className="text-end">
            <p className="text-small-medium text-zinc-500">Node value</p>
            <p>{nodeValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
