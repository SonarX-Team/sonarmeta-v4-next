import { faHome, faPlus, faUser, faHandshakeAngle, faHammer } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

// 导航栏链接常量
export const sidebarLinks: { icon: IconProp; route: string; label: string }[] = [
  {
    icon: faHome,
    route: "/",
    label: "首页",
  },
  {
    icon: faHandshakeAngle,
    route: "/unions",
    label: "IP工会",
  },
  {
    icon: faPlus,
    route: "/create-ip",
    label: "创建IP",
  },
  {
    icon: faHammer,
    route: "/create-union",
    label: "创建工会",
  },
  {
    icon: faUser,
    route: "/profile",
    label: "个人空间",
  },
];

// Auth常量
export const EXPIRE_AGE = 60 * 60 * 24 * 30; // JWT失效时间30天
export const COOKIE_NAME = "jsonWebTokenValue";

// AliOSS常量
export const aliRoot = "https://sonarmeta.oss-cn-shenzhen.aliyuncs.com/";
