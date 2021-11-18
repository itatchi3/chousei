import { useEffect, useState, useRef } from 'react';
import { database } from 'src/utils/firebase';
import AttendanceTable from 'src/components/model/AttendanceTable';
import { attendeeVotesObjectToArray, attendeeCommentObjectToArray } from 'src/utils/DataConvert';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import {
  eventState,
  attendeeVotesState,
  EventType,
  attendeeCommentState,
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
  const { liff, isInClient } = useLiff();
  const router = useRouter();
  const [answerVotesFlag, setAnswerVotesFlag] = useState(false);
  const [answerCommentFlag, setAnswerCommentFlag] = useState(false);
  const [event, setEvent] = useRecoilState(eventState);
  const [attendeeVotes, setAttendeeVotes] = useRecoilState(attendeeVotesState);
  const [attendeeComment, setAttendeeComment] = useRecoilState(attendeeCommentState);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [commentLoading, setCommentLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const { onCopy } = useClipboard(
    'https://liff.line.me/' + process.env.NEXT_PUBLIC_LIFF_ID + '/event/' + event.id,
  );

  const initialRef = useRef(null);

  const handleInputComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAttendeeComment((state) => ({
      ...state,
      comment: e.target.value,
    }));
  };

  const registerAttendeeComment = async () => {
    setCommentLoading(true);
    const attendeeData = {
      userId: attendeeComment.userId,
      name: attendeeComment.name,
      profileImg: attendeeComment.profileImg,
      comment: attendeeComment.comment,
    };
    await database
      .ref(`events/${event.id}/attendeeComment/${attendeeData.userId}`)
      .set(attendeeData);
    location.reload();
  };

  useEffect(() => {
    setEvent({
      id: eventId,
      name: eventData.name,
      description: eventData.description,
      candidateDates: eventData.candidateDates,
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
        {!answerCommentFlag ? (
          <Box>
            <Box>
              <Button
                sx={{
                  WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                  _focus: { boxShadow: 'none' },
                }}
                onClick={onOpen}
              >
                コメントを入力する
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box>
              <Button
                sx={{
                  WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                  _focus: { boxShadow: 'none' },
                }}
                onClick={onOpen}
              >
                コメントを修正する
              </Button>
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
              <Button
                sx={{
                  WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                  _focus: { boxShadow: 'none' },
                }}
                colorScheme="blue"
                mr={3}
                onClick={registerAttendeeComment}
                isLoading={commentLoading}
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
        <Box pt="4">
          {isInClient ? (
            <Button
              sx={{ WebkitTapHighlightColor: 'rgba(0,0,0,0)', _focus: { boxShadow: 'none' } }}
              bg="green.300"
              onClick={() => sharedScheduleByLine()}
              disabled={!isInClient}
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
                  <Flex mb="2" px="4" py="2">
                    <Input
                      value={
                        'https://liff.line.me/' +
                        process.env.NEXT_PUBLIC_LIFF_ID +
                        '/event/' +
                        event.id
                      }
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
        </Box>
      </VStack>
    </Box>
  );
};
