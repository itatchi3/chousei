import { Box, Center, Text } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/react';

export const NotClient = () => {
  return (
    <>
      <Text fontSize="md" fontWeight="bold" color="red">
        LINE(ios/android)のトーク画面上以外では出欠表の作成や、予定・コメントの追加、
        編集ができません
      </Text>
      <Box p="2">
        <Box fontWeight="bold" pb="2" textAlign="center">
          チョーセイ公式アカウント
        </Box>
        <Center>
          <a href="https://lin.ee/InOsTpg">
            <Image
              src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png"
              alt="友だち追加"
              height="40px"
            />
          </a>
        </Center>
      </Box>
    </>
  );
};
