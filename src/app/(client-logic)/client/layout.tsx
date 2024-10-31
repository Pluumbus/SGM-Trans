import { Sidebar } from "./_features/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="w-5/6 h-screen overflow-y-auto p-8">{children}</main>
    </div>
  );
}
