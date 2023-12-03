import Link from "next/link";

export default function CustomToast({ title, url }: { title: string; url: string }) {
  return (
    <div className="w-[300px] bg-light-1 shadow-lg rounded-xl text-body-normal flex items-center gap-3 py-4 px-6">
      <div>😃</div>
      <div>
        {title}{" "}
        <Link className="text-violet-700 hover:text-violet-600 duration-200" href={url} target="_blank">
          Polygonscan
        </Link>
      </div>
    </div>
  );
}
