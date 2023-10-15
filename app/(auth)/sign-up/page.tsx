import Link from "next/link";

import SignUp from "@/components/forms/SignUp";

export default function page() {
  return (
    <>
      <div className="md:basis-1/2 basis-0 relative overflow-hidden rounded-tl-2xl">
        <img className="absolute min-w-[600px] -top-[32%] -left-[48%] animate-spin-12" src="/planet.png" alt="planet" />
        <img
          className="absolute w-[300px] top-[82%] left-[50%] -translate-x-1/2 -translate-y-1/2"
          src="/logo-col-light.png"
          alt="logo"
        />
        <img className="absolute w-[175px] top-[45%] left-[45%] animate-bounce" src="/happy.png" alt="happy" />
      </div>

      <div className="md:basis-1/2 basis-full px-6 py-12">
        <div className="mb-8">
          <h1 className="head-text">Sign up</h1>
          <p className="mt-3 text-base-regular text-zinc-400">Join the decentralized IP network today!</p>
          <Link className="text-base-regular text-sky-400 hover:text-sky-300 duration-200" href="/sign-in">
            Already have an account?
          </Link>
        </div>

        <SignUp />
      </div>
    </>
  );
}
