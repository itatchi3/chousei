export const getVercelUrl = () => {
  console.log(process.env.NEXT_PUBLIC_VERCEL_URL);
  if (!process.env.NEXT_PUBLIC_VERCEL_URL) {
    return 'http://localhost:3000';
  }

  if (/localhost/.test(process.env.NEXT_PUBLIC_VERCEL_URL)) {
    return 'http://localhost:3000';
  }

  return /^http/.test(process.env.NEXT_PUBLIC_VERCEL_URL)
    ? process.env.VERCEL_URL
    : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
};
