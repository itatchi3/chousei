import { Html, Head, Main, NextScript } from 'next/document';

const MyDocument = () => {
  const title = 'チョーセイ';
  const description = 'LINE上で簡単に時間単位の日程調整ができるアプリです。';

  return (
    <Html lang="ja-JP">
      <Head>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={title} />
        <meta property="og:image" content={`/ogp.PNG`} />
        <meta name="format-detection" content="telephone=no" />
        <script defer src="https://itatchi3-umami.vercel.app/script.js" data-website-id="3e4aeb18-d54f-44d3-be73-0c2bd5304e58"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;
