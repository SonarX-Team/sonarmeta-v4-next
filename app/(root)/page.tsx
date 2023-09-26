import { fetchIPs } from "@/actions/ip.action";

import IPEntryCard from "@/components/cards/IPEntryCard";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

export default async function Home() {
  const { IPs } = await fetchIPs({ pageNumber: 1, pageSize: 20 });

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="head-text text-left mb-10">探索IP，始于这里</h1>

        <section className="flex flex-col gap-10">
          {IPs.length > 0 ? (
            IPs.map((IP, index) => <IPEntryCard key={index} {...IP} />)
          ) : (
            <SadPlaceholder size={300} text="没有找到任何数据" />
          )}
        </section>
      </div>
    </div>
  );
}
