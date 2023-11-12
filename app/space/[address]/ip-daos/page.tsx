import { fetchIpDaos } from "@/actions/ipdao.action";
import { getCurrentUser } from "@/actions/user.action";

import IpDaoEntryCard from "@/components/cards/IpDaoEntryCard";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

export default async function page() {
  const { user } = await getCurrentUser();

  const { ipDaos } = await fetchIpDaos({ pageNumber: 1, pageSize: 20, owner: user?.address });

  return (
    <section className="grid xl:grid-cols-3 md:grid-cols-2 gap-4">
      {ipDaos && ipDaos.length > 0 ? (
        ipDaos.map((ipDao, index) => <IpDaoEntryCard key={index} {...ipDao} />)
      ) : (
        <SadPlaceholder size={300} text="No IP DAO found, please join or create one first" />
      )}
    </section>
  );
}
