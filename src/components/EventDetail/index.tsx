import { useEffect } from 'react';
import { AttendanceTable } from 'src/components/EventDetail/AttendanceTable';
import { useRecoilState } from 'recoil';
import { eventState } from 'src/atoms/eventState';
import { Box, VStack } from '@chakra-ui/react';
import { ShareButton } from 'src/components/EventDetail/ShareButton';
import { MoveAnswerScheduleButton } from 'src/components/EventDetail/MoveAnswerScheduleButton';
import { AnswerComment } from 'src/components/EventDetail/AnswerComment';
import { EventOverView } from 'src/components/EventDetail/EventOverView';
import { CommentList } from 'src/components/EventDetail/CommentList';
import { EventDetailType } from 'src/pages/event/[id]';
import { useLiff } from 'src/liff/auth';

type Props = {
  eventDetailData: EventDetailType;
};

export const EventDetail = ({ eventDetailData }: Props) => {
  const [event, setEvent] = useRecoilState(eventState);
  const { idToken, userId } = useLiff();

  useEffect(() => {
    setEvent(eventDetailData.eventData);
  }, [eventDetailData.eventData, setEvent]);

  useEffect(() => {
    if (!eventDetailData.eventData || !idToken) return;

    const updateUser = async () => {
      if (!idToken) return;
      try {
        await fetch('/api/updateUser', {
          method: 'POST',
          body: JSON.stringify({ idToken }),
        });
      } catch (error) {
        alert(error);
      }
    };

    let isCheckEvent = false;
    eventDetailData.eventData.participants.map((participant) => {
      if (participant.userId === userId) {
        isCheckEvent = true;
        updateUser();
      }
    });

    const createParticipate = async () => {
      if (!eventDetailData.eventData || !idToken) return;
      try {
        await fetch('/api/createParticipate', {
          method: 'POST',
          body: JSON.stringify({ idToken, eventId: eventDetailData.eventData.id }),
        });
      } catch (error) {
        alert(error);
      }
    };

    if (!isCheckEvent) {
      createParticipate();
    }
  }, [eventDetailData, idToken, userId]);

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
