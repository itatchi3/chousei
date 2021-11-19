import { useEffect, useState, useRef } from 'react';
import { database } from 'src/utils/firebase';
import AttendanceTable from 'src/components/model/AttendanceTable';
import {
  respondentVoteListObjectToArray,
  respondentCommentObjectToArray,
} from 'src/utils/DataConvert';
import { useRouter } from 'next/router';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  eventState,
  respondentVoteListState,
  EventType,
  respondentCommentState,
} from 'src/atoms/eventState';
import { useLiff } from 'src/hooks/auth';
import {
  Menu,
  MenuButton,
  MenuGroup,
  MenuList,
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
  Flex,
  Input,
  useClipboard,
  IconButton,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';

type Props = {
  eventId: string;
  eventData: EventType;
};

export const EventDetail = ({ eventId, eventData }: Props) => {
  const { liff } = useLiff();
  const router = useRouter();
  const [answerVoteListFlag, setAnswerVoteListFlag] = useState(false);
  const [event, setEvent] = useRecoilState(eventState);
  const [respondentVoteLists, setRespondentVoteList] = useRecoilState(respondentVoteListState);
  const [respondentComments, setRespondentComment] = useRecoilState(respondentCommentState);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const { onCopy } = useClipboard(
    'https://liff.line.me/' + process.env.NEXT_PUBLIC_LIFF_ID + '/event/' + event.id,
  );

  useEffect(() => {
    setEvent({
      id: eventId,
      name: eventData.name,
      description: eventData.description,
      candidateDates: eventData.candidateDates,
      respondentVoteLists:
        eventData.respondentVoteLists !== undefined
          ? respondentVoteListObjectToArray(eventData.respondentVoteLists)
          : undefined,
      respondentComments:
        eventData.respondentComments !== undefined
          ? respondentCommentObjectToArray(eventData.respondentComments)
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

      setRespondentVoteList((state) => ({
        ...state,
        name: profile.displayName,
        userId: profile.userId,
        profileImg: profileImg,
      }));
      setRespondentComment((state) => ({
        ...state,
        name: profile.displayName,
        userId: profile.userId,
        profileImg: profileImg,
      }));
    };
    getProfile();
  }, [eventData, setEvent, eventId, liff, setRespondentVoteList, setRespondentComment]);

  useEffect(() => {
    if (event.respondentVoteLists === undefined) {
      return;
    }
    event.respondentVoteLists!.map((answeredRespondent) => {
      if (answeredRespondent.userId === respondentVoteLists.userId) {
        setAnswerVoteListFlag(true);
        setRespondentVoteList((state) => ({
          ...state,
          voteList: answeredRespondent.voteList,
        }));
      }
    });
  }, [respondentVoteLists.userId, event.respondentVoteLists, setRespondentVoteList]);

  useEffect(() => {
    if (event.respondentComments === undefined) {
      return;
    }
    event.respondentComments!.map((answeredRespondent) => {
      setRespondentComment((state) => ({
        ...state,
        comment: answeredRespondent.comment,
      }));
    });
  }, [event.respondentComments, setRespondentComment]);

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
            'https://liff.line.me/' +
            process.env.NEXT_PUBLIC_LIFF_ID +
            '/event/' +
            event.id,
        },
      ]);
    }
  };

  //時間候補入力へ移動
  const answerDates = () => {
    setScheduleLoading(true);
    router.push({
      pathname: `/event/${event.id}/input`,
    });
  };

  return (
    <Box p="3">
      <EventOverView />
      <Box pt="4">
        <AttendanceTable />
      </Box>
      <VStack justify="center" p="6">
        {!answerVoteListFlag ? (
          <Button
            sx={{
              WebkitTapHighlightColor: 'rgba(0,0,0,0)',
              _focus: { boxShadow: 'none' },
            }}
            w="44"
            isLoading={scheduleLoading}
            onClick={() => answerDates()}
          >
            予定を入力する
          </Button>
        ) : (
          <Button
            sx={{ WebkitTapHighlightColor: 'rgba(0,0,0,0)', _focus: { boxShadow: 'none' } }}
            w="44"
            isLoading={scheduleLoading}
            onClick={() => answerDates()}
          >
            予定を修正する
          </Button>
        )}
        <AnswerComment />
        <Box pt="4">
          <ShareButton />
        </Box>
      </VStack>
    </Box>
  );
};

export const EventOverView = () => {
  const event = useRecoilValue(eventState);
  return (
    <>
      <Heading>{event.name}</Heading>
      <Box px="1" pt="2">
        {event.description}
      </Box>
    </>
  );
};

export const AnswerComment = () => {
  const event = useRecoilValue(eventState);
  const [respondentComments, setRespondentComment] = useRecoilState(respondentCommentState);
  const [isAnsweredComment, setIsAnsweredComment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

  const handleInputComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRespondentComment((state) => ({
      ...state,
      comment: e.target.value,
    }));
  };

  const registerRespondentComment = async () => {
    setIsLoading(true);
    const respondentData = {
      userId: respondentComments.userId,
      name: respondentComments.name,
      profileImg: respondentComments.profileImg,
      comment: respondentComments.comment,
    };
    await database
      .ref(`events/${event.id}/respondentComments/${respondentData.userId}`)
      .set(respondentData);
    location.reload();
  };

  useEffect(() => {
    if (event.respondentComments === undefined) {
      return;
    }
    event.respondentComments!.map((answeredRespondent) => {
      if (answeredRespondent.userId === respondentComments.userId) {
        setIsAnsweredComment(true);
      }
    });
  }, [respondentComments.userId, event.respondentComments]);
  return (
    <>
      <Button
        sx={{
          WebkitTapHighlightColor: 'rgba(0,0,0,0)',
          _focus: { boxShadow: 'none' },
        }}
        onClick={onOpen}
      >
        {isAnsweredComment ? 'コメントを修正する' : 'コメントを入力する'}
      </Button>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>コメントを入力してください</ModalHeader>
          <ModalBody>
            <Textarea
              value={respondentComments.comment}
              onChange={handleInputComment}
              ref={initialRef}
              rows={6}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              sx={{
                WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                _focus: { boxShadow: 'none' },
              }}
              colorScheme="blue"
              mr={3}
              onClick={registerRespondentComment}
              isLoading={isLoading}
            >
              保存
            </Button>
            <Button
              sx={{
                WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                _focus: { boxShadow: 'none' },
              }}
              onClick={onClose}
            >
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const ShareButton = () => {
  const event = useRecoilValue(eventState);
  const { liff, isInClient } = useLiff();
  const { onCopy } = useClipboard(
    `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/event/${event.id}`,
  );

  const shareScheduleByLine = () => {
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
            `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/event/${event.id}`,
        },
      ]);
    }
  };
  return (
    <>
      {isInClient ? (
        <Button
          sx={{ WebkitTapHighlightColor: 'rgba(0,0,0,0)', _focus: { boxShadow: 'none' } }}
          bg="green.300"
          onClick={() => shareScheduleByLine()}
        >
          友達へ共有する
        </Button>
      ) : (
        <Menu>
          <MenuButton
            as={Button}
            colorScheme="green"
            sx={{ WebkitTapHighlightColor: 'rgba(0,0,0,0)', _focus: { boxShadow: 'none' } }}
          >
            友達へ共有する
          </MenuButton>
          <MenuList Width="300px">
            <MenuGroup title="リンクを共有してください">
              <Flex px="4" py="2">
                <Input
                  value={`https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/event/${event.id}`}
                  isReadOnly
                />
                <IconButton
                  onClick={onCopy}
                  size="sm"
                  ml="2"
                  sx={{
                    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                    _focus: { boxShadow: 'none' },
                  }}
                  icon={<CopyIcon />}
                  aria-label="copy"
                />
              </Flex>
            </MenuGroup>
          </MenuList>
        </Menu>
      )}
    </>
  );
};

export const MoveInputScheduleButton = () => {
  const event = useRecoilValue(eventState);
  const [respondentVoteLists, setRespondentVoteList] = useRecoilState(respondentVoteListState);
  const [isAnsweredVoteList, setsAnsweredVoteListFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const moveInputSchedule = () => {
    setIsLoading(true);
    router.push({
      pathname: `/event/${event.id}/input`,
    });
  };

  useEffect(() => {
    if (event.respondentVoteLists === undefined) {
      return;
    }
    event.respondentVoteLists!.map((answeredRespondent) => {
      if (answeredRespondent.userId === respondentVoteLists.userId) {
        setIsLoading(true);
        setRespondentVoteList((state) => ({
          ...state,
          voteList: answeredRespondent.voteList,
        }));
      }
    });
  }, [respondentVoteLists.userId, event.respondentVoteLists, setRespondentVoteList]);
  return (
    <>
      <Button
        sx={{
          WebkitTapHighlightColor: 'rgba(0,0,0,0)',
          _focus: { boxShadow: 'none' },
        }}
        w="44"
        isLoading={isLoading}
        onClick={() => moveInputSchedule()}
      >
        {isAnsweredVoteList ? '予定を入力する' : ' 予定を修正する'}
      </Button>
    </>
  );
};
