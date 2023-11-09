export default function TitleCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-light-1 rounded-xl shadow-sm hover:shadow-md durtaion-200">
      <h1 className="text-body-bold p-4">{title}</h1>

      <hr />

      <div className="p-4">{children}</div>
    </div>
  );
}
