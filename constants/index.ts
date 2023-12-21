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
    title: "Make your node a co-creation",
    description:
      "A node can also be a co-creation since the token-bound account by transferring collaborators' components here.",
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
export const MAIN_CONTRACT = "0xe0dc9879bb5d9a708e7240650c3ef22d209fe7b2";
export const CREATION_CONTRACT = "0x745777f41a50b1709c7956a184837fbb5b482f1f";
export const AUTHORIZATION_CONTRACT = "0x628e40a33db30e64c68ea4eb6fbfcf6871c7e02e";
export const LOCKING_VAULT = "0xd9398ba4b8846296b3e96493af29de2ba65fbbc8";
export const MARKETPLACE_CONTRACT = "0x79759ca28073af04e4fd47e9407759acca31e5bf";

// Tokenomics常量
export const NODE_MAX_SUPPLY = 10000000;
export const INTERNSHIP_LOCKING_AMOUNT = 10000;
