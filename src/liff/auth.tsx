import { FC, useEffect } from 'react';
import type Liff from '@line/liff';
import { useRecoilState, useRecoilValue } from 'recoil';
import { liffObjState } from 'src/atoms/eventState';

export const LiffAuth: FC = ({ children }) => {
  const [liffObj, setLiffObj] = useRecoilState(liffObjState);

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
        liff.login();
        await liffInit();
      }

      try {
        const profile = await liff.getProfile();
        userId = profile.userId;
        idToken = liff.getIDToken();
      } catch (error) {
        console.error(error);
      }

      setLiffObj({
        liff: liff,
        idToken: idToken,
        userId: userId,
        isInClient: liff.isInClient(),
      });
    };
    func();
  }, [setLiffObj]);

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
