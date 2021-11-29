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
import { AttendanceTableData } from 'src/pages/event/[id]';

type Props = {
  attendanceTableData: AttendanceTableData;
};

export const EventDetail = ({ attendanceTableData }: Props) => {
  const [event, setEvent] = useRecoilState(eventState);

  useEffect(() => {
    setEvent(attendanceTableData.eventData);
  }, [attendanceTableData.eventData, setEvent]);

  return (
    <Box p="3">
      <EventOverView
        name={attendanceTableData.eventData && attendanceTableData.eventData.name}
        description={attendanceTableData.eventData && attendanceTableData.eventData.description}
      />
      <Box pt="4">
        <AttendanceTable attendanceTableData={attendanceTableData} />
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
