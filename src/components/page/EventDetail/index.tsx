import { useEffect } from 'react';
import { AttendanceTable } from 'src/components/model/AttendanceTable';
import { useRecoilState } from 'recoil';
import { eventState, EventType } from 'src/atoms/eventState';
import { Box, VStack } from '@chakra-ui/react';
import { ShareButton } from 'src/components/model/ShareButton';
import { MoveAnswerScheduleButton } from 'src/components/model/MoveAnswerScheduleButton';
import { AnswerComment } from 'src/components/model/AnswerComment';
import { EventOverView } from 'src/components/model/EventOverView';
import { CommentList } from 'src/components/model/CommentList';

type Props = {
  eventData: EventType;
};

export const EventDetail = ({ eventData }: Props) => {
  const [event, setEvent] = useRecoilState(eventState);

  useEffect(() => {
    setEvent(eventData);
  }, [eventData, setEvent]);

  return (
    <Box p="3">
      <EventOverView />
      <Box pt="4">
        <AttendanceTable />
        <CommentList />
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
