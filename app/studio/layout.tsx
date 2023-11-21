import CategoryTab from "@/components/shared/CategoryTab";

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl flex flex-col gap-10 mx-auto px-6 py-12">
      <h1 className="head-text text-left">Account studio</h1>

      <CategoryTab
        tabs={["Creations", "Listings", "IP DAOs", "Approvals"]}
        routes={["/creations", "/listings", "/ip-daos", "/approvals"]}
        root="/studio"
      />

      {children}
    </div>
  );
}
