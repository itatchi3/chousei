import { useEffect, useState } from 'react';
import { AttendanceTable } from 'src/components/EventDetail/AttendanceTable';
import { useSetRecoilState } from 'recoil';
import { eventState } from 'src/atoms/eventState';
import { Box, Flex, VStack } from '@chakra-ui/react';
import { ShareButton } from 'src/components/EventDetail/ShareButton';
import { MoveAnswerScheduleButton } from 'src/components/EventDetail/MoveAnswerScheduleButton';
import { AnswerComment } from 'src/components/EventDetail/AnswerComment';
import { EventOverview } from 'src/components/EventDetail/EventOverview';
import { CommentList } from 'src/components/EventDetail/CommentList';
import { EventDetailType } from 'src/pages/event/[id]';
import { useLiff } from 'src/liff/auth';
import { NotFriendModal } from 'src/components/EventDetail/NotFriendModal';
import { EditButton } from './EditButton';

type Props = {
  eventDetailData: EventDetailType;
};

export const EventDetail = ({ eventDetailData }: Props) => {
  const setEvent = useSetRecoilState(eventState);
  const [isCreate, setIsCreate] = useState(false);
  const { idToken, userId } = useLiff();

  useEffect(() => {
    setEvent(eventDetailData.eventData);
  }, [eventDetailData.eventData, setEvent]);

  useEffect(() => {
    if (!eventDetailData.eventData || !idToken) return;

    const updateUser = async () => {
      if (!eventDetailData.eventData || !idToken) return;
      try {
        const res = await fetch('/api/updateUser', {
          method: 'POST',
          body: JSON.stringify({ idToken, eventId: eventDetailData.eventData.id }),
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
        if (participant.isCreate) {
          setIsCreate(true);
        }
      }
    });

    const createParticipate = async () => {
      if (!eventDetailData.eventData || !idToken) return;
      try {
        const res = await fetch('/api/createParticipate', {
          method: 'POST',
          body: JSON.stringify({ idToken, eventId: eventDetailData.eventData.id }),
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
  }, [eventDetailData, idToken, userId]);

  return (
    <Box p="3">
      <Box pb="4">
        <EventOverview
          name={eventDetailData.eventData && eventDetailData.eventData.name}
          description={eventDetailData.eventData && eventDetailData.eventData.description}
        />
      </Box>
      {isCreate && (
        <Flex justifyContent="flex-end" mt="-4" mr="-2">
          <EditButton />
        </Flex>
      )}
      <Box mx="-3">
        <AttendanceTable
          event={eventDetailData.eventData}
          counts={eventDetailData.counts}
          colors={eventDetailData.colors}
        />
      </Box>
      <CommentList comments={eventDetailData.eventData && eventDetailData.eventData.comments} />
      <VStack justify="center" p="6">
        <MoveAnswerScheduleButton />
        <AnswerComment />
        <Box pt="4">
          <ShareButton />
        </Box>
      </VStack>
      <NotFriendModal />
    </Box>
  );
};
