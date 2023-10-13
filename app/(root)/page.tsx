import { fetchIPs } from "@/actions/ip.action";

import IPEntryCard from "@/components/cards/IPEntryCard";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

export default async function Home() {
  const { IPs } = await fetchIPs({ pageNumber: 1, pageSize: 20 });

  return (
    <div className="w-full max-w-4xl mt-12 px-6">
      <h1 className="head-text text-left mb-10">Explore IP, it begins here.</h1>

      <section className="flex flex-col gap-10">
        {IPs.length > 0 ? (
          IPs.map((IP, index) => <IPEntryCard key={index} {...IP} />)
        ) : (
          <SadPlaceholder size={300} text="No data source found" />
        )}
      </section>
    </div>
  );
}
