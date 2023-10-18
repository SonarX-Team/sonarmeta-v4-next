import React from "react";

export default function page() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl px-6 mt-8">
      <h1 className="text-heading1-bold text-dark-1 border-b-2 border-zinc-300 pb-2">About SonarMeta</h1>
      <p className="text-body-bold text-dark-2">
        🤩🤩🤩 Welcome to SonarMeta, the on-chain angel nurturing and authorization network for emerging IPs. Here you
        can know further about us.
      </p>

      <h2 className="head-text mt-4">Overview</h2>
      <p className="text-slate-700">
        We employ blockchain technology to serve emerging IPs in need of resource, essentially operating as an angel
        nurturing and authorization platform for IPs by establishing a Web3 value network.
      </p>
      <p className="text-slate-700">
        On one hand, we secure rights from IPs, minting authorization into NFTs. On the other hand, we cultivate a
        community with creators, match them based on their individual skill sets, and partition the community into
        unions. Each union corresponds to a smart contract, responsible for distributing rewards among its members and
        accepting the authorized NFTs rented from IPs. When an IP issues an NFT to a union contract, the authorization
        and nurturing automatically commence.
      </p>
      <p className="text-slate-700">
        Any creation of IP is essentially a decentralized account that can interact automatically. This enables it to
        autonomously authorize on behalf of its IP and trace the influence of its work. If we consider unions as a form
        of IP as well, multi-generation derivatives will emerge. Then a value network comes out, where nodes within the
        network mutually promote each other, and their values can be calculated in real-time.
      </p>
      <p className="text-slate-700">
        IP derivative works by unions can be published on existing valuable Web2 content platforms, thereby increasing
        the IP&apos;s influence. When an IP&apos;s influence grows, its authorization value, or the NFT&apos;s value,
        increases. Unions have the option to sell them or continue to hold them to receive dividends for a time after IP
        monetization.
      </p>
      <p className="text-slate-700">
        As unions stabilize their memberships and improve their operational efficiency, they may evolve into new studios
        or small enterprises. This evolution can stimulate the flexible job market, ensuring that many smaller IPs do
        not wither away due to the economic exploitation typical of traditional Web2 platforms.
      </p>

      <h2 className="head-text mt-4">Motivation</h2>
      <p className="text-slate-700">
        Nowadays, the global cultural and IP has a maket size of at least trillions of dollars. However, most of the
        investment opportunities, brand agencies, and other social resources are flocking to top level IPs. The lower
        part is facing resource scarcity and precarious existence. For them, high mortality rates are the norm.
      </p>
      <p className="text-slate-700">
        You may know almost all value is concentrated at the top level, but we should realize that the potential at the
        low level would far exceed the top. The reason is the quantity. While the former has immense value, it is too
        limited in number, whereas the latter is countless.
      </p>
      <p className="text-slate-700">
        Constrained by the precise control of traffic and the squeezing of the platform economy in Web2, many emerging
        IPs have failed to unleash their potential due to a lack of resources. We should consider to solve this problem
        and unlocking these energies by establishing a Web3 value network, much like releasing nuclear energy.
      </p>

      <h2 className="head-text mt-4">What we do?</h2>
      <p className="text-slate-700">We established a Web3 value network on the blockchain.</p>
      <h3 className="text-body-bold text-dark-2">Networking protocol</h3>
      <ul className="list-disc text-slate-700 ml-6">
        <li>
          Each IP can grant authorization to one level below at most. This means unions cannot pass the authorization of
          their parent nodes to their child nodes.
        </li>
        <li>
          Initially, unions are responsible for nurturing other IPs, but over time, they can also declare themselves as
          an IP. At that time, a union can grant authorization downwards on behalf of an IP. This is the beginning of
          the network.
        </li>
        <li>
          IP refers to a consensus on a certain profile, characteristic, or artistic representation at an abstract
          level, rather than a specific digital media file.
        </li>
        <li>
          A union is composed of individuals with various skills in flexible employment, and their abilities complement
          each other.
        </li>
      </ul>
      <img className="w-full" src="/network-protocol.png" alt="networking protocol" />
      <h3 className="text-body-bold text-dark-2 mt-2">Structure of each node</h3>
      <ul className="list-disc text-slate-700 ml-6">
        <li>
          Each creation of IP, including original works and derivative works, will be an ERC-721 token. If it is already
          an artwork on the Web3 level, it can be directly integrated. If it is a work on a Web2 platform, we will link
          the token&apos;s URL to that specific work.
        </li>
        <li>
          ERC-6551 creates an account for the ERC-721 token responsible for hosting on-chain actions of a creation, such
          as granting authorization.
        </li>
        <li>An ERC-4907 token represents a certain type of IP authorization.</li>
        <li>
          Oracles, such as Chainlink service, is used to fetch off-chain data for calculating node incentive weights.
          For instance, giving authorization to unions.
        </li>
      </ul>
      <img className="w-full" src="/node-structure.png" alt="node structure" />
      <h3 className="text-body-bold text-dark-2 mt-2">Rights and profits</h3>
      <ul className="list-disc text-slate-700 ml-6">
        <li>
          After a creation is minted into an NFT, the specific terms of use should be governed not only by on-chain
          profit-sharing agreements but also by legally binding documents signed by both parties. These details will be
          stored in decentralized storage facilities. It includes document outlining how profits are to be distributed
          to creators as well.
        </li>
        <li>
          In the nurturing mode, all the revenue of the unions belongs to themselves and is distributed only to their
          members. After the nurturing period, unions have the option to sell the NFTs to make a one-time income, or
          continue to hold the NFTs to receive dividends for a certain period after IP monetization. The value of an NFT
          reflects the current influence of the IP, as it is linked to authorization.
        </li>
        <li>
          Once the IP is mature enough, this model can be reversed. In the future, obtaining IP authorization will be a
          paid service, and the revenue generated by union creations should be shared with the IP.
        </li>
        <li>
          As the network grows, an increasing amount of traffic value will continuously flow towards parent nodes within
          the network. This implies that those who join the network earlier will have more opportunities to benefit from
          what others create, ultimately accumulating more significant node value.
        </li>
      </ul>

      <h2 className="head-text mt-4">Why use blockchain</h2>
      <p className="text-slate-700">
        The immense value nurtured by the IP cultural industry comes from a vast community of creators. We do not wish
        for all this value to be funneled into a centralized platform, susceptible to its exploitation. This may involve
        unfair traffic distribution driven by subjective preferences, rights that cannot be absolutely guaranteed, and a
        low chance of success in defending these rights. Currently, a substantial portion of the value remains
        concentrated on these centralized platforms. This means that we might not be able to completely detach from
        these platforms and create entirely decentralized content platforms, transforming all content into decentralized
        assets. However, at the very least, we can establish a decentralized value network to incentivize collaborative
        content creation and provide resources for more IP.
      </p>
      <p className="text-slate-700">
        We cannot expect any centralized platform to be objective, fair, and highly efficient. Existing platforms
        operate on a hierarchy, where creators of lower ranks might struggle to assert their rights, and even if they
        do, the speed and cost are not promising. However, blockchain is not only a method for confirming and protecting
        rights; it is also a highly concurrent, objective, public, and efficient way to automatically and swiftly
        address the rights and profits issues of a massive number of creators without omissions.
      </p>
      <p className="text-slate-700">
        Blockchain provides everyone with a fair opportunity for investment and allows for the transparent tracing of
        these investments as well as efficient calculation and distribution of returns. We believe that investments here
        are not limited to money but can encompass any resources, such as network traffic, video editing skills,
        background music, and more. With such opportunities, we can seamlessly integrate with the current creation
        economy and establish various unions to bring people together, making their creative efforts more productive,
        enabling collaborative creation, ensuring the unhindered flow of value, and providing everyone with their
        deserved returns.
      </p>
    </div>
  );
}
