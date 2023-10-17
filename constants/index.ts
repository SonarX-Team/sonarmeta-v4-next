import { faDove, faPlus, faHandshakeAngle, faHammer, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
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

// Auth常量
export const EXPIRE_AGE = 60 * 60 * 24 * 30; // JWT失效时间30天
export const COOKIE_NAME = "sonarmetaAuthToken";

// AliOSS常量
export const aliRoot = "https://sonarmeta.oss-cn-shenzhen.aliyuncs.com/";

// ETH常量
export const MAIN_CONTRACT = "0x2e058108786957bf209C641B3292D2b2629aECD2";
export const ADMIN_ADDRESS = "0xCfb4a9cf76d8977513137c5d302931681E45f632";
