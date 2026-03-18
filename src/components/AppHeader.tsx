import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./app-chrome.css";

/* Assets (names unchanged) */
import auLogo from "../assets/au logo.png";
import asMark from "../assets/as-logo circle.png";
import burger from "../assets/burger menu.svg";
import closeIcon from "../assets/icon-close.svg";
import brand from "../assets/aadiswan-logo.png";

import icoProfile from "../assets/menu-profile.svg";
import icoAbout from "../assets/menu-about.svg";
import icoPrivacy from "../assets/menu-privacy.svg";

import icoWeb from "../assets/icon-web.svg";
import icoMail from "../assets/icon-mail.svg";
import icoPhone from "../assets/icon-phone.svg";

type Props = {
  title?: string;
  onBack?: () => void; // optional override
  welcome?: { initials: string; name: string; sub: string }; // show welcome card (home)
};

export default function AppHeader({ title, onBack, welcome }: Props) {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<"root" | "profile" | "about" | "privacy">("root");

  const handleBack = () => {
    // default: always take user to dashboard/home
    if (onBack) onBack();
    else history.replace("/dashboard");
  };

  const close = () => {
    setOpen(false);
    setPanel("root");
  };

  const withCard = !!welcome;
  const withTitle = !!title;

  return (
    <>
      <header className={`hdr ${withCard ? "hdr--with-card" : ""} ${withTitle ? "hdr--with-title" : ""}`}>
        {/* Top row (logos + menu) */}
        <div className="hdr-row">
          <div className="hdr-brand">
            <img className="hdr-au" src={auLogo} alt="AU" />
            <img className="hdr-as" src={asMark} alt="AS" />
          </div>

          <button className="hdr-menu hdr-menu--plain" onClick={() => setOpen(true)} aria-label="Menu">
            <img src={burger} alt="" />
          </button>
        </div>

        {/* Home welcome card (optional) */}
        {welcome && (
          <div className="hdr-card" aria-label="Welcome">
            <div className="hdr-avatar">{welcome.initials}</div>
            <div className="hdr-card-text">
              <div className="hdr-card-title">Welcome {welcome.name}!</div>
              <div className="hdr-card-sub">{welcome.sub}</div>
            </div>
          </div>
        )}

        {/* Title row (other screens) */}
        {title && (
          <div className="hdr-titleRow">
            <button className="hdr-back" onClick={handleBack} aria-label="Back to Dashboard">
              <span className="hdr-backArrow" />
            </button>
            <h2 className="hdr-title">{title}</h2>
          </div>
        )}
      </header>

      {/* Slide-out menu */}
      {open && (
        <div className="menu-overlay" role="dialog" aria-modal>
          <aside className="menu-panel">
            <div className="menu-top">
              <div className="menu-as">
                <img src={asMark} alt="AS" />
              </div>
              <button className="menu-close" onClick={close} aria-label="Close">
                <img src={closeIcon} alt="" />
              </button>
            </div>

            {/* ROOT LIST */}
            {panel === "root" && (
              <nav className="menu-list">
                <button className="menu-item" onClick={() => setPanel("profile")}>
                  <img src={icoProfile} alt="" />
                  <span>Profile Information</span>
                </button>
                <button className="menu-item" onClick={() => setPanel("about")}>
                  <img src={icoAbout} alt="" />
                  <span>About Us</span>
                </button>
                <button className="menu-item" onClick={() => setPanel("privacy")}>
                  <img src={icoPrivacy} alt="" />
                  <span>Privacy Policy</span>
                </button>
              </nav>
            )}

            {/* PROFILE */}
            {panel === "profile" && (
              <section className="menu-page">
                <h3 className="menu-title">Profile Information</h3>
                <div className="profile-form">
                  <div className="row two">
                    <div>
                      <label>User ID</label>
                      <input value="130422" readOnly />
                    </div>
                    <div>
                      <label>Employee ID</label>
                      <input value="41234" readOnly />
                    </div>
                  </div>
                  <div className="row two">
                    <div>
                      <label>First Name</label>
                      <input value="John" readOnly />
                    </div>
                    <div>
                      <label>Last Name</label>
                      <input value="Doe" readOnly />
                    </div>
                  </div>
                  <div className="row">
                    <label>Email</label>
                    <input value="johndoe@gmail.com" readOnly />
                  </div>
                  <div className="menu-actions">
                    <button className="btn-secondary" onClick={() => setPanel("root")}>Back</button>
                  </div>
                </div>
              </section>
            )}

            {/* ABOUT */}
            {panel === "about" && (
              <section className="menu-page">
                <h3 className="menu-title">About Us</h3>
                <div className="about-card">
                  <img src={brand} alt="AADISWAN" className="about-logo" />
                  <p className="about-copy">
                    Founded in 2014, Aadiswan helps financial institutions digitize and modernize credit processes—
                    origination, underwriting, monitoring and collections—improving speed, control and compliance.
                  </p>
                  <div className="about-links">
                    <a href="#" className="alink"><img src={icoWeb} alt="" /><span>www.aadiswan.com</span></a>
                    <a href="mailto:contactus@aadiswan.com" className="alink"><img src={icoMail} alt="" /><span>contactus@aadiswan.com</span></a>
                    <a href="tel:+91997177797" className="alink"><img src={icoPhone} alt="" /><span>+91 9971 77797</span></a>
                  </div>
                </div>
                <div className="menu-actions">
                  <button className="btn-secondary" onClick={() => setPanel("root")}>Back</button>
                </div>
              </section>
            )}

            {/* PRIVACY */}
            {panel === "privacy" && (
              <section className="menu-page">
                <h3 className="menu-title">Privacy Policy</h3>
                <p className="about-copy">
                  We respect your privacy. This app collects only the data required for authentication and service
                  delivery. Detailed policy & data handling practices are available on our website.
                </p>
                <div className="menu-actions">
                  <button className="btn-secondary" onClick={() => setPanel("root")}>Back</button>
                </div>
              </section>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
