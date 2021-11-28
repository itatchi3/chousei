export const getPrifile = async (idToken: string | null | undefined) => {
  if (!idToken) {
    throw 'Error: could not find idToken';
  }
  if (!process.env.CLIENT_ID) {
    throw 'Error: could not find CLIENT_ID';
  }
  const idTokenParams = new URLSearchParams();
  idTokenParams.append('id_token', idToken);
  idTokenParams.append('client_id', process.env.CLIENT_ID);

  const response = await fetch('https://api.line.me/oauth2/v2.1/verify', {
    method: 'POST',
    body: idTokenParams,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`LINE ID Token API Error: ${data.error} - ${data.error_description}`);
  }
  const userId: string = data.sub;
  const userName: string = data.name;
  const profileImg: string = data.picture;
  return { userId, userName, profileImg };
};
