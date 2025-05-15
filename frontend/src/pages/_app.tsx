import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import Layout from "../Layout/layout";
import { useRouter } from "next/router";
import { ThemeProvider } from "@/Layout/themeProvider";

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);
  const { pathname } = useRouter();
  useEffect(() => {
    setReady(true);
  }, []);
  return (
    <>
      {ready ? (
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Layout pathname={pathname}>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      ) : null}
    </>
  );
}
