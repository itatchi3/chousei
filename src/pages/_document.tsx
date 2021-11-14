import { Html, Head, Main, NextScript } from 'next/document';

const MyDocument = () => {
  const title = 'チョーセイ';
  const description = 'LINE上で簡単に時間単位の日程調整ができるアプリです．';

  return (
    <Html lang="ja-JP">
      <Head>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={title} />
        {/* <meta property="og:image" content={`${url}/ogp.png`} /> */}
        <meta name="format-detection" content="telephone=no" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;
