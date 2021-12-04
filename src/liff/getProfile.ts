export const getPrifile = async (accessToken: string | null | undefined) => {
  if (!accessToken) {
    throw new Error('Error: could not find accessToken');
  }

  if (!process.env.NEXT_PUBLIC_CLIENT_ID) {
    throw new Error('Error: could not find NEXT_PUBLIC_CLIENT_ID');
  }

  const checkAccessToken = await fetch('https://api.line.me/oauth2/v2.1/verify', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `access_token=${accessToken}`,
  });

  console.log(1);

  if (checkAccessToken.status !== 200) {
    throw new Error();
  }

  console.log(2);

  const checkAccessTokenJson = await checkAccessToken.json();

  if (
    checkAccessTokenJson.client_id !== process.env.NEXT_PUBLIC_CLIENT_ID ||
    checkAccessTokenJson.expires_in <= 0
  ) {
    throw new Error();
  }

  console.log(3);

  const getUserProfile = await fetch('https://api.line.me/v2/profile', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await getUserProfile.json();

  console.log(data);

  const userId: string = data.sub;
  const userName: string = data.name;
  const profileImg: string = data.picture;

  return { userId, userName, profileImg };
};
