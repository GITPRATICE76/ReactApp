import Sidebar from "../components/ui/Sidebar";
import Navbar from "../components/ui/Navbar";
import { useEffect, useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - fixed height */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex flex-col flex-1">
        {/* Navbar - sticky */}
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-slate-100 p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
