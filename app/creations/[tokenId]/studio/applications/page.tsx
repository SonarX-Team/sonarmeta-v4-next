import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove } from "@fortawesome/free-solid-svg-icons";

import { getCurrentUser } from "@/actions/user.action";
import { fetchCreation } from "@/actions/creation.action";
import SadPlaceholder from "@/components/shared/SadPlaceholder";
import NodeAcceptance from "@/components/forms/NodeAcceptance";

export default async function page({ params }: { params: { tokenId: number } }) {
  const { user } = await getCurrentUser();
  const { res, status } = await fetchCreation({ tokenId: params.tokenId });

  if (!user || status === 404 || !res) notFound();

  const applications: { _id: string; tokenId: number; title: string; avatar: string }[] = res.inclinedDerivatives;

  return (
    <div>
      <h3 className="flex leading-none text-body-bold text-dark-1 mb-6">
        <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faDove} />
        Acceptance list
      </h3>

      {applications.length > 0 ? (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
          {applications.map((application) => (
            <NodeAcceptance
              key={application._id}
              issuerTokenId={params.tokenId}
              issuerAddr={res.tbaAddr}
              title={application.title}
              inclinedTokenId={application.tokenId}
              avatar={application.avatar}
              userAddr={user.address}
            />
          ))}
        </div>
      ) : (
        <SadPlaceholder size={300} text="No data source found" />
      )}
    </div>
  );
}
