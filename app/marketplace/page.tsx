import NftEntryCard from "@/components/cards/NftEntryCard";
import BuyListing from "@/components/forms/BuyListing";
import SearchInput from "@/components/ui/SearchInput";

export default function page() {
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
        <div className="table table-fixed w-full">
          <div className="table-header-group">
            <div className="table-row text-base-bold text-zinc-500">
              <div className="table-cell border-b-[1px] border-zinc-300 py-2">Creation</div>
              <div className="table-cell border-b-[1px] border-zinc-300 py-2">Seller</div>
              <div className="table-cell border-b-[1px] border-zinc-300 py-2">Base price</div>
              <div className="table-cell border-b-[1px] border-zinc-300 py-2">Available</div>
              <div className="table-cell border-b-[1px] border-zinc-300 py-2">Trade</div>
            </div>
          </div>
          <div className="table-row-group">
            <div className="table-row">
              <div className="table-cell border-b-[1px] border-zinc-300">SonarMeta first creation</div>
              <div className="table-cell border-b-[1px] border-zinc-300">0x58f1...FE22</div>
              <div className="table-cell border-b-[1px] border-zinc-300">0.013 ETH</div>
              <div className="table-cell border-b-[1px] border-zinc-300">256</div>
              <div className="table-cell border-b-[1px] border-zinc-300 py-6">
                <BuyListing tokenId={0} seller="0x58f1...FE22" basePrice={0.013} max={256} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
