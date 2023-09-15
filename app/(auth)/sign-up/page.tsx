import Image from "next/image";
import Link from "next/link";

import SignUp from "@/components/forms/SignUp";

export default function page() {
  return (
    <>
      <div className="md:basis-1/2 basis-0 relative overflow-hidden rounded-tl-2xl">
        <Image
          className="absolute -top-[32%] -left-[48%] animate-spin-12"
          src="/planet.png"
          alt="planet"
          width={800}
          height={800}
          style={{
            minWidth: "600px",
            height: "auto",
          }}
          priority
        />
        <Image
          className="absolute top-[82%] left-[50%] -translate-x-1/2 -translate-y-1/2"
          src="/logo-col-light.png"
          alt="logo"
          width={300}
          height={300}
          style={{
            width: "300px",
            height: "auto",
          }}
          priority
        />
        <Image
          className="absolute top-[45%] left-[45%] animate-bounce"
          src="/happy.png"
          alt="happy"
          width={175}
          height={175}
          style={{
            width: "175px",
            height: "auto",
          }}
          priority
        />
      </div>

      <div className="md:basis-1/2 basis-full px-6 py-12">
        <div className="mb-8">
          <h1 className="head-text">注 册</h1>
          <p className="mt-3 text-base-regular text-zinc-400">和蝠星一起，即刻加入IP的去中心化网络</p>
          <Link className="text-base-regular text-sky-400 hover:text-sky-300 duration-200" href="/sign-in">
            已有账号了？去登录
          </Link>
        </div>

        <SignUp />
      </div>
    </>
  );
}
