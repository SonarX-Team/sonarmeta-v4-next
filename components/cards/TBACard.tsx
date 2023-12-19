import TitleCard from "../cards/TitleCard";
import { hiddenAddress } from "@/lib/utils";

export default function TBACard({ tbaAddr }: { tbaAddr: `0x${string}` | "" }) {
  return (
    <TitleCard title="Token-bound account">
      <div className="flex items-center gap-3">
        {tbaAddr ? (
          <>
            <div>{hiddenAddress(tbaAddr)}</div>
            <div className="bg-green-700 text-subtle-medium text-light-2 rounded-md px-2 py-1">Deployed</div>
          </>
        ) : (
          <div className="bg-red-700 text-subtle-medium text-light-2 rounded-md px-2 py-1">Not deployed</div>
        )}
      </div>
    </TitleCard>
  );
}
