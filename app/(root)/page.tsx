import Link from "next/link";

import { fetchIPs } from "@/actions/ip.action";

import IPEntryCard from "@/components/cards/IPEntryCard";
import SadPlaceholder from "@/components/shared/SadPlaceholder";
import ServerButton from "@/components/ui/ServerButton";
import GuideCard from "@/components/cards/GuideCard";

import { Guides } from "@/constants";

export default async function Home() {
  const { IPs } = await fetchIPs({ pageNumber: 1, pageSize: 20 });

  const guideCards: JSX.Element[] = Guides.map((guide, index) => <GuideCard key={index} {...guide} />);

  return (
    <div className="max-w-7xl mt-8 px-6">
      <div className="flex min-h-[600px] gap-12">
        <div className="flex flex-col justify-center items-start gap-12 basis-1/2">
          <h1 className="text-heading1-bold">Find Your Favorite IPs, Contribute, and Become their Shareholder.</h1>
          <p className="text-body-bold text-dark-2">
            Summoning any emerging IP and creative individuals to join us, co-create, obtain the value you deserve, and
            grow with your beloved together.
          </p>
          <div className="flex gap-4 items-center h-[50px]">
            <Link href="/ips">
              <ServerButton text="Nurture IPs" />
            </Link>
            <Link href="/unions">
              <ServerButton text="Join unions" />
            </Link>
          </div>
        </div>

        <div className="relative basis-1/2">
          <img className="absolute min-w-[500px] top-[5%] animate-spin-12" src="/planet.png" alt="planet" />
          <img className="absolute w-[175px] top-[65%] left-[70%] animate-bounce" src="/happy.png" alt="happy" />
        </div>
      </div>

      <div className="py-16">
        <h1 className="head-text mb-3">What is SonarMeta?</h1>

        <div className="flex justify-between">
          <p className="basis-1/2 text-body-semibold text-zinc-700 mb-12">
            SonarMeta employs blockchain technology to serve emerging IPs in need of resource, essentially operating as
            an angel nurturing and authorization platform for IPs by establishing a Web3 value network.
          </p>

          <div className="basis-1/2 flex justify-end h-[50px]">
            <Link href="/about">
              <ServerButton text="Learn more" />
            </Link>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="flex gap-36 justify-between items-center">
          <div className="basis-1/2">
            <img src="/network.svg" alt="network" className="w-full" />
          </div>
          <div className="basis-1/2">
            <h1 className="head-text mb-3">Decentralized IP network</h1>
            <p className="text-body-normal text-zinc-700 leading-8">
              Innovatively, we make every IP creation into an interactive decentralized account, including its
              derivatives, responsible for automatic on-chain authorization. When creators of its derivatives declare
              themselves as a new IP, authorizations begin to iterate and form a value network.
            </p>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="flex gap-36 justify-between items-center">
          <div className="basis-1/2">
            <h1 className="head-text mb-3">Value snowballing</h1>
            <p className="text-body-normal text-zinc-700 leading-8">
              When the traffic of a work, especially a derivative work, increases, it will bring influence to its IP,
              thus increasing the value of the authorizations it holds, in turn, increasing the network's value. As the
              network grows, it attracts more people to join, then forming a closed loop of value growth.
            </p>
          </div>
          <div className="basis-1/2">
            <img src="/snow.svg" alt="snow" className="w-full" />
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="flex gap-36 justify-between items-center">
          <div className="basis-1/2">
            <img src="/shareholder.svg" alt="shareholder" className="w-full" />
          </div>
          <div className="basis-1/2">
            <h1 className="head-text mb-3">Relationship changer</h1>
            <p className="text-body-normal text-zinc-700 leading-8">
              We aim to shift the creator community's dynamics from mere social connections to shareholder
              relationships. The stakeholder capitalism presented by DAO is our reason for utilizing blockchain,
              establishing an incentive-compatible co-creation ecosystem where individual and collective values align.
              This enables people to grow together with their beloved IPs and find a sense of belonging.
            </p>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="flex gap-36 justify-between items-center">
          <div className="basis-1/2">
            <h1 className="head-text mb-3">Matching pattern</h1>
            <p className="text-body-normal text-zinc-700 leading-8">
              Considering that many creators may not have the capacity to independently develop complete derivatives,
              here, you need to join unions with members who possess complementary skills to contribute to IPs. Unions
              can post their job descriptions for the roles they need.
            </p>
          </div>
          <div className="basis-1/2">
            <img src="/union.svg" alt="union" className="w-full" />
          </div>
        </div>
      </div>

      <div className="py-16">
        <h1 className="head-text mb-12">Getting started with SonarMeta</h1>

        <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4 mb-12">{guideCards}</div>

        <div className="flex gap-4 justify-center items-center h-[50px]">
          <Link href="/ips">
            <ServerButton text="Nurture IPs" />
          </Link>
          <Link href="/unions">
            <ServerButton text="Join unions" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 py-16">
        <h1 className="head-text">Escape the resource constraints of the early stage today!</h1>

        <p className="w-[660px] text-body-bold text-zinc-700 text-center">
          Here, all traffic value is regulated by decentralized mechanisms determined by the creator community. You will
          no longer be subject to interference like the precise control of traffic by Web2 platform economies.
        </p>
      </div>

      {/* <section className="flex flex-col gap-10">
        {IPs.length > 0 ? (
          IPs.map((IP, index) => <IPEntryCard key={index} {...IP} />)
        ) : (
          <SadPlaceholder size={300} text="No data source found" />
        )}
      </section> */}
    </div>
  );
}
