import {
  faDove,
  faPlus,
  faHandshakeAngle,
  faHammer,
  faInfoCircle,
  faWallet,
  faUsersGear,
  faSnowflake,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

// 导航栏链接常量
export const navLinks: { icon: IconProp; route: string; label: string }[] = [
  {
    icon: faDove,
    route: "/ips",
    label: "IPs",
  },
  {
    icon: faHandshakeAngle,
    route: "/unions",
    label: "Unions",
  },
  {
    icon: faPlus,
    route: "/create-ip",
    label: "Create IP",
  },
  {
    icon: faHammer,
    route: "/create-union",
    label: "Create union",
  },
  {
    icon: faInfoCircle,
    route: "/about",
    label: "About us",
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
    title: "Create your IP",
    description:
      "Upload the information about the IP you own, so that other unions can view it and submit nurturing requests to you.",
    icon: faDove,
  },
  {
    title: "Find your union",
    description:
      "If you are a creator, please find a suitable union or establish one yourself to start contributing to other IPs.",
    icon: faUsersGear,
  },
  {
    title: "Now back to work",
    description:
      "Once authorized, you can continue creating in your accustomed way, and we will automatically calculate the real-time node value",
    icon: faHammer,
  },
];

// Auth常量
export const EXPIRE_AGE = 60 * 60 * 24 * 30; // JWT失效时间30天
export const COOKIE_NAME = "sonarmetaAuthToken";

// AliOSS常量
export const aliRoot = "https://sonarmeta.oss-cn-shenzhen.aliyuncs.com/";

// ETH常量
export const MAIN_CONTRACT = "0xCf152cfc200B497F2F62087c42cD5Cd0e4567C04";
export const ADMIN_ADDRESS = "0xCfb4a9cf76d8977513137c5d302931681E45f632";
