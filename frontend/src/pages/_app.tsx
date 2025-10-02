import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ReactNode, useEffect, useState } from "react";
import RootLayout from "../Layout/RootLayout";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import { store } from "@/components/store/store";
import SocketListener from "@/Layout/SocketListener";
import AdminLayout from "@/Layout/AdminLayout";

import { Web3Provider } from "@/context/web3model";

type NextPageWithLayout = AppProps["Component"] & {
  getLayout?: (page: ReactNode) => ReactNode;
};

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const Page = Component as NextPageWithLayout;
  let getLayout: (page: ReactNode) => ReactNode;

  if (pathname.startsWith("/admin")) {
    getLayout = (page) => <AdminLayout> {page} </AdminLayout>;
  } else {
    getLayout = Page.getLayout ?? ((page) => <RootLayout>{page}</RootLayout>);
  }
  return mounted ? (
    <Web3Provider>
      <Provider store={store}>
        <SocketListener />
        {getLayout(<Page {...pageProps} />)}
      </Provider>
    </Web3Provider>
  ) : null;
}
