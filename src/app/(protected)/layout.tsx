import { SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <main>{children}</main>
    </SidebarProvider>
  );
};

export default Layout;
