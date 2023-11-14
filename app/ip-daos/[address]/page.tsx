import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFeatherPointed, faImages } from "@fortawesome/free-solid-svg-icons";

import { fetchIpDao } from "@/actions/ipdao.action";

export default async function page({ params }: { params: { address: `0x${string}` } }) {
  const { res } = await fetchIpDao({ address: params.address });

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-6 py-12">
      <div>
        <h3 className="flex leading-none text-zinc-600 mb-4">
          <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faFeatherPointed} />
          Recruitment
        </h3>

        <p className="sm:w-1/2">{res?.description}</p>
      </div>

      <div>
        <h3 className="flex leading-none text-zinc-600 mb-4">
          <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faImages} />
          Pictures
        </h3>

        <div className="flex flex-wrap overflow-y-auto h-[200px] gap-4">
          {res?.images.map((image, index) => (
            <div
              key={index}
              className="flex justify-center items-center bg-zinc-200 rounded-lg min-w-[150px] h-[200px]"
            >
              <img className="rounded-lg" src={image} alt="ip-image" width={150} height={200} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
