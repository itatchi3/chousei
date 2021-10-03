import { EventPush } from 'src/components/CreateEvent/EventPush';
import { InputDates } from 'src/components/CreateEvent/InputDates';
import { InputEventOverview } from 'src/components/CreateEvent/InputOverview';
import { Box } from '@chakra-ui/react';

export const CreateEvent = () => {
  return (
    <Box p="3">
      <InputEventOverview />
      <Box pt="4">
        <InputDates />
      </Box>
      <Box p="6">
        <EventPush />
      </Box>
    </Box>
  );
};
