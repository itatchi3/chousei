import { useRecoilState } from 'recoil';
import { overViewState } from 'src/atoms/eventState';
import { Box, FormControl, FormHelperText, FormLabel, Input } from '@chakra-ui/react';

export const InputEventName = () => {
  const [event, setEvent] = useRecoilState(overViewState);

  const changeEventname = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setEvent((state) => ({
      ...state,
      eventName: evt.target.value,
    }));
  };
  return (
    <FormControl px="3" py="2" borderWidth="2px" borderRadius="lg" isRequired>
      <Box py="1">
        <FormLabel fontWeight="bold" fontSize="sm">
          イベント名
        </FormLabel>
      </Box>
      <Input onChange={changeEventname} value={event.eventName} />
      <FormHelperText fontSize="xs">ミーティング、練習日程、シフト調整など</FormHelperText>
    </FormControl>
  );
};
