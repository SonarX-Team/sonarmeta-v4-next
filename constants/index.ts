import {
  faHome,
  faMagnifyingGlass,
  faFlag,
  faPlus,
  faStar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export const sidebarLinks: { icon: IconProp; route: string; label: string }[] = [
  {
    icon: faHome,
    route: "/",
    label: "首页",
  },
  {
    icon: faMagnifyingGlass,
    route: "/search",
    label: "搜索",
  },
  {
    icon: faFlag,
    route: "/activity",
    label: "活动",
  },
  {
    icon: faPlus,
    route: "/create-ip",
    label: "创建IP",
  },
  {
    icon: faStar,
    route: "/ip-dao",
    label: "IP DAO",
  },
  {
    icon: faUser,
    route: "/profile",
    label: "个人空间",
  },
];

export const EXPIRE_AGE = 60 * 60 * 24 * 30; // JWT失效时间30天
export const COOKIE_NAME = "jsonWebTokenValue"

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
