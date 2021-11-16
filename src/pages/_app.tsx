import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { FC } from 'react';
import { AuthProvider, useLiff } from 'src/hooks/auth';
import { Center, ChakraProvider, Spinner } from '@chakra-ui/react';

const Layout: FC = ({ children }) => {
  const { initialized } = useLiff();

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
