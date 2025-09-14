import { useState, type ReactNode } from "react";
import { http, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { createWeb3Modal } from "@web3modal/wagmi/react";
import { bscTestnet } from "wagmi/chains";

const metadata = {
  name: "wagmi",
  description: "Binance Smart Chain Testnet Example",
  url: 'https://leox-multi.vercel.app',
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const projectId = process.env.NEXT_PUBLIC_KEY || "";
const chains = [bscTestnet] as const;

const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
}) as any;
(config as any).autoConnect = false;

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  themeVariables: {
    "--w3m-color-mix": "#2563eb",
    "--w3m-accent": "#000000"
  },
  chainImages: {},
 

});

export function Web3Provider(props: any) {
  const [queryClient] = useState(() => new QueryClient());
  console.log(projectId, "project id");

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
