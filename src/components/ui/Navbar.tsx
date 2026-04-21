import React from "react";
import { jwtDecode } from "jwt-decode";
import companyLogo from "../../assets/ChatGPT_Image_Feb_16__2026__09_53_46_AM-removebg-preview.png";

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
      <div style={styles.left}>
        <span style={styles.welcome}>
          Welcome{username ? `, ${username}` : ""}!
        </span>
      </div>

      <div style={styles.right}>
        <span style={styles.date}>{today}</span>

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
    height: "170px",
    width: "159px",
    margin: "6px -7px 6px 12px",
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
    margin: "0px -23px 0px 0px",
  },
  company: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
};
