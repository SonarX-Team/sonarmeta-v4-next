import { faHome, faMagnifyingGlass, faPlus, faStar, faUser, faHandshakeAngle } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export const sidebarLinks: { icon: IconProp; route: string; label: string }[] = [
  {
    icon: faHome,
    route: "/",
    label: "首页",
  },
  {
    icon: faHandshakeAngle,
    route: "/ip-union",
    label: "IP工会",
  },
  {
    icon: faMagnifyingGlass,
    route: "/match",
    label: "匹配工友",
  },
  {
    icon: faPlus,
    route: "/create-ip",
    label: "创建IP",
  },
  {
    icon: faUser,
    route: "/profile",
    label: "个人空间",
  },
];

export const EXPIRE_AGE = 60 * 60 * 24 * 30; // JWT失效时间30天
export const COOKIE_NAME = "jsonWebTokenValue";

export const aliRoot = "https://sonarmeta.oss-cn-shenzhen.aliyuncs.com/";

export const profileTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "replies", label: "Replies", icon: "/assets/members.svg" },
  { value: "tagged", label: "Tagged", icon: "/assets/tag.svg" },
];

export const communityTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "members", label: "Members", icon: "/assets/members.svg" },
  { value: "requests", label: "Requests", icon: "/assets/request.svg" },
];
