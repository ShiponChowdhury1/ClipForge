import Sidebar from "@/components/layout/sidebar";
import { DashboardProvider } from "@/components/layout/DashboardWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <DashboardContent>{children}</DashboardContent>
    </DashboardProvider>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-[8%] xl:px-[10%] 2xl:px-[12%]">
      <style dangerouslySetInnerHTML={{ __html: `.main-scroll::-webkit-scrollbar { display: none; }` }} />
      {/* Main Container for Sidebar and Content */}
      <div className="flex gap-5 h-full">
        <Sidebar />
        <main className="flex-1 w-full max-w-full overflow-x-hidden main-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
