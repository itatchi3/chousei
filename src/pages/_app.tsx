import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { LiffAuth } from 'src/liff/auth';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from 'theme/theme';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <LiffAuth>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </LiffAuth>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </RecoilRoot>
  );
};
export default MyApp;
