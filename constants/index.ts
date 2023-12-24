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

// Viction Testnet合约地址
export const MAIN_CONTRACT = "0x746ff97588f3e0d8df2e09333d68368f509db35a";
export const CREATION_CONTRACT = "0x74f41df41b8a200a884a249574e27b2ee69ac5a1";
export const AUTHORIZATION_CONTRACT = "0x863e23f54300acc6ab271eb40f46a699d69668be";
export const LOCKING_VAULT = "0x9087e0b89fc1b30e004bc4c371add9990da7f1ba";
export const MARKETPLACE_CONTRACT = "0x61a3f47f7d7a55565a82807ead6b3ffd951d19bf";
export const REGISTRY_CONTRACT = "0xadeb40195e7abe1d1e5bd36d07960fc6835e3801";
export const TOKENBOUND_CONTRACT = "0xf92d5475190cde3f44df2f9d2bdc932f48e71fd4";

// Tokenomics常量
export const NODE_MAX_SUPPLY = 10000000;
export const INTERNSHIP_LOCKING_AMOUNT = 10000;
