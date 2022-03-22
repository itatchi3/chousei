import { EventRegisterButton } from 'src/components/CreateEvent/EventRegisterButton';
import { InputPossibleDates } from 'src/components/CreateEvent/InputPossibleDates';
import { InputEventOverview } from 'src/components/CreateEvent/InputOverview';
import { Box, Center, Spinner } from '@chakra-ui/react';
import { useLiff } from 'src/liff/auth';

export const CreateEvent = () => {
  const { liff } = useLiff();
  return (
    <>
      {!liff ? (
        <Center p="8">
          <Spinner color="green.400" />
        </Center>
      ) : (
        <Box p="3">
          <InputEventOverview />
          <Box pt="4">
            <InputPossibleDates />
          </Box>
          <Center py="6">
            <EventRegisterButton />
          </Center>
        </Box>
      )}
    </>
  );
};
