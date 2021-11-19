import { useRecoilValue } from 'recoil';
import { eventState } from 'src/atoms/eventState';
import { Box, Heading } from '@chakra-ui/react';

export const EventOverView = () => {
  const event = useRecoilValue(eventState);
  return (
    <>
      <Heading>{event.name}</Heading>
      <Box px="1" pt="2">
        {event.description}
      </Box>
    </>
  );
};
