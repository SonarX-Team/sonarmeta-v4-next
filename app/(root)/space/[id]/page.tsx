import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCubesStacked, faDatabase } from "@fortawesome/free-solid-svg-icons";

import SadPlaceholder from "@/components/shared/SadPlaceholder";

export default function page({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col justify-start gap-8">
      <div>
        <h3 className="flex leading-none text-body-bold text-light-1 mb-6">
          <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faCubesStacked} />
          链上记录
        </h3>
        <div className="min-h-[200px] max-h-[800px] bg-dark-2 rounded-xl px-6 py-3 overflow-y-auto">
          <SadPlaceholder size={300} text="没有找到任何数据" />
        </div>
      </div>

      <div>
        <h3 className="flex leading-none text-body-bold text-light-1 mb-6">
          <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faDatabase} />
          活动记录
        </h3>
        <div className="min-h-[200px] max-h-[800px] bg-dark-2 rounded-xl px-6 py-3 overflow-y-auto">
          <SadPlaceholder size={300} text="没有找到任何数据" />
        </div>
      </div>
    </div>
  );
}
