import { fetchCreations } from "@/actions/creation.action";

import CreationEntryCard from "@/components/cards/CreationEntryCard";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

export default async function page() {
  const { creations } = await fetchCreations({ pageNumber: 1, pageSize: 20 });

  return (
    <>
      <div className="bg-light-1 py-12">
        <div className="max-w-7xl flex flex-col gap-6 mx-auto px-6">
          <h1 className="head-text text-left">Explore creations, it begins here</h1>

          <p className="text-body-normal text-zinc-700">
            Find your favorite creation through more than 50k creations here.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <section className="flex flex-col gap-10">
          {creations && creations.length > 0 ? (
            creations.map((Creation, index) => <CreationEntryCard key={index} {...Creation} />)
          ) : (
            <SadPlaceholder size={300} text="No data source found" />
          )}
        </section>
      </div>
    </>
  );
}
