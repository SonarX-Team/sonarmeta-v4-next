import {
  faPlus,
  faStore,
  faHammer,
  faInfoCircle,
  faWallet,
  faUsersGear,
  faDove,
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
    title: "Connect your wallet",
    description:
      "Install and connect a decentralized wallet by press the top-right cornor button, such as MetaMask, to link your decentralized account.",
    icon: faWallet,
  },
  {
    title: "Create/Join IP DAOs",
    description:
      "An IP DAO is the owner of co-creations, which authorizes derivatives, and distributes profit among its members.",
    icon: faUsersGear,
  },
  {
    title: "Bind and submit",
    description:
      "Mint a co-creation NFT and bind an account to it so that members within the IP DAO can submit their component NFTs to it.",
    icon: faHammer,
  },
  {
    title: "Authorize on the marketplace",
    description:
      "Mint authorization NFTs to a co-creation token-bound account and use that account to list them on the marketplace to connect others.",
    icon: faStore,
  },
];

// Auth常量
export const EXPIRE_AGE = 60 * 60 * 24 * 30; // JWT失效时间30天
export const COOKIE_NAME = "sonarmetaAuthToken";

// AliOSS常量
export const aliRoot = "https://sonarmeta.oss-cn-shenzhen.aliyuncs.com/";

// ETH常量

// Goerli
export const MAIN_CONTRACT = "0x746ff97588f3e0d8df2e09333d68368f509db35a";
export const MARKETPLACE_CONTRACT = "0x61a3f47f7d7a55565a82807ead6b3ffd951d19bf";
export const CREATION_CONTRACT = "0x863e23f54300acc6ab271eb40f46a699d69668be";

// CCTP Testnet Contract Addresses
export const ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS = "0xd0c3da58f55358142b8d3e06c1c30c5c6114efe8";
export const USDC_ETH_CONTRACT_ADDRESS = "0x07865c6e87b9f70255377e024ace6630c1eaa37f";
export const ETH_MESSAGE_CONTRACT_ADDRESS = "0x1a9695e9dbdb443f4b20e3e4ce87c8d963fda34f";
export const AVAX_MESSAGE_TRANSMITTER_CONTRACT_ADDRESS = "0xa9fb1b3009dcb79e2fe346c16a604b8fa8ae0a79";
