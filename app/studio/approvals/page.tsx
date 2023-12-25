import Link from "next/link";
import { createPublicClient, http } from "viem";
import { lineaTestnet } from "viem/chains";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove } from "@fortawesome/free-solid-svg-icons";

import { getCurrentUser } from "@/actions/user.action";
import { fetchCreations } from "@/actions/creation.action";
import { fetchIpDaos } from "@/actions/ipdao.action";

import Authorize from "@/components/forms/Authorize";
import AddMember from "@/components/forms/AddMember";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

import { inclinedDerivativesType } from "@/types/creation.type";
import { inclinedIpDaosType } from "@/types/ipdao.type";

import { CREATION_CONTRACT } from "@/constants";
import creationContractAbi from "@/contracts/sonarmeta/Creation.json";

export default async function page() {
  const { user } = await getCurrentUser();

  if (!user)
    return (
      <p className="mt-3 text-base-regular text-zinc-400">
        Please find &quot;Connect Wallet&quot; button on the topbar and connect it to continue use SonarMeta.
      </p>
    );

  // 授权的审核列表
  // Todo: 之后把本人持有的ipDAO持有的creation也要加进来
  const publicClient = createPublicClient({
    chain: lineaTestnet,
    transport: http(),
  });

  // @ts-ignore
  const tokenIds: bigint[] = await publicClient.readContract({
    address: CREATION_CONTRACT,
    abi: creationContractAbi,
    functionName: "getTokenIds",
    args: [user.address],
  });

  const ids: number[] = tokenIds.map((tokenId: bigint) => Number(tokenId));

  const { creations } = await fetchCreations({ pageNumber: 1, pageSize: 20, tokenIds: ids, inclined: true });
  const cs = creations ? (creations as inclinedDerivativesType[]) : [];

  const cApplications = [];
  for (let i = 0; i < cs.length; i++) {
    for (let j = 0; j < cs[i].inclinedDerivatives.length; j++) {
      cApplications.push({
        inclinedTokenId: cs[i].inclinedDerivatives[j].tokenId,
        inclinedTokenName: cs[i].inclinedDerivatives[j].title,
        inclinedTokenAvatar: cs[i].inclinedDerivatives[j].avatar,
        issuerTokenId: cs[i].tokenId,
        issuerTokenName: cs[i].title,
        issuerTokenAvatar: cs[i].avatar,
      });
    }
  }

  // IP DAO的审核列表
  const { ipDaos } = await fetchIpDaos({ pageNumber: 1, pageSize: 20, owner: user.address, inclined: true });
  const daos = ipDaos ? (ipDaos as inclinedIpDaosType[]) : [];

  const daoApplications = [];
  for (let i = 0; i < daos.length; i++) {
    for (let j = 0; j < daos[i].inclinedMembers.length; j++) {
      daoApplications.push({
        memberAddr: daos[i].inclinedMembers[j].address,
        memberName: daos[i].inclinedMembers[j].username,
        memberAvatar: daos[i].inclinedMembers[j].avatar,
        ipDaoAddr: daos[i].address,
        ipDaoTitle: daos[i].title,
        ipDaoAvatar: daos[i].avatar,
      });
    }
  }

  return (
    <div className="flex flex-col justify-start gap-8">
      <div>
        <h3 className="flex leading-none text-body-bold text-dark-1 mb-6">
          <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faDove} />
          Authorization applications
        </h3>

        <div className="flex flex-col gap-3">
          {cApplications.length > 0 ? (
            cApplications.map((application, index) => (
              <div key={index} className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <p className="flex justify-center items-center w-[24px] h-[24px] bg-violet-200 text-zinc-700 text-small-semibold leading-none rounded-full p-2">
                    {index + 1}
                  </p>

                  <Link
                    href={`/creations/${application.inclinedTokenId}`}
                    className="flex items-center text-violet-700 hover:text-violet-600 duration-200"
                  >
                    <p>
                      {application.inclinedTokenName} #{application.inclinedTokenId}
                    </p>
                    {application.inclinedTokenAvatar ? (
                      <img
                        src={application.inclinedTokenAvatar}
                        alt={application.inclinedTokenName}
                        className="w-[24px] aspect-[1] ml-1 rounded-full object-cover"
                      />
                    ) : (
                      <img
                        src="/user.png"
                        alt={application.inclinedTokenName}
                        className="w-[24px] aspect-[1] ml-1 rounded-full object-cover bg-violet-200 hover:bg-violet-100 duration-150"
                      />
                    )}
                  </Link>

                  <p className="text-small-regular text-zinc-500 leading-none">wants authorization from</p>

                  <Link
                    href={`/creations/${application.issuerTokenId}`}
                    className="flex items-center text-violet-700 hover:text-violet-600 duration-200"
                  >
                    <p>
                      {application.issuerTokenName} #{application.issuerTokenId}
                    </p>
                    <img
                      src={application.issuerTokenAvatar}
                      alt={application.issuerTokenName}
                      className="w-[24px] aspect-[1] ml-1 rounded-full object-cover"
                    />
                  </Link>
                </div>

                <Authorize
                  issuerTokenId={application.issuerTokenId}
                  inclinedTokenId={application.inclinedTokenId}
                  userAddr={user.address}
                />
              </div>
            ))
          ) : (
            <SadPlaceholder size={300} text="No data source found" />
          )}
        </div>
      </div>

      <div>
        <h3 className="flex leading-none text-body-bold text-dark-1 mb-6">
          <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faDove} />
          IP DAO applications
        </h3>

        <div className="flex flex-col gap-3">
          {daoApplications.length > 0 ? (
            daoApplications.map((application, index) => (
              <div key={index} className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <p className="flex justify-center items-center w-[24px] h-[24px] bg-violet-200 text-zinc-700 text-small-semibold leading-none rounded-full p-2">
                    {index + 1}
                  </p>

                  <Link
                    href={`/space/${application.memberAddr}`}
                    className="flex items-center text-violet-700 hover:text-violet-600 duration-200"
                  >
                    <p>{application.memberName}</p>
                    {application.memberAvatar ? (
                      <img
                        src={application.memberAvatar}
                        alt={application.memberName}
                        className="w-[24px] aspect-[1] ml-1 rounded-full object-cover"
                      />
                    ) : (
                      <img
                        src="/user.png"
                        alt={application.memberName}
                        className="w-[24px] aspect-[1] ml-1 rounded-full object-cover bg-violet-200 hover:bg-violet-100 duration-150"
                      />
                    )}
                  </Link>

                  <p className="text-small-regular text-zinc-500 leading-none">wants to join</p>

                  <Link
                    href={`/ip-daos/${application.ipDaoAddr}`}
                    className="flex items-center text-violet-700 hover:text-violet-600 duration-200"
                  >
                    <p>{application.ipDaoTitle}</p>
                    <img
                      src={application.ipDaoAvatar}
                      alt={application.ipDaoTitle}
                      className="w-[24px] aspect-[1] ml-1 rounded-full object-cover"
                    />
                  </Link>
                </div>

                <AddMember
                  ownerAddr={user.address}
                  userAddr={application.memberAddr}
                  ipDaoAddr={application.ipDaoAddr}
                />
              </div>
            ))
          ) : (
            <SadPlaceholder size={300} text="No data source found" />
          )}
        </div>
      </div>
    </div>
  );
}
