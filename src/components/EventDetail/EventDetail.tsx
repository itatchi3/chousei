import { useEffect } from 'react';
import { AttendanceTable } from 'src/components/EventDetail/AttendanceTable';
import { useSetRecoilState } from 'recoil';
import { eventState } from 'src/atoms/eventState';
import { Box, VStack } from '@chakra-ui/react';
import { ShareButton } from 'src/components/EventDetail/ShareButton';
import { MoveAnswerScheduleButton } from 'src/components/EventDetail/MoveAnswerScheduleButton';
import { AnswerComment } from 'src/components/EventDetail/AnswerComment';
import { EventOverview } from 'src/components/EventDetail/EventOverview';
import { CommentList } from 'src/components/EventDetail/CommentList';
import { EventDetailType } from 'src/pages/event/[id]';
import { useLiff } from 'src/liff/auth';

type Props = {
  eventDetailData: EventDetailType;
};

export const EventDetail = ({ eventDetailData }: Props) => {
  const setEvent = useSetRecoilState(eventState);
  const { accessToken, userId } = useLiff();

  useEffect(() => {
    setEvent(eventDetailData.eventData);
  }, [eventDetailData.eventData, setEvent]);

  useEffect(() => {
    if (!eventDetailData.eventData || !accessToken) return;

    const updateUser = async () => {
      if (!accessToken) return;
      try {
        const res = await fetch('/api/updateUser', {
          method: 'POST',
          body: JSON.stringify({ accessToken }),
        });

        const json: { ok?: boolean; error?: string } = await res.json();
        if (!json.ok) {
          throw json.error;
        }
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
      if (!eventDetailData.eventData || !accessToken) return;
      try {
        const res = await fetch('/api/createParticipate', {
          method: 'POST',
          body: JSON.stringify({ accessToken, eventId: eventDetailData.eventData.id }),
        });

        const json: { ok?: boolean; error?: string } = await res.json();
        if (!json.ok) {
          throw json.error;
        }
      } catch (error) {
        alert(error);
      }
    };

    if (!isCheckEvent) {
      createParticipate();
    }
  }, [eventDetailData, accessToken, userId]);

  return (
    <Box p="3">
      <EventOverview
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
