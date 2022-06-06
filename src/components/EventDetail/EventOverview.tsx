import { Box, Heading } from '@chakra-ui/react';
import { useEventDetailQuery } from 'src/hooks/useEventDetail';

export const EventOverview = () => {
  const { data: eventDetail } = useEventDetailQuery();
  return eventDetail ? (
    <>
      <Heading>{eventDetail.event.name}</Heading>
      <Box px="1" pt="2">
        {eventDetail.event.description}
      </Box>
    </>
  ) : null;
};
