import React from "react";

type NavbarProps = {
  username: string;
  companyName?: string;
  date?: string;
};
import companyLogo from "../../assets/craftsiliconlogo-removebg-preview.png";

export default function Navbar({ username, date }: NavbarProps) {
  const today =
    date ||
    new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div style={styles.navbar}>
      <div style={styles.left}></div>
      <div style={styles.right}>
        <span style={styles.date}>{today}</span>
        <span style={styles.welcome}>Welcome, {username}!</span>

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
    // background: "#f0f7ff",
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
  menuIcon: {
    fontSize: "20px",
    cursor: "pointer",
  },

  companyImage: {
    height: "120px",
    width: "140px",
  },
  brand: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#1e3a8a",
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

  companyName: {
    fontWeight: 700,
    fontSize: "14px",
    color: "#1e3a8a",
  },
  tagline: {
    fontSize: "10px",
    color: "#6b7280",
  },
};
