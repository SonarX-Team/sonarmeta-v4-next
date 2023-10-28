import Link from "next/link";

export default function page() {
  return (
    <div className="max-w-[768px] px-12 py-20">
      <div className="md:flex gap-10">
        <div className="basis-1/2">
          <img className="md:w-full w-1/2" src="/notfound.png" alt="notfound" />
        </div>

        <div className="basis-1/2">
          <div className="flex flex-col justify-center items-start h-full gap-8">
            <h1 className="text-[42px] text-dark-1">404 OMG...</h1>

            <p className="text-[18px] text-dark-2">
              What you are looking for is not in the metaverse, but in the universe. Please make sure you have the
              access.
            </p>

            <Link className="bg-violet-300 hover:bg-violet-200 duration-200 text-dark-2 rounded-lg p-3" href="/">
              Back to homepage &#8629;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
