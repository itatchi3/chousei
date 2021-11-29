export const getPrifile = async (idToken: string | null | undefined) => {
  if (!idToken) {
    throw new Error('Error: could not find idToken');
  }
  console.log('idToken:', idToken);
  if (!process.env.CLIENT_ID) {
    throw new Error('Error: could not find CLIENT_ID');
  }
  console.log('CLIENT_ID:', process.env.CLIENT_ID);

  const response = await fetch('https://api.line.me/oauth2/v2.1/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `id_token=${idToken}&client_id=${process.env.CLIENT_ID}`,
  });

  const data = await response.json();
  if (response.status !== 200) {
    throw new Error(`idTokenError`);
  }
  const userId: string = data.sub;
  const userName: string = data.name;
  const profileImg: string = data.picture;
  return { userId, userName, profileImg };
};
