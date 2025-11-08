import ProfileModal from "@/components/profile-modal";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ModalPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/login");
  }

  return <ProfileModal />;
};

export default ModalPage;
