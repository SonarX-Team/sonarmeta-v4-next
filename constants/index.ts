import { faHome, faPlus, faUser, faHandshakeAngle, faHammer } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

// 导航栏链接常量
export const sidebarLinks: { icon: IconProp; route: string; label: string }[] = [
  {
    icon: faHome,
    route: "/",
    label: "Home",
  },
  {
    icon: faHandshakeAngle,
    route: "/unions",
    label: "IP unions",
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
    icon: faUser,
    route: "/space",
    label: "Profile space",
  },
];

// Auth常量
export const EXPIRE_AGE = 60 * 60 * 24 * 30; // JWT失效时间30天
export const COOKIE_NAME = "jsonWebTokenValue";

// AliOSS常量
export const aliRoot = "https://sonarmeta.oss-cn-shenzhen.aliyuncs.com/";
