"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  tabs: string[];
  routes: string[];
  root: string;
};

const CategoryTab: React.FC<Props> = ({ tabs, routes, root }) => {
  const pathname = usePathname();
  const currentRoute = pathname.replace(root, "");

  return (
    <div className="flex items-center gap-9 overflow-x-auto border-b-[1px] border-zinc-300">
      {tabs.map((tab, index) => (
        <Link
          href={`${root}${routes[index]}`}
          className={`sm:text-body-normal border-b-2 ${
            routes[index] === currentRoute
              ? "border-violet-700 hover:border-violet-700 text-violet-700"
              : "border-transparent text-zinc-700"
          } hover:text-violet-600 hover:border-zinc-500 duration-200 whitespace-nowrap mb-0 md:px-3 px-1 py-1`}
          key={tab}
        >
          {tab}
        </Link>
      ))}
    </div>
  );
};

export default CategoryTab;
