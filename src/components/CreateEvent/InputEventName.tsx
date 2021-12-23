import { useRecoilState } from 'recoil';
import { overViewState } from 'src/atoms/eventState';
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from '@chakra-ui/react';

export const InputEventName = () => {
  const [event, setEvent] = useRecoilState(overViewState);

  const changeEventname = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setEvent((state) => ({
      ...state,
      eventName: evt.target.value,
    }));
  };
  return (
    <FormControl
      px="3"
      py="2"
      borderWidth="2px"
      borderRadius="lg"
      isRequired
      isInvalid={event.eventName.length > 255}
    >
      <Box py="1">
        <FormLabel fontWeight="bold" fontSize="sm">
          イベント名
        </FormLabel>
      </Box>
      <Input
        isInvalid={event.eventName.length > 255}
        onChange={changeEventname}
        value={event.eventName}
      />

      {event.eventName.length <= 255 ? (
        <FormHelperText fontSize="xs">ミーティング、練習日程、シフト調整など</FormHelperText>
      ) : (
        <FormErrorMessage fontSize="xs">255文字以内にしてください</FormErrorMessage>
      )}
    </FormControl>
  );
};
