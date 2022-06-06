import { Box, Flex } from '@chakra-ui/react';
import { InputSchedule } from 'src/components/InputSchedule/InputSchedule';
import { useEventDetailQuery } from 'src/hooks/useEventDetail';

const Input = () => {
  const { data: eventDetail } = useEventDetailQuery();
  return (
    <>
      {eventDetail ? (
        <InputSchedule />
      ) : (
        <Flex height="100vh" px="5" justifyContent="center" alignItems="center">
          <Box fontWeight="bold">
            イベントデータが読み込めませんでした。
            <br />
            イベント詳細画面へ戻ってください。
          </Box>
        </Flex>
      )}
    </>
  );
};
export default Input;
