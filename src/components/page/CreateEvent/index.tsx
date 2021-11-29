import { EventRegisterButton } from 'src/components/model/EventRegisterButton';
import { InputPossibleDates } from 'src/components/model/InputPossibleDates';
import { InputEventOverview } from 'src/components/model/InputOverview';
import { Box, Center } from '@chakra-ui/react';

export const CreateEvent = () => {
  return (
    <Box p="3">
      <InputEventOverview />
      <Box pt="4">
        <InputPossibleDates />
      </Box>
      <Center py="6">
        <EventRegisterButton />
      </Center>
    </Box>
  );
};
