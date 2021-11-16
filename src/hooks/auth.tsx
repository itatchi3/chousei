import { createContext, FC, useContext, useEffect, useState } from 'react';
import type Liff from '@line/liff';

export type LiffContextType = { liff?: typeof Liff };
const liffContextInit = { liff: undefined };
const LiffContext = createContext<LiffContextType>(liffContextInit);

export const AuthProvider: FC = ({ children }) => {
  const [liff, setLiff] = useState<LiffContextType>(liffContextInit);

  useEffect(() => {
    let unmounted = false;
    const func = async () => {
      const liff = (await import('@line/liff')).default;
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
      } catch (error) {
        console.error('liff init error', error);
      }

      if (!unmounted) {
        setLiff({ liff });
      }
    };
    func();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, []);

  return <LiffContext.Provider value={liff}>{children}</LiffContext.Provider>;
};

type UseAuthReturn = {
  initialized: boolean;
  liff?: typeof Liff;
  isInClient?: boolean;
};

export const useLiff = (): UseAuthReturn => {
  const { liff } = useContext(LiffContext);

  if (!liff) {
    return {
      initialized: false,
    };
  }

  return {
    initialized: true,
    liff: liff,
    isInClient: liff.isInClient(),
  };
};
