"use client";

import { useEffect, useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, linea, lineaTestnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { infuraProvider } from "wagmi/providers/infura";

const { chains, publicClient } = configureChains(
  [mainnet, linea, lineaTestnet],
  [infuraProvider({ apiKey: "2b7300b9852a435d86a5dc856e462c0e" }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "SonarMeta V4 RainbowKit",
  projectId: "fcb70c4ddf11bbd77b7a93e5a4897edd",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function RainbowKit({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  // 防止hydration错误
  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {ready && (
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            chains={chains}
            theme={lightTheme({
              accentColor: "#7b3fe4",
              accentColorForeground: "white",
              borderRadius: "medium",
              overlayBlur: "small",
            })}
            locale="en-US"
          >
            {children}
          </RainbowKitProvider>
        </WagmiConfig>
      )}
    </>
  );
}
