import React from 'react';
import '../styles/global.css';
import Head from 'next/head';
import { ThemeProvider } from 'next-themes';

const App = ({ Component, pageProps }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onClickAnywhere = () => {
    inputRef.current?.focus();
  };

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
          key="viewport"
        />
      </Head>

      <ThemeProvider attribute="class" disableTransitionOnChange>
        <div
          className="text-foreground w-full text-xs md:text-base"
          onClick={onClickAnywhere}
        >
          <main className="bg-background w-full h-full p-2">
            <Component {...pageProps} inputRef={inputRef} />
          </main>
        </div>
      </ThemeProvider>
    </>
  );
};

export default App;
