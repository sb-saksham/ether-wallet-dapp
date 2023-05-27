import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { configureChains, WagmiConfig, createConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { mainnet, hardhat, sepolia, localhost } from 'wagmi/chains';
const localhost_in = {
  id: 31337,
  name: "Localhost",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH"
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"]
    },
    public: {
      http: ["http://127.0.0.1:8545"]
    },
  }
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet, sepolia, hardhat, localhost],
  // [localhost_in],
  [
    alchemyProvider({ apiKey: "PF-BRAa65EWNg_chNAgVzPlwX_ScyX2K" }),
    // alchemyProvider({ alchemyId: process.env.ALCHEMY_ID_G }),
    publicProvider(),
  ],
    // [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "ETHer Wallet DApp",
  chains,
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
