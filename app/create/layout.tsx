import CategoryTab from "@/components/shared/CategoryTab";

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl flex flex-col gap-10 mx-auto px-6 py-12">
      <h1 className="head-text text-left">Create anything you want</h1>

      <CategoryTab
        tabs={["Creation", "Token-bound account", "IP DAO"]}
        routes={["/creation", "/tba", "/ip-dao"]}
        root="/create"
      />

      {children}
    </div>
  );
}
