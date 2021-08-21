import { useEffect, useState, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
// import Button from '@material-ui/core/Button';
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
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
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
      attendeeVotes: attendeeVotesObjectToArray(eventData.attendeeVotes),
      attendeeComment: attendeeCommentObjectToArray(eventData.attendeeComment),
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
    if (!event.attendeeVotes.length) {
      return;
    }
    event.attendeeVotes.map((answeredAttendee) => {
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
    if (!event.attendeeComment.length) {
      return;
    }
    event.attendeeComment.map((answeredAttendee) => {
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
    <Grid id="event" container alignItems="center" xs={12} justify="center" spacing={3}>
      <Grid container item xs={12} direction="column" justify="center" alignItems="flex-start">
        <Grid item className="guide-title">
          {event.name}
        </Grid>
        <Grid item className="guide-message">
          {event.description}
        </Grid>
      </Grid>
      <Grid container item spacing={3} direction="column" justify="center" alignItems="center">
        <Grid item container>
          <AttendanceTable />
        </Grid>
      </Grid>
      {/* <Grid container item xs={12} justify="center" alignItems="center" spacing={3}>
        <Grid container item xs={11} direction="column">
          <Grid item className="guide-title">
            出欠を入力してください
          </Grid>
        </Grid>
        <Grid
          container
          item
          xs={10}
          spacing={1}
          justify="center"
          alignItems="center"
          direction="row"
        ></Grid>
      </Grid> */}
      <Grid container item xs={12} justify="center">
        {!answerVotesFlag ? (
          <Grid item>
            <Button onClick={() => answerDates()}>時間候補を入力する</Button>
          </Grid>
        ) : (
          <Grid item>
            <Button onClick={() => answerDates()}>解答を修正する</Button>
          </Grid>
        )}
        {!answerVotesFlag ? (
          <Grid item>
            <Grid item>
              <Button onClick={onOpen}>コメントを入力する</Button>
            </Grid>
          </Grid>
        ) : (
          <Grid item>
            <Grid item>
              <Button onClick={onOpen}>コメントを修正する</Button>
            </Grid>
          </Grid>
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
        <Grid item>
          <Button onClick={() => sharedScheduleByLine()}>友達へ共有する</Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
