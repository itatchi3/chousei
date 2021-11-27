import { FC, useEffect } from 'react';
import type Liff from '@line/liff';
import { useRecoilState, useRecoilValue } from 'recoil';
import { liffState } from 'src/atoms/eventState';

export const LiffAuth: FC = ({ children }) => {
  const [_liff, setLiff] = useRecoilState(liffState);

  useEffect(() => {
    const func = async () => {
      const liff = (await import('@line/liff')).default;
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
      } catch (error) {
        console.error('liff init error', error);
      }
      if (!liff.isLoggedIn() && !process.env.NEXT_PUBLIC_LIFF_SKIP_LOGIN) {
        liff.login();
      }
      setLiff(liff);
    };
    func();
  }, [setLiff]);

  return <>{children}</>;
};

type UseLiffReturn = {
  initialized: boolean;
  liff?: typeof Liff;
  isInClient?: boolean;
};

export const useLiff = (): UseLiffReturn => {
  const liff = useRecoilValue(liffState);

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
