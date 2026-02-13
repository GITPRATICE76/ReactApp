import React from "react";

export default function BottomNavbar() {
  return (
    <div style={styles.footer}>
      <div style={styles.marqueeContainer}>
        <div style={styles.marquee}>
          *** This is Leave Management Tool ---LIVE RESOURCE AVAILABILITY
          ANALYTICS — MONITOR TEAM LEAVE TRENDS ***
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    height: "50px",
    borderTop: "1px solid #dbeafe",
    backgroundColor: "#f8fafc",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    zIndex: 100,
  },

  marqueeContainer: {
    width: "100%",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },

  marquee: {
    display: "inline-block",
    paddingLeft: "100%",
    fontSize: "18px",
    fontWeight: 600,
    color: "#1e40af",
    animation: "marquee 35s linear infinite",
  },
};
