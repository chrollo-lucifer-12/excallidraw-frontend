import CreateWhiteboard from "./create-whiteboard";

const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-center w-full">
      <h1 className="text-3xl font-bold">My Whiteboards</h1>

      <CreateWhiteboard />
    </div>
  );
};

export default DashboardHeader;
