import { useRecoilState } from 'recoil';
import { overViewState } from 'src/atoms/eventState';
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';

export const InputEventDiscription = () => {
  const [event, setEvent] = useRecoilState(overViewState);

  const changeDescription = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEvent((state) => ({
      ...state,
      description: evt.target.value,
    }));
  };
  return (
    <FormControl
      px="3"
      py="2"
      borderWidth="2px"
      borderRadius="lg"
      isInvalid={event.description.length > 255}
    >
      <Box py="1">
        <FormLabel fontWeight="bold" fontSize="sm">
          補足・備考
        </FormLabel>
      </Box>
      <Textarea
        isInvalid={event.description.length > 255}
        onChange={changeDescription}
        value={event.description}
        rows={4}
      />

      {event.description.length <= 255 ? (
        <FormHelperText fontSize="xs">〆切は○日など</FormHelperText>
      ) : (
        <FormErrorMessage fontSize="xs">255文字以内にしてください</FormErrorMessage>
      )}
    </FormControl>
  );
};
