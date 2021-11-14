import { useState } from 'react';
import {
  candidateDateState,
  TimeWidth,
  EditingTimeWidth,
  isValidateState,
} from 'src/atoms/eventState';
import { database } from 'src/utils/firebase';
import { useAuth } from 'src/hooks/auth';
import { useRecoilValue } from 'recoil';
import { editingEventState } from 'src/atoms/eventState';
import {
  Box,
  Center,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  HStack,
  ModalCloseButton,
  VStack,
} from '@chakra-ui/react';

type SortedCandidateDate = {
  date: Date;
  timeWidth: EditingTimeWidth[];
};

type RegisterCandidateDate = {
  date: number;
  timeWidth: TimeWidth;
};

export const EventPush = () => {
  const { liff } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const candidateDates = useRecoilValue(candidateDateState);
  const [registerCandidateDates, setRegisterCandidateDates] = useState<RegisterCandidateDate[]>();
  const [sortedCandidateDates, setSortedCandidateDates] = useState<SortedCandidateDate[]>();
  const event = useRecoilValue(editingEventState);
  const isValidate = useRecoilValue(isValidateState);
  const [isLoading, setIsLoading] = useState(false);

  const registerEvent = () => {
    const addedStringTimeWidthCandidateDates: SortedCandidateDate[] = [];
    candidateDates.map((candidateDate) => {
      let stringTimeWidth: EditingTimeWidth[] = [];
      candidateDate.timeWidth.map((timeWidth) => {
        stringTimeWidth.push({
          ...timeWidth,
          stringTimeWidth: timeWidth.start + '~' + timeWidth.end,
        });
      });

      candidateDate.date.map((date) => {
        addedStringTimeWidthCandidateDates.push({
          date: date,
          timeWidth: stringTimeWidth,
        });
      });
    });

    const sortedCandidateDates: SortedCandidateDate[] = [];
    const pushedDate: number[] = [];
    addedStringTimeWidthCandidateDates.map((candidateDate) => {
      const filteredDates = addedStringTimeWidthCandidateDates.filter(
        (n) => n.date.getTime() === candidateDate.date.getTime(),
      );
      if (filteredDates.length > 1) {
        if (!pushedDate.includes(candidateDate.date.getTime())) {
          let newTimeWidth: EditingTimeWidth[] = [];
          filteredDates.map((filteredDate) => {
            newTimeWidth = [...newTimeWidth, ...filteredDate.timeWidth];
          });
          sortedCandidateDates.push({ date: candidateDate.date, timeWidth: newTimeWidth });
          pushedDate.push(candidateDate.date.getTime());
        }
      } else {
        sortedCandidateDates.push(candidateDate);
      }
    });

    sortedCandidateDates.sort((a, b) => a.date.getTime() - b.date.getTime());
    sortedCandidateDates.map((candidateDate) => {
      let sortTimeWidth: EditingTimeWidth[] = [];
      let filterTimeWidth: string[] = [];
      candidateDate.timeWidth.filter((e) => {
        if (e.stringTimeWidth === undefined) return;
        if (filterTimeWidth.indexOf(e.stringTimeWidth) === -1) {
          filterTimeWidth.push(e.stringTimeWidth);
          sortTimeWidth.push(e);
        }
      });

      sortTimeWidth.sort((a, b) => {
        if (a.start > b.start) return 1;
        if (a.start < b.start) return -1;
        if (a.end > b.end) return 1;
        if (a.end < b.end) return -1;
        return 0;
      });
      candidateDate.timeWidth = sortTimeWidth;
    });
    setSortedCandidateDates(sortedCandidateDates);

    let registerCandidateDate: RegisterCandidateDate[] = [];
    sortedCandidateDates.map((candidateDate) => {
      candidateDate.timeWidth.map((timeWidth) => {
        const [startHour, startMinute] = timeWidth.start.split(':');
        const start = new Date(
          candidateDate.date.getFullYear(),
          candidateDate.date.getMonth(),
          candidateDate.date.getDate(),
          Number(startHour),
          Number(startMinute),
        );
        const [endHour, endMinute] = timeWidth.end.split(':');
        const end = new Date(
          candidateDate.date.getFullYear(),
          candidateDate.date.getMonth(),
          candidateDate.date.getDate(),
          Number(endHour),
          Number(endMinute),
        );
        if (timeWidth.stringTimeWidth) {
          registerCandidateDate.push({
            date: candidateDate.date.getTime(),
            timeWidth: {
              start: start.getTime(),
              end: end.getTime(),
              stringTimeWidth: timeWidth.stringTimeWidth,
            },
          });
        }
      });
    });
    setRegisterCandidateDates(registerCandidateDate);
    onOpen();
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    const eventPush = await database.ref('events').push({
      name: event.eventName,
      description: event.description,
      candidateDates: registerCandidateDates,
    });
    const eventId = eventPush.key;
    await liff!
      .sendMessages([
        {
          type: 'text',
          text: '出欠表が完成したよ！',
        },
        {
          type: 'text',
          text:
            '【イベント名】\n' +
            event.eventName +
            '\n' +
            '【補足・備考】\n' +
            event.description +
            '\n' +
            'https://liff.line.me/' +
            process.env.NEXT_PUBLIC_LIFF_ID +
            '/event/' +
            eventId,
        },
      ])
      .then(() => {
        console.log('message sent');
      })
      .catch((err) => {
        console.log('error', err);
        alert(err);
      });
    // liffアプリを閉じる
    liff!.closeWindow();
  };

  console.log(isValidate);

  return (
    <VStack>
      <Button
        bg="green.200"
        sx={{
          WebkitTapHighlightColor: 'rgba(0,0,0,0)',
          _focus: { boxShadow: 'none' },
        }}
        onClick={() => registerEvent()}
        isDisabled={isValidate || event.eventName === ''}
      >
        イベントを作成する
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="xs" scrollBehavior={'inside'}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton
            sx={{
              WebkitTapHighlightColor: 'rgba(0,0,0,0)',
              _focus: { boxShadow: 'none' },
            }}
          />
          <ModalHeader>内容を確認してください</ModalHeader>
          <ModalBody pt="0" px="50px" mb="4" fontSize="lg">
            <Box fontWeight="bold">イベント名</Box>
            <Box pb="3">{event.eventName}</Box>
            <Box fontWeight="bold">補足・備考</Box>
            <Box pb="3">{event.description}</Box>
            <Box fontWeight="bold">候補時間</Box>
            {sortedCandidateDates?.map((sortedCandidateDate, i) => (
              <Box key={i} pb="2">
                <Box>
                  {new Date(sortedCandidateDate.date).getMonth() +
                    1 +
                    '/' +
                    new Date(sortedCandidateDate.date).getDate()}
                </Box>
                {sortedCandidateDate.timeWidth.map((timeWidth, j) => (
                  <Box key={j} pl="6">
                    {timeWidth.stringTimeWidth}
                  </Box>
                ))}
              </Box>
            ))}
          </ModalBody>
          <ModalFooter pt="0">
            <Center>
              <HStack>
                <Button
                  sx={{
                    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                    _focus: { boxShadow: 'none' },
                  }}
                  colorScheme="blue"
                  onClick={() => handleSubmit()}
                  isLoading={isLoading}
                >
                  作成
                </Button>
              </HStack>
            </Center>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
