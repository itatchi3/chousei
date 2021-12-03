import { EventRegisterButton } from 'src/components/CreateEvent/EventRegisterButton';
import { InputPossibleDates } from 'src/components/CreateEvent/InputPossibleDates';
import { InputEventOverview } from 'src/components/CreateEvent/InputOverview';
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
