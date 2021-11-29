export const getVercelUrl = () => {
  if (!process.env.NEXT_PUBLIC_VERCEL_URL) {
    return 'https://localhost:3000';
  }

  if (/localhost/.test(process.env.NEXT_PUBLIC_VERCEL_URL)) {
    return 'https://localhost:3000';
  }

  if (process.env.VERCEL_ENV === 'preview') {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  if (process.env.VERCEL_ENV === 'production') {
    return `${process.env.NEXT_PUBLIC_CHOUSEI_DOMEIN}`;
  }
};
