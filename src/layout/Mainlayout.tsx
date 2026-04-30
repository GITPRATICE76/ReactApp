import Sidebar from "../components/ui/Sidebar";
import Navbar from "../components/ui/Navbar";
import { useEffect, useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [username, setUsername] = useState("User");
  console.log(username)

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* ✅ Sidebar width FIXED */}
      <div className="w-50 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Right Side */}
      <div className="flex flex-col flex-1 min-w-0">
        
        {/* Navbar */}
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>

        {/* ✅ Content spacing reduced */}
        <main className="flex-1 overflow-y-auto bg-slate-100 px-3 py-3">
          
          {/* ✅ Center + prevent overflow */}
          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>

        </main>

      </div>
    </div>
  );
}