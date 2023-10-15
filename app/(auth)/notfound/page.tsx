import Link from "next/link";

export default function page() {
  return (
    <div className="max-w-[1400px] mx-auto px-12 py-20 relative">
      <div className="bg-moon-pink/25 blur-[125px] rounded-full lg:w-[800px] lg:h-[500px] md:w-[500px] w-[200px] h-[500px] absolute right-0 top-0 z-0" />
      <div className="bg-alpha-blue/40 blur-[125px] rounded-full lg:w-[800px] lg:h-[500px] md:w-[500px] w-[200px] h-[500px] absolute left-0 bottom-0 z-0" />

      <div className="relative z-10">
        <div className="md:flex">
          <div className="basis-1/2 flex justify-center items-center">
            <img className="w-[75%]" src="/notfound.png" alt="notfound" />
          </div>

          <div className="basis-1/2">
            <div className="flex flex-col justify-center items-start h-full gap-8">
              <h1 className="text-[42px] text-light-1">404 OMG...</h1>

              <p className="text-[18px] text-light-2">
                What you are looking for is not in the metaverse, but in the universe.Please make sure you have the
                access.
              </p>

              <Link className="bg-violet-700 hover:bg-violet-600 duration-200 text-light-2 rounded-lg p-3" href="/">
                Back to homepage &#8629;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
