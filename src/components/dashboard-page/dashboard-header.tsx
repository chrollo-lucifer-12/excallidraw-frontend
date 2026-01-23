import { UserButton } from "@daveyplate/better-auth-ui";
import CreateWhiteboard from "./create-whiteboard";

const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-center w-full">
      <h1 className="text-3xl font-bold flex flex-row items-center justify-center gap-2">
        <UserButton size="icon" className="" />
        <p> My Whiteboards </p>
      </h1>

      <CreateWhiteboard />
    </div>
  );
};

export default DashboardHeader;
