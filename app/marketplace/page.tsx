import NftEntryCard from "@/components/cards/NftEntryCard";
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

          <SearchInput />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <section className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
          <NftEntryCard
            url={`/marketplace/${0}`}
            title="Design Bear"
            avatar="/nft-cards/nft-1.jpg"
            price="1.33"
            nodeValue="120"
            holderId="1"
            holder="AwonderIP"
            holderAvatar="/user.png"
          />
          <NftEntryCard
            url={`/marketplace/${1}`}
            title="Design Bear"
            avatar="/nft-cards/nft-2.png"
            price="1.33"
            nodeValue="120"
            holderId="2"
            holder="AwonderIP"
            holderAvatar="/user.png"
          />
          <NftEntryCard
            url={`/marketplace/${2}`}
            title="Design Bear"
            avatar="/nft-cards/nft-3.png"
            price="1.33"
            nodeValue="120"
            holderId="3"
            holder="AwonderIP"
            holderAvatar="/user.png"
          />
        </section>
      </div>
    </>
  );
}
