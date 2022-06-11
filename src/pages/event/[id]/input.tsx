import { Box, Flex } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { eventIdState } from 'src/atoms/eventState';
import { InputSchedule } from 'src/components/InputSchedule/InputSchedule';
import { useEventDetailQuery } from 'src/hooks/useEventDetail';

const Input = () => {
  const id = useRecoilValue(eventIdState);
  const { data: eventDetail } = useEventDetailQuery(id);
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
