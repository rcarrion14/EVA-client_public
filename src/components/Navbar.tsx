import React, { useState } from "react";
import { formatAddress } from "../utils";
import { useSwitchNetwork, useWeb3Modal } from "@web3modal/ethers/react";
import { useConnection } from "../Context/ConnectionContext";
import Bridge from "./Modals/Bridge";

const scrollToSection = (sectionId: string): void => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

const sections = [
  { id: "home", label: "Home" },
  { id: "mining", label: "Mining" },
  { id: "dashboard", label: "Dashboard" },
];

const Navbar: React.FC = () => {
  const [isNavbarMobile, setIisNavbarMobile] = useState(false);
  const { isConnected, chainId, address } = useConnection();

  const { open } = useWeb3Modal();
  const { switchNetwork } = useSwitchNetwork();

  const [showBridge, setShowBridge] = useState(false);

  const connectionButtonData = () => {
    if (!isConnected) {
      const operation = open;
      const message = "CONNECT";
      return { operation, message };
    }
    if (chainId != 42161) {
      const operation = () => switchNetwork(42161);
      const message = "WRONG NETWORK";
      return { operation, message };
    }
    if (address) {
      const operation = open;
      const message = formatAddress(address);
      return { operation, message };
    }
  };

  return (
    <nav className="navbar">
      <img className="nav-logo" src="./logoEverValue.png" />
      <img className="nav-logo_mobile" src="./coinEV.png" />

      <ul className={isNavbarMobile ? "nav-menu active" : "nav-menu"}>
        <div
          onClick={() => {
            setIisNavbarMobile(false);
          }}
          className={isNavbarMobile ? "closeNavbar closed" : "closeNavbar "}
        >
          &times;
        </div>
        {sections.map((section) => (
          <li className="nav-item" key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(section.id);
              }}
            >
              {section.label}
            </a>
          </li>
        ))}
        <li className="nav-item">
          <a
            onClick={() => {
              setShowBridge(true);
            }}
          >
            Bridge
          </a>
        </li>
      </ul>
      {showBridge ? (
        <Bridge setIsModalOpen={() => setShowBridge(false)} />
      ) : null}
      <div className="connection-container">
        <img className="connection-logo" src="logoArb.png" alt="" />
        <button
          onClick={() => connectionButtonData()?.operation()}
          className={
            isConnected && chainId != 42161
              ? "btn-connection networkError"
              : "btn-connection"
          }
        >
          {connectionButtonData()?.message}
        </button>
      </div>
      <div
        className="hamburger"
        onClick={() => {
          setIisNavbarMobile(true);
        }}
      >
        &#9776;
      </div>
    </nav>
  );
};

export default Navbar;
