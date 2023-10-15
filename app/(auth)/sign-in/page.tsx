import Link from "next/link";

import SignIn from "@/components/forms/SignIn";

export default function page() {
  return (
    <>
      <div className="md:basis-1/2 basis-0 relative overflow-hidden rounded-tl-2xl">
        <img className="absolute min-w-[500px] -top-[32%] -left-[32%] animate-spin-12" src="/planet.png" alt="planet" />
        <img
          className="absolute w-[300px] top-[78%] left-[50%] -translate-x-1/2 -translate-y-1/2"
          src="/logo-col-light.png"
          alt="logo"
        />
        <img className="absolute w-[175px] top-[35%] left-[45%] animate-bounce" src="/happy.png" alt="happy" />
      </div>

      <div className="md:basis-1/2 basis-full px-6 py-12">
        <div className="mb-8">
          <h1 className="head-text">Sign in</h1>
          <p className="mt-3 text-base-regular text-zinc-400">Join the decentralized IP network today!</p>
          <Link className="text-base-regular text-sky-400 hover:text-sky-300 duration-200" href="/sign-up">
            Have no account?
          </Link>
        </div>

        <SignIn />
      </div>
    </>
  );
}
