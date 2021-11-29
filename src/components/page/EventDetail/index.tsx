import { useEffect } from 'react';
import { AttendanceTable } from 'src/components/model/AttendanceTable';
import { useRecoilState } from 'recoil';
import { eventState } from 'src/atoms/eventState';
import { Box, VStack } from '@chakra-ui/react';
import { ShareButton } from 'src/components/model/ShareButton';
import { MoveAnswerScheduleButton } from 'src/components/model/MoveAnswerScheduleButton';
import { AnswerComment } from 'src/components/model/AnswerComment';
import { EventOverView } from 'src/components/model/EventOverView';
import { CommentList } from 'src/components/model/CommentList';
import { EventDetailType } from 'src/pages/event/[id]';

type Props = {
  eventDetailData: EventDetailType;
};

export const EventDetail = ({ eventDetailData }: Props) => {
  const [event, setEvent] = useRecoilState(eventState);

  useEffect(() => {
    setEvent(eventDetailData.eventData);
  }, [eventDetailData.eventData, setEvent]);

  return (
    <Box p="3">
      <EventOverView
        name={eventDetailData.eventData && eventDetailData.eventData.name}
        description={eventDetailData.eventData && eventDetailData.eventData.description}
      />
      <Box pt="4">
        <AttendanceTable
          event={eventDetailData.eventData}
          counts={eventDetailData.counts}
          colors={eventDetailData.colors}
        />
        <CommentList comments={eventDetailData.eventData && eventDetailData.eventData.comments} />
      </Box>
      <VStack justify="center" p="6">
        <MoveAnswerScheduleButton />
        <AnswerComment />
        <Box pt="4">
          <ShareButton />
        </Box>
      </VStack>
    </Box>
  );
};
