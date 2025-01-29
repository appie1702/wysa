import MainContent from "./main-content";
import Sidebar from "./sidebar";

function Dashboard() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <MainContent />
    </div>
  );
}

export default Dashboard;
