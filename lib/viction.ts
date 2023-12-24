import { defineChain } from "viem";

// @ts-ignore
export const viction = defineChain({
  id: 88,
  name: "Viction",
  network: "viction",
  nativeCurrency: {
    decimals: 18,
    name: "Viction",
    symbol: "VIC",
  },
  rpcUrls: {
    default: {
      http: ["https://viction.blockpi.network/v1/rpc/public"],
    },
    public: {
      http: ["https://viction.blockpi.network/v1/rpc/public"],
    },
  },
  blockExplorers: {
    default: { name: "Tomoscan", url: "https://tomoscan.io/" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 5882,
    },
  },
  testnet: true,
});

// @ts-ignore
export const victionTestnet = defineChain({
  id: 89,
  name: "Viction Testnet",
  network: "viction-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Viction Testnet",
    symbol: "VIC",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.tomochain.com"],
    },
    public: {
      http: ["https://rpc.testnet.tomochain.com"],
    },
  },
  blockExplorers: {
    default: { name: "Tomoscan", url: "https://testnet.tomoscan.io" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 5882,
    },
  },
  testnet: true,
});
