import Image from "next/image";
import Link from "next/link";

import SignIn from "@/components/forms/SignIn";

export default function page() {
  return (
    <>
      <div className="md:basis-1/2 basis-0 relative overflow-hidden rounded-tl-2xl">
        <Image
          className="absolute -top-[32%] -left-[32%] animate-spin-12"
          src="/planet.png"
          alt="planet"
          width={800}
          height={800}
          style={{
            minWidth: "500px",
            height: "auto",
          }}
          priority
        />
        <Image
          className="absolute top-[78%] left-[50%] -translate-x-1/2 -translate-y-1/2"
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
          className="absolute top-[35%] left-[45%] animate-bounce"
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
          <h1 className="head-text">登 录</h1>
          <p className="mt-3 text-base-regular text-zinc-400">和蝠星一起，即刻加入IP的去中心化网络</p>
          <Link className="text-base-regular text-sky-400 hover:text-sky-300 duration-200" href="/sign-up">
            还没有账号？去注册
          </Link>
        </div>

        <SignIn />
      </div>
    </>
  );
}
