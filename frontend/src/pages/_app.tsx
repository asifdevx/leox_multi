import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import Layout from "../Layout/layout";
import { useRouter } from "next/router";
import { Web3Provider } from "@/context/web3model";
import { Provider } from "react-redux";
import { store } from "@/components/store/store";

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);
  const { pathname } = useRouter();
  useEffect(() => {
    setReady(true);
  }, []);
  return (
    <>
      {ready ? (
        <Web3Provider>
          <Provider store={store}>
          <Layout pathname={pathname}>
            <Component {...pageProps} />
          </Layout>
          </Provider>
        </Web3Provider>
      ) : null}
    </>
  );
}
