import React from "react";
import { jwtDecode } from "jwt-decode";
import companyLogo from "../../assets/craftsiliconlogo-removebg-preview.png";

interface MyToken {
  id: number;
  name: string;
  role: string;
  exp: number;
}

export default function Navbar() {
  const token = localStorage.getItem("token");

  let username = "";

  if (token) {
    try {
      const decoded = jwtDecode<MyToken>(token);
      username = decoded.name;
    } catch {
      username = "";
    }
  }

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div style={styles.navbar}>
      <div style={styles.left}></div>

      <div style={styles.right}>
        <span style={styles.date}>{today}</span>

        <span style={styles.welcome}>
          Welcome{username ? `, ${username}` : ""}!
        </span>

        <div style={styles.company}>
          <img
            src={companyLogo}
            alt="Company Logo"
            style={styles.companyImage}
          />
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    height: "64px",
    borderBottom: "1px solid #dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  companyImage: {
    height: "120px",
    width: "140px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  date: {
    fontSize: "14px",
    color: "#1e40af",
    fontWeight: 500,
  },
  welcome: {
    fontSize: "14px",
    color: "#1e40af",
    fontWeight: 600,
  },
  company: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
};
