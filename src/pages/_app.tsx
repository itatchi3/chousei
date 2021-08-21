// import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import { FC } from 'react';
import { AuthProvider, useAuth } from 'src/hooks/auth';
import { ChakraProvider } from '@chakra-ui/react';

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

const Layout: FC = ({ children }) => {
  const { initialized } = useAuth();

  if (!initialized) {
    return <p>loading...</p>;
  }

  return <>{children}</>;
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <Layout>
        <ChakraProvider>
          {/* <ThemeProvider theme={theme}> */}
          <RecoilRoot>
            {/* <Grid
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
              > */}
            <Component {...pageProps} />
            {/* </Grid>
            </Grid> */}
          </RecoilRoot>
          {/* </ThemeProvider> */}
        </ChakraProvider>
      </Layout>
    </AuthProvider>
  );
};
export default MyApp;
