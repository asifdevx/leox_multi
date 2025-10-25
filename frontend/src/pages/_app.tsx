import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ReactNode, useEffect, useState } from "react";
import RootLayout from "../Layout/RootLayout";
import ProfileLayout from "../Layout/ProfileLayout";
import AdminLayout from "../Layout/AdminLayout";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import { store } from "@/components/store/store";
import SocketListener from "@/Layout/SocketListener";
import { Web3Provider } from "@/context/web3model";

type NextPageWithLayout = AppProps["Component"] & {
  getLayout?: (page: ReactNode) => ReactNode;
};

export default function App({ Component, pageProps }: AppProps) {
  const { asPath } = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const Page = Component as NextPageWithLayout;

  let getLayout: (page: ReactNode) => ReactNode;

  if (asPath.startsWith("/admin")) {
    getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
  } else if (
    /^\/(?!items|admin)[^\/]+\/(owned|sale|sold|created)/.test(asPath)
  ) {
    // profile pages
    const segments = asPath.split("/").filter(Boolean);
    const username = segments[0];
  
    
    getLayout = (page) => <ProfileLayout username={username}>{page}</ProfileLayout>;
  } else if (asPath.startsWith("/items")) {
    // items pages
    getLayout = (page) => <RootLayout>{page}</RootLayout>; // or ItemsLayout
  } else {
    // fallback
    getLayout = Page.getLayout ?? ((page) => <RootLayout>{page}</RootLayout>);
  }

  return (
    <Web3Provider>
      <Provider store={store}>
        <SocketListener />
        {getLayout(<Page {...pageProps} />)}
      </Provider>
    </Web3Provider>
  );
}
