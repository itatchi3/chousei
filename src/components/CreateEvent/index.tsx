import { EventPush } from 'src/components/CreateEvent/EventPush';
import { InputDates } from 'src/components/CreateEvent/InputDates';
import { InputEventOverview } from 'src/components/CreateEvent/InputOverview';
import { Box } from '@chakra-ui/react';
import { useLiff } from 'src/hooks/auth';
import { NotClient } from '../NotClient';

export const CreateEvent = () => {
  const { isInClient } = useLiff();
  return (
    <Box p="3">
      {!isInClient && (
        <Box pb="6">
          <NotClient />
        </Box>
      )}
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
