import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

import "@rainbow-me/rainbowkit/styles.css";

import { darkTheme, getDefaultWallets, RainbowKitProvider, Theme } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { goerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import Header from "../components/header";

const { chains, provider } = configureChains(
  [goerli],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID as string }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const theme = darkTheme({
  overlayBlur: "small",
});

const newTheme = {
  ...theme,
  fonts: {
    body: "Matter",
  },
} as Theme;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        theme={newTheme}
        chains={chains}
      >
        <Toaster />
        <Header />
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
