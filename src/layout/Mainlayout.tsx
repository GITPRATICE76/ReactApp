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
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar username={username} />

        <main style={{ flex: 1, padding: "30px", background: "#f1f5f9" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
