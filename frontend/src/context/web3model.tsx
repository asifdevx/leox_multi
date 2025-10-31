import { bscTestnet } from "@wagmi/core/chains";
import { createConfig, createStorage, http, injected } from "@wagmi/core";
import { walletConnect } from "wagmi/connectors";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const projectId = process.env.NEXT_PUBLIC_KEY!;

const connector = walletConnect({
  projectId,
  metadata: {
    name: "wagmi",
    description: "Binance Smart Chain Testnet Example",
    // url: "https://leox-multi.vercel.app",
    url: "http://192.168.1.100:3000",

    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  },
});

export const config = createConfig({
  chains: [bscTestnet],
  storage: createStorage({
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  }),
  transports: {
    [bscTestnet.id]: http("https://data-seed-prebsc-1-s1.binance.org:8545"),
  },
  connectors: [injected(), walletConnect({ projectId }), connector]
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
         {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}