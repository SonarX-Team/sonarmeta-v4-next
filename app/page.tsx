import Link from "next/link";

import ServerButton from "@/components/ui/ServerButton";
import GuideCard from "@/components/cards/GuideCard";
import AppNetwork from "@/components/ui/AppNetwork";

import { Guides } from "@/constants";

export default async function Home() {
  const guideCards: JSX.Element[] = Guides.map((guide, index) => <GuideCard key={index} {...guide} />);

  return (
    <>
      <div className="relative flex flex-col justify-between items-center bg-light-1 overflow-hidden min-h-screen sm:-mt-[60px]">
        <div className="relative flex flex-col flex-1 justify-center items-center gap-10 max-w-4xl px-6 py-12 z-10">
          <div>
            <h1 className="md:text-heading1-semibold text-heading1-small text-center">Everyone holds a share</h1>
            <h1 className="md:text-heading1-semibold text-heading1-small text-center">on this Ultimate IP Network</h1>
          </div>

          <p className="text-small-regular bg-violet-400 rounded-md text-light-2 px-3 py-1">ALPHA now | BETA soon</p>

          <p className="text-body-normal text-center leading-8">
            SonarMeta shapes a metaverse driven entirely by creators, enabling them to freely buy/sell VIEWs without
            being constrained by the centralized platforms, and a worry-free copyright environment. Build shareholder
            relationships with others, fostering P2P incentives and win-win scenarios now!
          </p>

          <div className="flex gap-4 items-center">
            <Link href="https://youtu.be/eT6uTgPD-d8" target="_blank">
              <ServerButton text="Watch video" />
            </Link>
            <Link href="/create">
              <ServerButton text="Create" />
            </Link>
          </div>
        </div>

        <div className="relative w-full min-h-[180px] overflow-hidden z-0">
          <img className="absolute min-w-[800px] -top-[100%] animate-spin-12" src="/planet.png" alt="planet" />
          <img className="absolute w-[150px] top-[20%] right-[10%] animate-bounce" src="/happy.png" alt="happy" />
        </div>
      </div>

      <div className="bg-light-1 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="head-text mb-3">Real-time Graph (Coming soon)</h1>
          <AppNetwork />
        </div>
      </div>

      <div className="px-6 py-20 max-w-7xl mx-auto">
        <h1 className="head-text mb-12">Getting started</h1>

        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4 mb-12">{guideCards}</div>

        <div className="flex gap-4 justify-center items-center">
          <Link href="/creations">
            <ServerButton text="Explore creations" />
          </Link>
          <Link href="/create">
            <ServerButton text="Create" />
          </Link>
        </div>
      </div>

      <div className="bg-light-1 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="head-text mb-3">What is SonarMeta?</h1>

          <div className="md:flex justify-between">
            <p className="basis-1/2 text-body-normal text-zinc-700 leading-8 md:mb-0 mb-3">
              An on-chain network where the value of IP can be captured and circulated, VIEWs distribution is determined
              by the entire creator ecosystem rather than being controlled by Web2 content platforms, copyright is
              protected, IPs form into interest-based relationships, and everyone becomes a shareholder of the IPs they
              contribute to, enjoying their deserved profits.
            </p>

            <div className="basis-1/2 flex md:justify-end">
              <Link href="https://sonarx666.feishu.cn/docx/XyLndXhftoXz1GxkCYAcOIdrn1U" target="_blank">
                <ServerButton text="Learn more" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-light-1 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex md:flex-row flex-col-reverse md:gap-36 justify-between items-center">
            <div className="basis-1/2">
              <img src="/network.svg" alt="network" className="w-full" />
            </div>
            <div className="basis-1/2">
              <h1 className="head-text mb-3">Decentralized IP network</h1>
              <p className="text-zinc-700 md:mb-0 mb-3">
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
          <div className="md:flex gap-36 justify-between items-center">
            <div className="basis-1/2">
              <h1 className="head-text mb-3">Value snowballing</h1>
              <p className="text-zinc-700 md:mb-0 mb-3">
                When the VIEWs of a derivative increases, it will bring influence to its original, thus, more people
                aspire to obtain VIEWs from latter, thus increasing the value of the authorization held by former. As
                VIEWs circulates, its shared nature creates additional value, resulting in a constantly increasing
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
          <div className="flex md:flex-row flex-col-reverse md:gap-36 justify-between items-center">
            <div className="basis-1/2">
              <img src="/shareholder.svg" alt="shareholder" className="w-full" />
            </div>
            <div className="basis-1/2">
              <h1 className="head-text mb-3">Relationship changer</h1>
              <p className="text-zinc-700 md:mb-0 mb-3">
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
          <div className="md:flex gap-36 justify-between items-center">
            <div className="basis-1/2">
              <h1 className="head-text mb-3">Easy to join</h1>
              <p className="text-zinc-700 md:mb-0 mb-3">
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
        <h1 className="head-text text-center">Say goodbye to Web2 social media algorithm today</h1>

        <p className="max-w-[800px] text-body-bold text-zinc-700 text-center">
          Decentralized mechanisms, driven by creators, govern all VIEWs value here
        </p>
      </div>
    </>
  );
}
