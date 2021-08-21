import { useEffect, useState, useRef } from 'react';
import { database } from 'src/utils/firebase';
import AttendanceTable from 'src/components/EventDetail/AttendanceTable';
import { attendeeVotesObjectToArray, attendeeCommentObjectToArray } from 'src/utils/DataConvert';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import {
  eventState,
  attendeeVotesState,
  EventType,
  attendeeCommentState,
} from 'src/atoms/eventState';
import { useAuth } from 'src/hooks/auth';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Button,
  Textarea,
  Box,
  Heading,
  VStack,
} from '@chakra-ui/react';

type Props = {
  eventId: string;
  eventData: EventType;
};

export const EventDetail = ({ eventId, eventData }: Props) => {
  const { liff } = useAuth();
  const router = useRouter();
  const [answerVotesFlag, setAnswerVotesFlag] = useState(false);
  const [answerCommentFlag, setAnswerCommentFlag] = useState(false);
  const [event, setEvent] = useRecoilState(eventState);
  const [attendeeVotes, setAttendeeVotes] = useRecoilState(attendeeVotesState);
  const [attendeeComment, setAttendeeComment] = useRecoilState(attendeeCommentState);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);

  const handleInputComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAttendeeComment((state) => ({
      ...state,
      comment: e.target.value,
    }));
  };

  const registerAttendeeComment = async () => {
    //出欠情報登録機能
    const attendeeData = {
      userId: attendeeComment.userId,
      name: attendeeComment.name,
      profileImg: attendeeComment.profileImg,
      comment: attendeeComment.comment,
    };
    // 出欠情報をRealTimeDatabaseに登録
    await database
      .ref(`events/${event.eventId}/attendeeComment/${attendeeData.userId}`)
      .set(attendeeData);
    location.reload();
  };

  useEffect(() => {
    setEvent({
      eventId: eventId,
      name: eventData.name,
      description: eventData.description,
      dates: eventData.dates,
      times: eventData.times,
      prospectiveDates: eventData.prospectiveDates,
      attendeeVotes:
        eventData.attendeeVotes !== undefined
          ? attendeeVotesObjectToArray(eventData.attendeeVotes)
          : undefined,
      attendeeComment:
        eventData.attendeeComment !== undefined
          ? attendeeCommentObjectToArray(eventData.attendeeComment)
          : undefined,
    });
    const getProfile = async () => {
      const profile = await liff!.getProfile();
      let profileImg: string;
      if (profile.pictureUrl) {
        profileImg = profile.pictureUrl;
      } else {
        profileImg = '';
      }

      setAttendeeVotes((state) => ({
        ...state,
        name: profile.displayName,
        userId: profile.userId,
        profileImg: profileImg,
      }));
      setAttendeeComment((state) => ({
        ...state,
        name: profile.displayName,
        userId: profile.userId,
        profileImg: profileImg,
      }));
    };
    getProfile();
  }, [eventData, setEvent, eventId, liff, setAttendeeVotes, setAttendeeComment]);

  useEffect(() => {
    if (event.attendeeVotes === undefined) {
      return;
    }
    event.attendeeVotes!.map((answeredAttendee) => {
      if (answeredAttendee.userId === attendeeVotes.userId) {
        setAnswerVotesFlag(true);
        setAttendeeVotes((state) => ({
          ...state,
          votes: answeredAttendee.votes,
        }));
      }
    });
  }, [attendeeVotes.userId, event.attendeeVotes, setAttendeeVotes]);

  useEffect(() => {
    if (event.attendeeComment === undefined) {
      return;
    }
    event.attendeeComment!.map((answeredAttendee) => {
      if (answeredAttendee.userId === attendeeComment.userId) {
        setAnswerCommentFlag(true);
        setAttendeeComment((state) => ({
          ...state,
          comment: answeredAttendee.comment,
        }));
      }
    });
  }, [attendeeComment.userId, event.attendeeComment, setAttendeeComment]);

  // Lineで友達にイベントリンクを共有
  const sharedScheduleByLine = () => {
    if (liff!.isApiAvailable('shareTargetPicker')) {
      liff!.shareTargetPicker([
        {
          type: 'text',
          text:
            '【イベント名】\n' +
            event.name +
            '\n' +
            '【概要】\n' +
            event.description +
            '\n' +
            'https://liff.line.me/1656098585-v7VEeZ7Q/event/' +
            eventId,
        },
      ]);
    }
  };

  //時間候補入力へ移動
  const answerDates = () => {
    router.push({
      pathname: `/event/${eventId}/input`,
    });
  };

  return (
    <Box p="3">
      <Box>
        <Heading>{event.name}</Heading>
        <Box p="2">{event.description}</Box>
      </Box>
      <Box pt="4">
        <Box>
          <AttendanceTable />
        </Box>
      </Box>
      <VStack justify="center" p="6">
        {!answerVotesFlag ? (
          <Box>
            <Button w="44" onClick={() => answerDates()}>
              予定を入力する
            </Button>
          </Box>
        ) : (
          <Box>
            <Button w="44" onClick={() => answerDates()}>
              予定を修正する
            </Button>
          </Box>
        )}
        {!answerCommentFlag ? (
          <Box>
            <Box>
              <Button onClick={onOpen}>コメントを入力する</Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box>
              <Button onClick={onOpen}>コメントを修正する</Button>
            </Box>
          </Box>
        )}

        <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} size="xs">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>コメントを入力してください</ModalHeader>
            <ModalBody>
              <Textarea
                value={attendeeComment.comment}
                onChange={handleInputComment}
                ref={initialRef}
                rows={6}
              />
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={registerAttendeeComment}>
                保存
              </Button>
              <Button onClick={onClose}>閉じる</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Box pt="4">
          <Button bg="green.300" onClick={() => sharedScheduleByLine()}>
            友達へ共有する
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};
