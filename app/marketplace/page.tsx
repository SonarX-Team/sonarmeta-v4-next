import { fetchListings } from "@/actions/listing.action";

import BuyListing from "@/components/forms/BuyListing";
import SadPlaceholder from "@/components/shared/SadPlaceholder";
import SearchInput from "@/components/ui/SearchInput";

export default async function page() {
  const { listings } = await fetchListings({ pageNumber: 1, pageSize: 20 });

  return (
    <>
      <div className="bg-light-1 py-12">
        <div className="max-w-7xl flex flex-col gap-6 mx-auto px-6">
          <h1 className="head-text text-left">Browse marketplace</h1>

          <p className="text-body-normal text-zinc-700">
            Obtain authorization tokens through more than 50k issuers on the marketplace.
          </p>

          <SearchInput placeholder="Search for authorizations of your favorite IPs" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {listings && listings.length > 0 ? (
          <table className="table-fixed w-full">
            <thead className="text-left">
              <tr className="text-base-bold text-zinc-500">
                <th className="border-b-[1px] border-zinc-300 py-2">Creation</th>
                <th className="border-b-[1px] border-zinc-300 py-2">Seller</th>
                <th className="border-b-[1px] border-zinc-300 py-2">Base price</th>
                <th className="border-b-[1px] border-zinc-300 py-2">Available</th>
                <th className="border-b-[1px] border-zinc-300 py-2">Trade</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing, index) => (
                <BuyListing
                  key={index}
                  tokenId={listing.creation.tokenId}
                  title={listing.creation.title}
                  description={listing.creation.description}
                  avatar={listing.creation.avatar}
                  seller={listing.seller}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <SadPlaceholder size={300} text="No data source found" />
        )}
      </div>
    </>
  );
}
