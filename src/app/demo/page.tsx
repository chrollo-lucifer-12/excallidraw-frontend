import { SidebarProvider } from "@/components/ui/sidebar";
import WhiteboardPage from "@/components/whiteboard-page";

const DemoPage = () => {
  return (
    <SidebarProvider>
      <WhiteboardPage slug={null} userId={null} />;
    </SidebarProvider>
  );
};

export default DemoPage;
