import { useEffect, useState } from 'react';
import { AttendanceTable } from 'src/components/EventDetail/AttendanceTable';
import { useSetRecoilState } from 'recoil';
import { eventState } from 'src/atoms/eventState';
import {
  Box,
  Button,
  Flex,
  Image,
  Link,
  ModalFooter,
  VStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
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
  const { liff, idToken, userId } = useLiff();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setEvent(eventDetailData.eventData);
  }, [eventDetailData.eventData, setEvent]);

  useEffect(() => {
    if (!eventDetailData.eventData || !idToken) return;

    const updateUser = async () => {
      if (!idToken) return;
      try {
        const res = await fetch('/api/updateUser', {
          method: 'POST',
          body: JSON.stringify({ idToken }),
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

  useEffect(() => {
    if (!liff) return;
    const func = async () => {
      try {
        const friendFlag = await liff.getFriendship();
        setIsOpen(!friendFlag.friendFlag);
      } catch (e) {
        console.error(e);
      }
    };
    func();
  }, [liff]);

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
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>おすすめ</ModalHeader>
          <ModalBody>
            <Box fontWeight="bold">
              チョーセイ公式アカウントと友だちになると、イベントが作成できるようになります。
            </Box>
            <Flex direction="column" alignItems="center" pt="7">
              <Image borderRadius="full" src="/chouseiIcon.PNG" alt="アイコン" width="80px" />
              <Box fontWeight="bold" pt="2" pb="5">
                チョーセイ
              </Box>

              <Link href="https://lin.ee/InOsTpg" sx={{ _focus: { outline: 'none !important' } }}>
                <Image
                  src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png"
                  alt="友だち追加"
                  width="140px"
                />
              </Link>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              キャンセル
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
