import { useRecoilState } from 'recoil';
import { editingEventState } from 'src/atoms/eventState';
import {
  Box,
  Circle,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/react';

export const InputEventOverview = () => {
  const [event, setEvent] = useRecoilState(editingEventState);
  const changeEventname = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setEvent((state) => ({
      ...state,
      eventName: evt.target.value,
    }));
  };
  const changeDescription = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEvent((state) => ({
      ...state,
      description: evt.target.value,
    }));
  };

  return (
    <>
      <Flex align="center">
        <Circle size="30px" bg="green.500" color="white" fontWeight="bold">
          1
        </Circle>
        <Text fontSize="lg" fontWeight="bold" pl="4">
          イベント概要を入力
        </Text>
      </Flex>
      <Box p="3">
        <FormControl px="3" py="2" borderWidth="2px" borderRadius="lg" isRequired>
          <Box py="1">
            <FormLabel fontWeight="bold" fontSize="sm">
              イベント名
            </FormLabel>
          </Box>
          <Input onChange={changeEventname} value={event.eventName} />
          <FormHelperText fontSize="xs">ミーティング、練習日程、シフト調整など</FormHelperText>
        </FormControl>
      </Box>
      <Box px="3">
        <FormControl px="3" py="2" borderWidth="2px" borderRadius="lg">
          <Box py="1">
            <FormLabel fontWeight="bold" fontSize="sm">
              補足・備考
            </FormLabel>
          </Box>
          <Textarea onChange={changeDescription} value={event.description} rows={4} />
          <FormHelperText fontSize="xs">〆切は○日など</FormHelperText>
        </FormControl>
      </Box>
    </>
  );
};
