import type Liff from '@line/liff';

export const upDateIdtoken = async (liff: typeof Liff) => {
  const liffInit = async () => {
    try {
      await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
    } catch (error) {
      console.error('liff init error', error);
    }
  };

  liff.login();
  await liffInit();

  return liff.getIDToken();
};
