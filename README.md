# Overview

SonarMeta has always been interested in IP. Over the past decade, we have witnessed the glory of many Web2 content platforms. However, for their own interests, platform operators manipulate traffic precisely through algorithms, resulting in the concentration of most exposure opportunities, brand agencies, and social resources on the top popular IPs. Even if it's unfair, the estimated global market value of the IP industry is in trillions of dollars. This leads us to firmly believe that unlocking the potential of IPs that have prematurely faltered due to traffic issues will undoubtedly unleash a powerful force, much like detonating a nuclear weapon.

Let's say, if increasing traffic can enhance the value of an IP, then a straightforward way to acquire traffic is by authorizing others to create derivatives. Authorization, is not only about granting legitimacy but also serves as a tool for trading traffic. High-value IPs can sell authorizations at a premium to unleash traffic, while low-value IPs may sell them at lower or even for free to attract traffic. Therefore, we tokenize authorizations, and as they circulate, the derivatives created by holders contribute traffic to enhance the value of the IP. When an IP becomes more valuable, the token's price for authorizations will increase. This incentivizes the entire creator ecosystem to assist IPs facing early resource challenges in unlocking their potential.

If you are a new user of SonarMeta, the first step is to create a node. This involves a creation NFT and a token-bound account that exercises on-chain sovereignty for it. Deploying this TBA allows users to send transactions on behalf of it, and this is a global operation. Signing is equivalent to registering the TBA on SonarMeta, making it easier for us to track holder data and node value. Activating means the node can act as an issuer for authorizations. Each step requires gas, so users can choose to what extent they want to engage.

Suppose another user sees and really likes your creation one day, and decides to create a derivative for you. That guy can deploy and sign this node, then apply for authorization on your creation page. At this point, you can visit the studio to review and authorize the application, making the derivative a holder of your creation. Then it can receive your airdrop, and when the value of your node increases, it can sell the tokens at a better price, creating a mutually beneficial situation. Now, anyone who likes, wants to contribute, seeks exposure, or has confidence in your creation can buy your tokens and contribute to making higher prices.

TBA can also serve as a repository for co-creation. If a creation involves a team rather than a solo effort, such as a painting by a group, different layers can be minted as component NFTs and submitted to the TBA of the co-creation. The contribution of each member can be tracked by a separate contract.

In the end, when derivatives also activate authorization functionalities, and derivatives of derivatives start to emerge, a value network is formed. Nodes that join earlier will receive more profits sooner, and there are more interesting tokenomic features waiting to be explored on this network.

# Run this project

## How to install

```bash
$ git clone ...
$ yarn install

add a .env.local file

$ yarn build
$ yarn start (pm2 start yarn)
```

## How to run dev

```bash
$ yarn dev
```

## How to build

```bash
$ yarn build
```

## How to run prod

```bash
$ yarn start
```

Open [http://localhost:3000](http://localhost:3000) in your local browser.

## Tech stack

- A full stack web project with Next.js and its server action.
- A centralized cloud storage with Ali cloud OSS.
- DBMS with MongoDB Atlas.
- Cloud server with tencent cloud light house.
- IP address：[101.43.33.37](http://101.43.33.37)
- Demo domain：sonarmeta.com
- Demo address：[https://www.sonarmeta.com](https://www.sonarmeta.com)

## Next.js docs

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
