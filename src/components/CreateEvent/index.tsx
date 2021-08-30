import { EventPush } from 'src/components/CreateEvent/EventPush';
import { InputTimeInterval } from 'src/components/CreateEvent/InputTimeInterval';
import { InputTimeWidth } from 'src/components/CreateEvent/InputTimeWidth';
import { InputDates } from 'src/components/CreateEvent/InputDates';
import { InputEventOverview } from 'src/components/CreateEvent/InputOverview';
import { Box } from '@chakra-ui/react';

export const CreateEvent = () => {
  return (
    <Box p="3">
      <InputEventOverview />
      <InputDates />
      <EventPush />
    </Box>
  );
};
