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
      let idToken: string | null | undefined;
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
        liff.login({ redirectUri: process.env.NEXT_PUBLIC_URL + router.asPath });
      }

      try {
        const profile = await liff.getProfile();
        userId = profile.userId;
        idToken = liff.getIDToken();
      } catch (error) {
        console.error(error);
      }

      if (idToken) {
        const getProfile = await fetch('https://api.line.me/oauth2/v2.1/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            id_token: idToken,
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
          }),
        });

        if (getProfile.status !== 200) {
          liff.logout();
          liff.login({ redirectUri: process.env.NEXT_PUBLIC_URL + router.asPath });
        }
      }

      setLiffObj({
        liff: liff,
        idToken: idToken,
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
  idToken?: string | null;
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
    idToken: liffObj.idToken,
  };
};
