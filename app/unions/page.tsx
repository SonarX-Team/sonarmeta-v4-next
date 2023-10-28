import { fetchUnions } from "@/actions/union.action";

import UnionEntryCard from "@/components/cards/UnionEntryCard";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

export default async function page() {
  const { unions } = await fetchUnions({ pageNumber: 1, pageSize: 20 });

  return (
    <div className="w-full max-w-4xl mt-8 px-6">
      <h1 className="head-text text-left mb-10">Choose a union and start creating</h1>

      {unions.length > 0 ? (
        <section className="grid sm:grid-cols-2 gap-4">
          {unions.map((union, index) => (
            <UnionEntryCard key={index} {...union} />
          ))}
        </section>
      ) : (
        <SadPlaceholder size={300} text="No data source found" />
      )}
    </div>
  );
}