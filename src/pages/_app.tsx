import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { LiffAuth } from 'src/liff/auth';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from 'theme/theme';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <RecoilRoot>
      <LiffAuth>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </LiffAuth>
    </RecoilRoot>
  );
};
export default MyApp;
