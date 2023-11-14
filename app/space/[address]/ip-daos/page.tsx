import { fetchIpDaos } from "@/actions/ipdao.action";

import IpDaoEntryCard from "@/components/cards/IpDaoEntryCard";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

import { ipDaosType } from "@/types/ipdao.type";

export default async function page({ params }: { params: { address: `0x${string}` } }) {
  const { ipDaos } = (await fetchIpDaos({ pageNumber: 1, pageSize: 20, member: params.address })) as {
    ipDaos: ipDaosType[];
  };

  return (
    <>
      {ipDaos && ipDaos.length > 0 ? (
        <section className="grid xl:grid-cols-3 md:grid-cols-2 gap-4">
          {ipDaos?.map((ipDao, index) => (
            <IpDaoEntryCard key={index} {...ipDao} />
          ))}
        </section>
      ) : (
        <SadPlaceholder size={300} text="No IP DAO found, please join or create one first" />
      )}
    </>
  );
}
