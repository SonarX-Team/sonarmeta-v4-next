import React from "react";

export default function page() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl px-6 mt-8">
      <h1 className="text-heading1-bold text-dark-1 border-b-2 border-zinc-300 pb-2">About SonarMeta</h1>
      <p className="text-body-bold text-dark-2">
        🤩🤩🤩 Welcome to SonarMeta, the on-chain angel nurturing and authorization network for emerging IPs. Here you
        can know further about us.
      </p>

      <h2 className="head-text mt-4">Motivation</h2>
      <p className="text-slate-700">
        Nowadays, the global cultural and IP has a maket size of at least trillions of dollars. However, most of the
        investment opportunities, brand agencies, and other social resources are flocking to top level IPs. The lower
        part is facing resource scarcity and precarious existence. For them, high mortality rates are the norm.
      </p>
      <p className="text-slate-700">
        As you know, almost all value is concentrated at the top level, but we should realize that the potential at the
        low level would far exceed the top. The reason is the quantity. While the former has immense value, it is too
        limited in number, whereas the latter is countless.
      </p>
      <p className="text-slate-700">
        Constrained by the precise control of traffic and the squeezing of the platform economy in Web2, many emerging
        IPs have failed to unleash their potential due to a lack of resources. We should consider to solve this problem
        and unlocking these energies by establishing a Web3 value network, much like releasing nuclear energy.
      </p>

      <h2 className="head-text mt-4">What we do?</h2>
      <p className="text-slate-700">We established a Web3 value network.</p>
      <h3 className="text-body-bold text-dark-2">Networking protocol</h3>
      <ul className="list-disc text-slate-700">
        <li>
          Each IP can delegate authorization to one level below at most. This means unions cannot delegate the
          authorization of their parent nodes to their child nodes.
        </li>
        <li>
          Initially, unions are responsible for nurturing other IPs, but over time, they can also declare themselves as
          an IP.
        </li>
        <li>
          IP refers to a consensus on a certain profile, image, or artistic representation at an abstract level, rather
          than a specific digital media file.
        </li>
        <li>
          A union is composed of individuals with various skills in flexible employment, and their abilities complement
          each other.
        </li>
      </ul>
      <img className="w-full" src="/network-protocol.png" alt="networking protocol" />
      <h3 className="text-body-bold text-dark-2 mt-2">Structure of each node</h3>
      <ul className="list-disc text-slate-700">
        <li>
          Each creation of IP will be an ERC-721 token. If it is already an artwork on the Web3 level, it can be
          directly integrated. If it is a work on a Web2 platform, we will link the token&apos;s URL to that specific
          work.
        </li>
        <li>ERC-6551 create an account responsible for hosting on-chain actions of an IP creation.</li>
        <li>A ERC-4907 token represents a certain type of IP authorization.</li>
        <li>
          Oracles, such as Chainlink service, is used to fetch off-chain data for calculating node incentive weights.
          For instance, giving authorization to unions.
        </li>
      </ul>
      <img className="w-full" src="/node-structure.png" alt="node structure" />

      <h2 className="head-text mt-4">Conclusion</h2>
      <p className="text-slate-700">
        We employ blockchain technology to serve emerging IPs (Intellectual Properties) in need of nurturing,
        essentially operating as an angel nurturing and authorization platform for IPs.
      </p>
      <p className="text-slate-700">
        On one hand, we secure authorization from IPs, fragmenting specific rights, such as adaptation and operational
        rights, into NFTs (Non-Fungible Tokens). On the other hand, we cultivate a vast community with creators as the
        primary and effective network nodes.Through an algorithm that matches people based on their individual skill
        sets, we partition the extensive community into unions, each comprising individuals whose skills complement each
        other.
      </p>
      <p className="text-slate-700">
        On the blockchain, each union corresponds to a smart contract, responsible for distributing rewards among its
        internal members and accepting the authorized NFTs rented from IPs. When an IP issues an NFT to a union
        contract, authorization and nurturing automatically commence.
      </p>
      <p className="text-slate-700">
        IP derivative works by unions can be published on existing Web2 content platforms, thereby increasing the
        IP&apos;s influence. All earnings generated on Web2 content platforms are distributed among union members by the
        union contract. As an IP&apos;s influence grows, its authorization value, or the NFT&apos;s value, increases.
        Unions have the option to sell the NFTs and cease nurturing or continue to hold the NFTs to receive dividends
        for a certain period after IP monetization.
      </p>
      <p className="text-slate-700">
        As unions stabilize their memberships and improve their operational efficiency, they evolve into new studios or
        small enterprises. This evolution can stimulate the flexible job market, ensuring that many smaller IPs do not
        wither away due to the economic exploitation typical of traditional Web2 platforms.
      </p>
    </div>
  );
}
