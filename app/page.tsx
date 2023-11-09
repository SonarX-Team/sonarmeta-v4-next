import Link from "next/link";

import ServerButton from "@/components/ui/ServerButton";
import GuideCard from "@/components/cards/GuideCard";

import { Guides } from "@/constants";

export default async function Home() {
  const guideCards: JSX.Element[] = Guides.map((guide, index) => <GuideCard key={index} {...guide} />);

  return (
    <>
      <div className="bg-light-1 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex min-h-[600px] gap-12">
            <div className="flex flex-col justify-center items-start gap-12 basis-1/2">
              <h1 className="text-heading1-bold">
                Make yourself an IP and become a shareholder in the creative network
              </h1>
              <p className="text-body-bold text-dark-2 leading-8">
                Here, you enter a genuine metaverse entirely shaped by the creative community, where you can enhance
                visibility of your own IPs or contribute to others without worrying about any creation-related issues.
              </p>
              <div className="flex gap-4 items-center h-[50px]">
                <Link href="/ip-daos">
                  <ServerButton text="Explore" />
                </Link>
                <Link href="/create">
                  <ServerButton text="Create" />
                </Link>
              </div>
            </div>

            <div className="relative basis-1/2">
              <img className="absolute min-w-[500px] top-[5%] animate-spin-12" src="/planet.png" alt="planet" />
              <img className="absolute w-[175px] top-[65%] left-[70%] animate-bounce" src="/happy.png" alt="happy" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="head-text mb-12">Getting started</h1>

          <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4 mb-12">{guideCards}</div>

          <div className="flex gap-4 justify-center items-center h-[50px]">
            <Link href="/ip-daos">
              <ServerButton text="Explore" />
            </Link>
            <Link href="/create">
              <ServerButton text="Create" />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-light-1 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="head-text mb-3">What is SonarMeta?</h1>

          <div className="flex justify-between">
            <p className="basis-1/2 text-body-normal text-zinc-700 leading-8">
              An on-chain network where the value of IP can be captured and circulated, traffic distribution is
              determined by the entire creator ecosystem rather than being controlled by Web2 content platforms,
              copyright is protected, IPs form interest-based relationships, and everyone becomes a shareholder of the
              IPs they contribute to, enjoying their deserved profits.
            </p>

            <div className="basis-1/2 flex justify-end h-[50px]">
              <Link href="https://sonarx666.feishu.cn/docx/XyLndXhftoXz1GxkCYAcOIdrn1U" target="_blank">
                <ServerButton text="Learn more" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-light-1 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-36 justify-between items-center">
            <div className="basis-1/2">
              <img src="/network.svg" alt="network" className="w-full" />
            </div>
            <div className="basis-1/2">
              <h1 className="head-text mb-3">Decentralized IP network</h1>
              <p className="text-body-normal text-zinc-700 leading-8">
                Innovatively, we have made each IP creation interactively function as a decentralized account. They not
                only serve as IP repositories to hold all the component NFTs that constitute the creation, but also as
                the issuers of authorization NFTs. When authorization NFTs circulate among different creations, a
                decentralized value network is formed with them as nodes. All adjacent nodes have derivative and
                beneficiary relationships and additionally copyright is protected.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-light-1 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-36 justify-between items-center">
            <div className="basis-1/2">
              <h1 className="head-text mb-3">Value snowballing</h1>
              <p className="text-body-normal text-zinc-700 leading-8">
                When the traffic of a derivative increases, it will bring influence to its original, thus, more people
                aspire to obtain traffic from latter, thus increasing the value of the authorization held by former. As
                traffic circulates, its shared nature creates additional value, resulting in a constantly increasing
                network value. As the network grows, it attracts more people to join, then forming a closed loop of
                value growth.
              </p>
            </div>
            <div className="basis-1/2">
              <img src="/snow.svg" alt="snow" className="w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-light-1 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-36 justify-between items-center">
            <div className="basis-1/2">
              <img src="/shareholder.svg" alt="shareholder" className="w-full" />
            </div>
            <div className="basis-1/2">
              <h1 className="head-text mb-3">Relationship changer</h1>
              <p className="text-body-normal text-zinc-700 leading-8">
                We aim to shift the creator relationship from mere social connections to shareholders. The stakeholder
                capitalism presented by DAO is our reason for utilizing blockchain, establishing an incentive-compatible
                co-creation ecosystem where individual and collective values align. This enables people to grow together
                with their beloved IPs and find a sense of belonging.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-light-1 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-36 justify-between items-center">
            <div className="basis-1/2">
              <h1 className="head-text mb-3">Easy to join</h1>
              <p className="text-body-normal text-zinc-700 leading-8">
                Considering that many creators may not have the capacity to independently develop complete derivatives,
                here, all creations not only have the ability to derive from each other but are also co-creations from
                within. Since each creation serves as a decentralized account, you can form your own team or join
                others. Just focus on your strengths and contribute your creative pieces to that repo as components of a
                finished co-creation to seamlessly become part of this network.
              </p>
            </div>
            <div className="basis-1/2">
              <img src="/union.svg" alt="union" className="w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 px-6 py-20">
        <h1 className="head-text">Escape the Web2 platform constraints today!</h1>

        <p className="w-[660px] text-body-bold text-zinc-700 text-center">
          Here, all traffic value is regulated by decentralized mechanisms determined by the creator community. You will
          no longer be subject to interference like the precise control of traffic by Web2 platform economies.
        </p>
      </div>
    </>
  );
}
