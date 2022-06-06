import { FC, useEffect } from 'react';
import type Liff from '@line/liff';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { liffObjState, userIdState } from 'src/atoms/eventState';
import { useRouter } from 'next/router';

export const LiffAuth: FC = ({ children }) => {
  const [liffObj, setLiffObj] = useRecoilState(liffObjState);
  const setUserId = useSetRecoilState(userIdState);
  const router = useRouter();

  useEffect(() => {
    const isExistAsPath = router.asPath !== '/event/[id]';
    const isExistLiff = typeof liffObj.liff !== 'undefined';
    if (!isExistAsPath || isExistLiff) return;
    const func = async () => {
      const liff = (await import('@line/liff')).default;

      const liffInit = async () => {
        try {
          await liff.init({
            liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
          });
        } catch (error) {
          console.error(error);
        }
      };

      await liffInit();

      const redirectUri =
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
          ? 'https://' + process.env.NEXT_PUBLIC_VERCEL_URL + router.asPath
          : 'https://' + process.env.NEXT_PUBLIC_URL + router.asPath;

      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: redirectUri });
      }

      const idToken = liff.getIDToken();

      setLiffObj({
        liff: liff,
        isInClient: liff.isInClient(),
        idToken: idToken,
      });

      const checkIdToken = async () => {
        const reLogin = () => {
          liff.logout();
          liff.login({ redirectUri: redirectUri });
        };

        if (!idToken) {
          reLogin();
          return;
        }

        const getProfile = await fetch('https://api.line.me/oauth2/v2.1/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            id_token: idToken,
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
          }),
        });

        if (getProfile.status !== 200) reLogin();
      };
      checkIdToken();

      const getUserId = async () => {
        const profile = await liff.getProfile();
        setUserId(profile.userId);
      };
      getUserId();
    };
    func();
  }, [setLiffObj, setUserId, liffObj, router.asPath]);

  return <>{children}</>;
};

type UseLiffReturn = {
  liff?: typeof Liff;
  isInClient?: boolean;
  userId?: string;
  idToken?: string | null;
};

export const useLiff = (): UseLiffReturn => {
  const liffObj = useRecoilValue(liffObjState);
  const userId = useRecoilValue(userIdState);
  return {
    liff: liffObj.liff,
    isInClient: liffObj.isInClient,
    userId: userId,
    idToken: liffObj.idToken,
  };
};
