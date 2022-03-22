import { useEffect, useState } from 'react';
import { AttendanceTable } from 'src/components/EventDetail/AttendanceTable';
import { useRecoilState } from 'recoil';
import { eventState, EventType } from 'src/atoms/eventState';
import { Box, Center, Flex, Spinner, VStack } from '@chakra-ui/react';
import { ShareButton } from 'src/components/EventDetail/ShareButton';
import { MoveAnswerScheduleButton } from 'src/components/EventDetail/MoveAnswerScheduleButton';
import { AnswerComment } from 'src/components/EventDetail/AnswerComment';
import { EventOverview } from 'src/components/EventDetail/EventOverview';
import { CommentList } from 'src/components/EventDetail/CommentList';
import { useLiff } from 'src/liff/auth';
import { NotFriendModal } from 'src/components/EventDetail/NotFriendModal';
import { EditButton } from './EditButton';
import { useRouter } from 'next/router';
import superjson from 'superjson';

type EventDetailType = {
  eventData: EventType;
  counts: Count[];
  colors: string[];
};

export type Count = {
  date: Date;
  positiveCount: number;
  evenCount: number;
  negativeCount: number;
};

export const EventDetail = () => {
  const [event, setEvent] = useRecoilState(eventState);
  const [isCreate, setIsCreate] = useState(false);
  const [counts, setCounts] = useState<Count[]>();
  const [colors, setColors] = useState<string[]>();
  const { idToken, userId } = useLiff();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    const func = async () => {
      const res = await fetch(`/api/getEventDetail`, {
        method: 'POST',
        body: JSON.stringify({ id }),
      });

      const json: { ok?: boolean; eventDetailData?: string; error?: string } = await res.json();
      if (json.ok) {
        if (json.eventDetailData) {
          const eventDetailData: EventDetailType = superjson.parse(json.eventDetailData);
          setEvent(eventDetailData.eventData);
          setCounts(eventDetailData.counts);
          setColors(eventDetailData.colors);
        }
      } else {
        console.error(json.error);
      }
    };
    func();
  }, [id, setEvent]);

  useEffect(() => {
    if (!event || !idToken || !userId) return;

    const updateUser = async () => {
      try {
        const res = await fetch('/api/updateUser', {
          method: 'POST',
          body: JSON.stringify({ idToken, eventId: event.id }),
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
    event.participants.map((participant) => {
      if (participant.userId === userId) {
        isCheckEvent = true;
        updateUser();
        if (participant.isCreate) {
          setIsCreate(true);
        }
      }
    });

    const createParticipate = async () => {
      try {
        const res = await fetch('/api/createParticipate', {
          method: 'POST',
          body: JSON.stringify({ idToken, eventId: event.id }),
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
  }, [event, idToken, userId]);

  return (
    <>
      {!event || !counts || !colors ? (
        <Center p="8">
          <Spinner color="green.400" />
        </Center>
      ) : (
        <Box p="3">
          <Box pb="4">
            <EventOverview name={event.name} description={event.description} />
          </Box>
          {isCreate && (
            <Flex justifyContent="flex-end" mt="-4" mr="-2">
              <EditButton />
            </Flex>
          )}
          <Box mx="-3">
            <AttendanceTable event={event} counts={counts} colors={colors} />
          </Box>
          <CommentList comments={event.comments} />
          <VStack justify="center" p="6">
            <MoveAnswerScheduleButton />
            <AnswerComment />
            <Box pt="4">
              <ShareButton colors={colors} counts={counts} />
            </Box>
          </VStack>
          <NotFriendModal />
        </Box>
      )}
    </>
  );
};
