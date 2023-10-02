import { fetchUnions } from "@/actions/union.action";

import UnionEntryCard from "@/components/cards/UnionEntryCard";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

export default async function page() {
  const { unions } = await fetchUnions({ pageNumber: 1, pageSize: 20 });

  return (
    <div className="w-full max-w-4xl mt-12 px-6">
      <h1 className="head-text text-left mb-10">选择工会，开启创作</h1>

      {unions.length > 0 ? (
        <section className="grid sm:grid-cols-2 gap-4">
          {unions.map((union, index) => (
            <UnionEntryCard key={index} {...union} />
          ))}
        </section>
      ) : (
        <SadPlaceholder size={300} text="没有找到任何数据" />
      )}
    </div>
  );
}
