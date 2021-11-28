export const getVercelUrl = () => {
  if (!process.env.VERCEL_URL) {
    return 'http://localhost:3000';
  }

  if (/localhost/.test(process.env.VERCEL_URL)) {
    return 'http://localhost:3000';
  }

  return /^http/.test(process.env.VERCEL_URL)
    ? process.env.VERCEL_URL
    : `https://${process.env.VERCEL_URL}`;
};
