import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

const projectId = "ae3f1c9cfce9649700d4ab563eec49aa";

const arbitrum = {
  chainId: 42161,
  name: "Arbitrum",
  currency: "ETH",
  explorerUrl: "https://arbiscan.io/",
  rpcUrl: "https://arbitrum.llamarpc.com",
};

// 3. Create a metadata object
const metadata = {
  name: "APP-everValueCoin",
  description: "My Website description",
  url: "https://app.evervaluecoin.com",
  icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: "...", // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
  auth: {
    email: false,
    socials: [], // add social logins
    showWallets: true,
    walletFeatures: false,
  },
});

// 5. Create a AppKit instance
createWeb3Modal({
  ethersConfig,
  chains: [arbitrum],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableSwaps: false,
  enableOnramp: false,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.Fragment>
    <App />
  </React.Fragment>
);
