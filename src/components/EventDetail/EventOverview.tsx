import { Box, Heading } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { eventIdState } from 'src/atoms/eventState';
import { useEventDetailQuery } from 'src/hooks/useEventDetail';

export const EventOverview = () => {
  const id = useRecoilValue(eventIdState);
  const { data: eventDetail } = useEventDetailQuery(id);
  return eventDetail ? (
    <>
      <Heading>{eventDetail.event.name}</Heading>
      <Box px="1" pt="2">
        {eventDetail.event.description}
      </Box>
    </>
  ) : null;
};
