import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { RecoilRoot } from 'recoil';
import type Liff from '@line/liff';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
// import { LiffProvider } from 'react-liff';

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

const liffId = '1656098585-v7VEeZ7Q';
const stubEnabled = process.env.NODE_ENV !== 'production';

function MyApp({ Component, pageProps }: AppProps) {
  // const [liff, setLiff] = useState<typeof Liff>();
  // 開発用に一時的にコメントアウト
  useEffect(() => {
    // const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
    const liffLogin = async () => {
      // liffにwindowが含まれるため，ここで定義
      const liff = (await import('@line/liff')).default;
      try {
        if (typeof liffId === 'string') {
          await liff.init({ liffId });
          // setLiff(liff);
        } else {
          throw 'NEXT_PUBLIC_LIFF_ID is undefined!';
        }
      } catch (error) {
        console.error('liff init error', error.message);
      }
      if (!liff.isLoggedIn()) {
        liff.login();
      }
    };
    liffLogin();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <Grid container direction="column" justify="space-between" alignItems="center" spacing={3}>
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
  );
}
export default MyApp;
