import { EventPushButton } from 'src/components/model/EventPushButton';
import { InputDates } from 'src/components/model/InputDates';
import { InputEventOverview } from 'src/components/model/InputOverview';
import { Box, Center } from '@chakra-ui/react';

export const CreateEvent = () => {
  return (
    <Box p="3">
      <InputEventOverview />
      <Box pt="4">
        <InputDates />
      </Box>
      <Center py="6">
        <EventPushButton />
      </Center>
    </Box>
  );
};
