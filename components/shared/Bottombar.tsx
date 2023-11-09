import Link from "next/link";

export default function Footer() {
  return (
    <div className="bg-light-1">
      <div className="container mx-auto pt-16 pb-12">
        <div className="lg:flex">
          <div className="lg:basis-1/3 lg:mb-0 mb-6">
            <div className="flex justify-center items-end mb-3">
              <img className="lg:w-[30%] w-[120px]" src="/user.png" alt="Bat Star" />
              <img className="lg:w-[50%] w-[180px]" src="/logo-col.png" alt="Sonarmeta Logo" />
            </div>

            <p className="text-body-bold text-zinc-700 text-center">
              SonarMeta is an on-chain angle nurturing & authorization network for emerging IPs.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-start sm:gap-20 gap-12 lg:basis-2/3">
            <div className="flex flex-col gap-3">
              <h3 className="text-base-semibold mb-1">Explore</h3>

              <Link href="/ips" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                Nurture IPs
              </Link>
              <Link href="/ips" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                Join unions
              </Link>
              <Link href="/ips" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                Create IP
              </Link>
              <Link href="/ips" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                Create union
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-base-semibold mb-1">Product</h3>

              <Link href="/about" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                About SonarMeta
              </Link>
              <Link href="/" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                Documentation
              </Link>
              <Link href="/" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                Pitch deck
              </Link>
              <Link href="/" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                Whitepaper
              </Link>
              <Link href="/" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                Join our team
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-base-semibold mb-1">Security</h3>

              <Link href="/about" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                Privacy policy
              </Link>
              <Link href="/" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                Terms of service
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-base-semibold mb-1">Community</h3>

              <Link href="/about" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                Twitter
              </Link>
              <Link href="/" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                Discord
              </Link>
              <Link href="/" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                YouTube
              </Link>
              <Link href="/" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                TikTok
              </Link>
              <Link href="/" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                WeChat
              </Link>
              <Link href="/" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                Bilibili
              </Link>
            </div>
          </div>
        </div>

        <hr className="border-zinc-300 mt-9 mb-6" />

        <div className="sm:flex justify-between items-center text-center text-zinc-500 text-small-regular">
          <p className="sm:mb-0 mb-1">© 2023 SonarX (Hangzhou) Technology Co., Ltd. All rights reserved.</p>
          <Link className="duration-200" href="https://beian.miit.gov.cn/" target="_blank">
            吉ICP备2021008492号-2
          </Link>
        </div>
      </div>
    </div>
  );
}
