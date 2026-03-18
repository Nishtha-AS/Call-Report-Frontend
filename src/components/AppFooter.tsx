import React from "react";
import { useHistory } from "react-router-dom";
import "./app-chrome.css";

/* Assets */
import homeIcon from "../assets/home.svg";
import reportsIcon from "../assets/reports-nav.svg";
import supportIcon from "../assets/support.svg";
import logoutIcon from "../assets/logout icon.svg";

type FooterKey = "home" | "reports" | "support" | "logout";
type Props = { active: FooterKey };

export default function AppFooter({ active }: Props) {
  const history = useHistory();

  const go = (k: FooterKey) => {
    if (k === "home") {
      // ✅ Fix: Use window.location.href for reliable navigation to the dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);
    } else if (k === "reports") history.replace("/reports");
    else if (k === "support") history.replace("/support");
    else if (k === "logout") history.replace("/login-creds");
  };

  const items: { k: FooterKey; label: string; src: string }[] = [
    { k: "home", label: "Home", src: homeIcon },
    { k: "reports", label: "Reports", src: reportsIcon },
    { k: "support", label: "Support", src: supportIcon },
    { k: "logout", label: "Logout", src: logoutIcon },
  ];

  return (
    <footer className="ftr" role="navigation" aria-label="App footer">
      <nav className="ftr-bar">
        {items.map(({ k, label, src }) => {
          const isActive = k === active;
          return (
            <button
              key={k}
              className={`ftr-item ${isActive ? "active" : ""}`}
              aria-current={isActive ? "page" : undefined}
              onClick={() => go(k)}
            >
              <span className="ftr-bubble" aria-hidden="true" />
              <img className="ftr-ico" src={src} alt="" />
              <span className="ftr-label">{label}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
}
