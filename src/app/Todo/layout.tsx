import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" bg-muted ">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 px-0 py-0 bg-white dark:bg-muted">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
