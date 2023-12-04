import {
  faPlus,
  faStore,
  faInfoCircle,
  faWallet,
  faUsersGear,
  faDove,
  faCircleNodes,
  faBridgeCircleCheck,
  faCodeMerge,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

// 导航栏链接常量
export const navLinks: { icon: IconProp; route: string; label: string }[] = [
  {
    icon: faDove,
    route: "/creations",
    label: "Creations",
  },
  {
    icon: faUsersGear,
    route: "/ip-daos",
    label: "IP DAOs",
  },
  {
    icon: faStore,
    route: "/marketplace",
    label: "Marketplace",
  },
  {
    icon: faPlus,
    route: "/create/creation",
    label: "Create",
  },
  {
    icon: faInfoCircle,
    route: "https://sonarx666.feishu.cn/docx/XyLndXhftoXz1GxkCYAcOIdrn1U?from=from_copylink",
    label: "About",
  },
];

// 首页Getting started部分的卡片内容
export const Guides = [
  {
    title: "Connect wallet to sign in",
    description:
      "Install and connect a decentralized wallet by press the top-right cornor button, such as MetaMask, to link your decentralized account.",
    icon: faWallet,
  },
  {
    title: "Mint network nodes",
    description:
      "Mint an NFT pointing to your creation and bind it an token-bound account to issue, give, and receive authorization token as a node on the value network.",
    icon: faCircleNodes,
  },
  {
    title: "Establish network edges",
    description:
      "Issue authorization tokens to any node that wants to be your derivative, establish bridges for the flow of node value and grant legitimacy to them.",
    icon: faBridgeCircleCheck,
  },
  {
    title: "Buy/Sell on the marketplace",
    description:
      "Contributing VIEWs enhances the value of the node, allowing the holder to list their authorization tokens at higher prices on the Marketplace.",
    icon: faStore,
  },
  {
    title: "Make your node a co-creation/component",
    description:
      "A creation can also be a co-creation or a component since the token-bound account. Collaborators can merge/transfer their creations to others.",
    icon: faCodeMerge,
  },

  {
    title: "Create/Join IP DAOs",
    description:
      "If you don't want to create solo, you can create/join an IP DAO, which will be the owner of the co-creation and distributes profit among its members.",
    icon: faUsersGear,
  },
];

// Auth常量
export const EXPIRE_AGE = 60 * 60 * 24 * 30; // JWT失效时间30天
export const COOKIE_NAME = "sonarmetaAuthToken";

// AliOSS常量
export const aliRoot = "https://sonarmeta.oss-cn-shenzhen.aliyuncs.com/";

// Mumbai合约地址
export const MAIN_CONTRACT = "0x3dadf65562a69f20829c2b8e5da35c9e88860140";
export const CREATION_CONTRACT = "0x0edea3d5144e9edfbda4a5377870cea356a5230b";
export const AUTHORIZATION_CONTRACT = "0x0851ab55191de8b9d817e476f89bdf2625fbaad5";
export const MARKETPLACE_CONTRACT = "0xdeacf67c609dce96cc84460ce75c933bfe28fd4c";

// CCTP Testnet合约地址
export const ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS = "0xd0c3da58f55358142b8d3e06c1c30c5c6114efe8";
export const USDC_ETH_CONTRACT_ADDRESS = "0x07865c6e87b9f70255377e024ace6630c1eaa37f";
export const ETH_MESSAGE_CONTRACT_ADDRESS = "0x1a9695e9dbdb443f4b20e3e4ce87c8d963fda34f";
export const AVAX_MESSAGE_TRANSMITTER_CONTRACT_ADDRESS = "0xa9fb1b3009dcb79e2fe346c16a604b8fa8ae0a79";
