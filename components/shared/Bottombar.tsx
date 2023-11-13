import Link from "next/link";

export default function Footer() {
  return (
    <div className="bg-light-1">
      <div className="container mx-auto pt-16 pb-12">
        <div className="lg:flex">
          <div className="lg:basis-1/3 lg:mb-0 mb-12">
            <div className="flex justify-center items-end mb-3">
              <img className="lg:w-[30%] w-[120px]" src="/user.png" alt="Bat Star" />
              <img className="lg:w-[50%] w-[180px]" src="/logo-col.png" alt="Sonarmeta Logo" />
            </div>

            <p className="text-small-regular text-zinc-700 text-center">
              Here, the value of IP can be captured and circulated, traffic distribution is determined by the entire
              creator ecosystem, copyright is protected, IPs form into interest-based relationships, and everyone
              becomes a shareholder of the IPs they contribute to, enjoying their deserved profits.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-start sm:gap-20 gap-12 lg:basis-2/3">
            <div className="flex flex-col gap-3">
              <h3 className="text-base-semibold mb-1">Explore</h3>

              <Link href="/creations" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                Explore creations
              </Link>
              <Link href="/ip-daos" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                Join IP DAOs
              </Link>
              <Link href="/create" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                Create something
              </Link>
              <Link href="/marketplace" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                The marketplace
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-base-semibold mb-1">Product</h3>

              <Link
                href="https://sonarx666.feishu.cn/docx/XyLndXhftoXz1GxkCYAcOIdrn1U?from=from_copylink"
                target="_blank"
                className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100"
              >
                About SonarMeta
              </Link>
              <Link href="/" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                Documentation
              </Link>
              <Link
                href="https://sonarx666.feishu.cn/file/TYOIbvZvmoWlFtxlPN0c7akOnd6?from=from_copylink"
                target="_blank"
                className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100"
              >
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

              <Link
                href="/https://twitter.com/SonarMeta"
                target="_blank"
                className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100"
              >
                Twitter
              </Link>
              <Link
                href="/https://discord.gg/6Gvpx9jSK2"
                target="_blank"
                className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100"
              >
                Discord
              </Link>
              <Link
                href="/"
                target="_blank"
                className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100"
              >
                Telegram
              </Link>
              <Link href="/" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                YouTube
              </Link>
              <Link href="/" className="text-small-regular text-zinc-500 hover:text-violet-600 duration-100">
                TikTok
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
