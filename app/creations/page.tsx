import { fetchCreations } from "@/actions/creation.action";

import CreationEntryCard from "@/components/cards/CreationEntryCard";
import SearchInput from "@/components/ui/SearchInput";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

import { creationsType } from "@/types/creation.type";

export default async function page() {
  const { creations } = (await fetchCreations({ pageNumber: 1, pageSize: 20 })) as { creations: creationsType[] };

  return (
    <>
      <div className="bg-light-1 py-12">
        <div className="max-w-7xl flex flex-col gap-6 mx-auto px-6">
          <h1 className="head-text text-left">Explore creations, it begins here</h1>

          <p className="text-body-normal text-zinc-700">
            Find your favorite creation through more than 50k creations here.
          </p>

          <SearchInput placeholder="Search for creations" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {creations && creations.length > 0 ? (
          <section className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
            {creations.map((creation, index) => (
              <CreationEntryCard key={index} {...creation} />
            ))}
          </section>
        ) : (
          <SadPlaceholder size={300} text="No data source found" />
        )}
      </div>
    </>
  );
}
