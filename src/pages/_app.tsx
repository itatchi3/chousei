// import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { createTheme } from '@material-ui/core/styles';
import { FC } from 'react';
import { AuthProvider, useAuth } from 'src/hooks/auth';
import { Center, ChakraProvider, Spinner } from '@chakra-ui/react';

const Layout: FC = ({ children }) => {
  const { initialized } = useAuth();

  if (!initialized) {
    return (
      <ChakraProvider>
        <Center p="8">
          <Spinner color="green.400" />
        </Center>
      </ChakraProvider>
    );
  }

  return <>{children}</>;
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <Layout>
        <ChakraProvider>
          <RecoilRoot>
            <Component {...pageProps} />
          </RecoilRoot>
        </ChakraProvider>
      </Layout>
    </AuthProvider>
  );
};
export default MyApp;
