import { getCurrentUser } from "@/actions/user.action";
import CategoryTab from "@/components/shared/CategoryTab";

export default async function layout({ children, params }: { children: React.ReactNode; params: { tab: string } }) {
  const { user } = await getCurrentUser();

  if (!user)
    return (
      <>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="head-text text-left mb-10">Create anything you want</h1>

          <p className="text-zinc-500">But you need to sign in first!</p>
        </div>
      </>
    );

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="head-text text-left mb-10">Create anything you want</h1>

        <CategoryTab
          tabs={["Creation", "Token-bound account", "IPDAO"]}
          routes={["/creation", "/tba", "/ipdao"]}
          root={`/create/${params.tab}`}
        />

        {children}
      </div>
    </>
  );
}
