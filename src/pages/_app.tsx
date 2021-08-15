import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { RecoilRoot } from 'recoil';

import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import { LiffProvider } from 'react-liff';

const theme = createTheme({
  palette: {
    primary: {
      light: '#4bc2d2',
      main: '#1FB3C7',
      dark: '#157d8b',
      contrastText: '#fff',
    },
  },
});

const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
const stubEnabled = process.env.NODE_ENV !== 'production';

function MyApp({ Component, pageProps }: AppProps) {
  // 開発用に一時的にコメントアウト

  // useEffect(() => {
  //   const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
  //   const liffLogin = async () => {
  //     // liffにwindowが含まれるため，ここで定義
  //     const liff = (await import('@line/liff')).default;
  //     try {
  //       if (typeof liffId === 'string') {
  //         await liff.init({ liffId });
  //       } else {
  //         throw 'NEXT_PUBLIC_LIFF_ID is undefined!';
  //       }
  //     } catch (error) {
  //       console.error('liff init error', error.message);
  //     }
  //     if (!liff.isLoggedIn()) {
  //       liff.login();
  //     }
  //   };
  //   liffLogin();
  // }, []);
  return (
    <LiffProvider liffId={liffId as string} stubEnabled={stubEnabled}>
      <ThemeProvider theme={theme}>
        <RecoilRoot>
          <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="center"
            spacing={3}
          >
            <Grid
              container
              item
              className="app-content"
              direction="column"
              alignItems="center"
              justify="flex-start"
            >
              <Component {...pageProps} />
            </Grid>
          </Grid>
        </RecoilRoot>
      </ThemeProvider>
    </LiffProvider>
  );
}
export default MyApp;
