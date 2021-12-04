import { FC, useEffect } from 'react';
import type Liff from '@line/liff';
import { useRecoilState, useRecoilValue } from 'recoil';
import { liffObjState } from 'src/atoms/eventState';
import { useRouter } from 'next/router';

export const LiffAuth: FC = ({ children }) => {
  const [liffObj, setLiffObj] = useRecoilState(liffObjState);
  const router = useRouter();

  useEffect(() => {
    const func = async () => {
      const liff = (await import('@line/liff')).default;
      let accessToken: string | null | undefined;
      let userId: string | undefined;

      const liffInit = async () => {
        try {
          await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
        } catch (error) {
          console.error(error);
        }
      };

      await liffInit();

      if (!liff.isLoggedIn()) {
        liff.login();
      }

      try {
        const profile = await liff.getProfile();
        userId = profile.userId;
        accessToken = liff.getAccessToken();
      } catch (error) {
        console.error(error);
      }

      const checkAccessToken = await fetch('https://api.line.me/oauth2/v2.1/verify', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(checkAccessToken);

      console.log(accessToken);

      // if (response.status !== 200) {
      //   liff.login({ redirectUri: process.env.NEXT_PUBLIC_URL });
      // }

      setLiffObj({
        liff: liff,
        accessToken: accessToken,
        userId: userId,
        isInClient: liff.isInClient(),
      });
    };
    func();
  }, [setLiffObj, router.asPath]);

  return <>{children}</>;
};

type UseLiffReturn = {
  initialized: boolean;
  liff?: typeof Liff;
  isInClient?: boolean;
  userId?: string;
  accessToken?: string | null;
};

export const useLiff = (): UseLiffReturn => {
  const liffObj = useRecoilValue(liffObjState);

  if (!liffObj.liff) {
    return {
      initialized: false,
    };
  }

  return {
    initialized: true,
    liff: liffObj.liff,
    isInClient: liffObj.isInClient,
    userId: liffObj.userId,
    accessToken: liffObj.accessToken,
  };
};
