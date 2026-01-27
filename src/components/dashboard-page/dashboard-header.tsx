import { UserButton } from "@daveyplate/better-auth-ui";
import CreateWhiteboard from "./create-whiteboard";
import { SparklesText } from "../ui/sparkles-text";

const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-center w-full">
      <h1 className="text-3xl font-bold flex flex-row items-center justify-center gap-2">
        <SparklesText className="w-8">Whiteboards</SparklesText>
      </h1>

      <CreateWhiteboard />
    </div>
  );
};

export default DashboardHeader;
