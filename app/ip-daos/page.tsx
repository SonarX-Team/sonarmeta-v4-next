import { fetchIpDaos } from "@/actions/ipdao.action";

import IpDaoEntryCard from "@/components/cards/IpDaoEntryCard";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

export default async function page() {
  const { ipDaos } = await fetchIpDaos({ pageNumber: 1, pageSize: 20 });

  return (
    <>
      <div className="bg-light-1 py-12">
        <div className="max-w-7xl flex flex-col gap-6 mx-auto px-6">
          <h1 className="head-text text-left">Join IP DAOs, it begins here</h1>

          <p className="text-body-normal text-zinc-700">Join the IP DAO that most interests and captivates you here.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <section className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
          {ipDaos && ipDaos.length > 0 ? (
            ipDaos.map((ipDao, index) => <IpDaoEntryCard key={index} {...ipDao} />)
          ) : (
            <SadPlaceholder size={300} text="No data source found" />
          )}
        </section>
      </div>
    </>
  );
}
