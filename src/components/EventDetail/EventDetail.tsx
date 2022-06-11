import { useEffect, useState } from 'react';
import { AttendanceTable } from 'src/components/EventDetail/AttendanceTable';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { eventIdState, tableWidthState } from 'src/atoms/eventState';
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
import { useEventDetailQuery } from 'src/hooks/useEventDetail';
import DefaultErrorPage from 'next/error';

export const EventDetail = () => {
  const tableWidth = useRecoilValue(tableWidthState);
  const [isCreate, setIsCreate] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);
  const { idToken, userId } = useLiff();
  const router = useRouter();
  const id = typeof router.query?.id === 'string' ? router.query.id : '';
  const setEventIdState = useSetRecoilState(eventIdState);
  setEventIdState(id);
  const { data: eventDetail, isError } = useEventDetailQuery(id);

  useEffect(() => {
    if (!eventDetail || !idToken || !userId) return;
    // TODO: updateUserが2回呼ばれるので、どうにかする
    const updateUser = async () => {
      try {
        const res = await fetch('/api/updateUser', {
          method: 'POST',
          body: JSON.stringify({ idToken, eventId: eventDetail.event.id }),
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
    eventDetail.event.participants.map((participant) => {
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
          body: JSON.stringify({ idToken, eventId: eventDetail.event.id }),
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
  }, [eventDetail, idToken, userId]);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    window.addEventListener('resize', () => {
      setWindowHeight(window.innerHeight);
    });
    return () => {
      window.removeEventListener('resize', () => {
        setWindowHeight(window.innerHeight);
      });
    };
  }, []);

  if (isError) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <>
      {!eventDetail ? (
        <Center p="8">
          <Spinner color="green.400" />
        </Center>
      ) : (
        <Box
          overflow="scroll"
          h={windowHeight}
          w="100vw"
          sx={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <Box p="3">
            <Box w={tableWidth + 12}>
              <Box w="calc(100vw - 24px)" position="sticky" left="3">
                <Box pb="4">
                  <EventOverview />
                </Box>
                {isCreate && (
                  <Flex justifyContent="flex-end" mt="-4" mr="-3">
                    <EditButton />
                  </Flex>
                )}
              </Box>
            </Box>
            <AttendanceTable />
            <Box w={tableWidth + 12}>
              <Box w="calc(100vw - 24px)" position="sticky" left="3">
                <CommentList />
                <VStack justify="center" p="6">
                  <MoveAnswerScheduleButton />
                  <AnswerComment />
                  <Box pt="4">
                    <ShareButton />
                  </Box>
                </VStack>
              </Box>
            </Box>
            <NotFriendModal />
          </Box>
        </Box>
      )}
    </>
  );
};
