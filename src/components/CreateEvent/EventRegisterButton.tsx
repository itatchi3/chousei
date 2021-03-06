import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  possibleDateState,
  EditingTimeWidth,
  isValidateDateState,
  isValidateTimeArrayState,
  eventIdState,
} from 'src/atoms/eventState';
import { useLiff } from 'src/liff/auth';
import { useRecoilValue } from 'recoil';
import { overViewState } from 'src/atoms/eventState';
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
} from '@chakra-ui/react';
import superjson from 'superjson';
import { useEventDetailQuery } from 'src/hooks/useEventDetail';

type SortedPossibleDate = {
  date: Date;
  dateString: string;
  timeWidth: EditingTimeWidth[];
};

type RegisterPossibleDate = {
  index: number;
  date: Date;
  dateString: string;
  startTime: Date;
  endTime: Date;
  timeWidthString: string;
};

export const EventRegisterButton = () => {
  const { liff, isInClient, idToken } = useLiff();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const possibleDates = useRecoilValue(possibleDateState);
  const [sortedPossibleDates, setSortedPossibleDates] = useState<SortedPossibleDate[]>();
  const [registerPossibleDates, setRegisterPossibleDates] = useState<RegisterPossibleDate[]>();
  const overView = useRecoilValue(overViewState);
  const isValidateDate = useRecoilValue(isValidateDateState);
  const isValidateTimeArray = useRecoilValue(isValidateTimeArrayState);
  const id = useRecoilValue(eventIdState);
  const { data: eventDetail } = useEventDetailQuery(id);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dayOfWeekStr = ['日', '月', '火', '水', '木', '金', '土'];

  const formatEvent = () => {
    const addedStringTimeWidthPossibleDates: SortedPossibleDate[] = [];
    possibleDates.map((possibleDate) => {
      let stringTimeWidth: EditingTimeWidth[] = [];
      possibleDate.timeWidth.map((timeWidth) => {
        stringTimeWidth.push({
          ...timeWidth,
          stringTimeWidth: timeWidth.start + '~' + timeWidth.end,
        });
      });

      possibleDate.date.map((date) => {
        addedStringTimeWidthPossibleDates.push({
          date: date,
          dateString:
            date.getMonth() + 1 + '/' + date.getDate() + '(' + dayOfWeekStr[date.getDay()] + ')',
          timeWidth: stringTimeWidth,
        });
      });
    });

    const sortedPossibleDates: SortedPossibleDate[] = [];
    const pushedDate: number[] = [];
    addedStringTimeWidthPossibleDates.map((possibleDate) => {
      const filteredDates = addedStringTimeWidthPossibleDates.filter(
        (n) => n.date.getTime() === possibleDate.date.getTime(),
      );
      if (filteredDates.length > 1) {
        if (!pushedDate.includes(possibleDate.date.getTime())) {
          let newTimeWidth: EditingTimeWidth[] = [];
          filteredDates.map((filteredDate) => {
            newTimeWidth = [...newTimeWidth, ...filteredDate.timeWidth];
          });
          sortedPossibleDates.push({ ...possibleDate, timeWidth: newTimeWidth });
          pushedDate.push(possibleDate.date.getTime());
        }
      } else {
        sortedPossibleDates.push(possibleDate);
      }
    });

    sortedPossibleDates.sort((a, b) => a.date.getTime() - b.date.getTime());
    sortedPossibleDates.map((possibleDate) => {
      let sortTimeWidth: EditingTimeWidth[] = [];
      let filterTimeWidth: string[] = [];
      possibleDate.timeWidth.filter((e) => {
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
      possibleDate.timeWidth = sortTimeWidth;
    });
    setSortedPossibleDates(sortedPossibleDates);

    let count = 0;
    let registerPossibleDates: RegisterPossibleDate[] = [];
    sortedPossibleDates.map((possibleDate) => {
      const date = possibleDate.date;
      possibleDate.timeWidth.map((timeWidth) => {
        const [startHour, startMinute] = timeWidth.start.split(':');
        const start = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          Number(startHour),
          Number(startMinute),
        );
        const [endHour, endMinute] = timeWidth.end.split(':');
        const end = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          Number(endHour),
          Number(endMinute),
        );
        if (timeWidth.stringTimeWidth) {
          registerPossibleDates.push({
            index: count,
            date: date,
            dateString: possibleDate.dateString,
            startTime: start,
            endTime: end,
            timeWidthString: timeWidth.stringTimeWidth,
          });
          count += 1;
        }
      });
    });
    setRegisterPossibleDates(registerPossibleDates);

    onOpen();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!liff) return;

    try {
      const body = {
        name: overView.eventName,
        description: overView.description,
        registerPossibleDates: registerPossibleDates,
        idToken: idToken,
      };
      const res = await fetch(`/api/createEvent`, {
        method: 'POST',
        body: superjson.stringify(body),
      });

      const json: { ok?: boolean; id?: string; error?: string } = await res.json();
      if (json.ok) {
        if (isInClient) {
          await liff.sendMessages([
            {
              type: 'text',
              text: 'イベントが完成したよ！',
            },
            {
              type: 'text',
              text:
                '【イベント名】\n' +
                overView.eventName +
                '\n' +
                '【補足・備考】\n' +
                overView.description +
                '\n' +
                'https://liff.line.me/' +
                process.env.NEXT_PUBLIC_LIFF_ID +
                '/event/' +
                json.id,
            },
          ]);
          liff.closeWindow();
        } else {
          router.push(`/event/${json.id}`);
        }
      } else {
        throw new Error(json.error);
      }
    } catch (error) {
      alert(error);
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    if (!liff || !eventDetail) return;

    try {
      const body = {
        name: overView.eventName,
        description: overView.description,
        registerPossibleDates: registerPossibleDates,
        eventId: eventDetail.event.id,
      };
      const res = await fetch(`/api/updateEvent`, {
        method: 'POST',
        body: superjson.stringify(body),
      });

      const json: { ok?: boolean; error?: string } = await res.json();
      if (json.ok) {
        if (isInClient) {
          await liff.sendMessages([
            {
              type: 'text',
              text: 'イベントを編集したよ！',
            },
            {
              type: 'text',
              text:
                '【イベント名】\n' +
                overView.eventName +
                '\n' +
                '【補足・備考】\n' +
                overView.description +
                '\n' +
                'https://liff.line.me/' +
                process.env.NEXT_PUBLIC_LIFF_ID +
                '/event/' +
                eventDetail.event.id,
            },
          ]);
          liff.closeWindow();
        } else {
          router.push(`/event/${eventDetail.event.id}`);
        }
      } else {
        throw new Error(json.error);
      }
    } catch (error) {
      alert(error);
      setIsLoading(false);
    }
  };
  return (
    <>
      <Button
        bg="green.300"
        onClick={formatEvent}
        isDisabled={
          isValidateDate ||
          isValidateTimeArray.includes(true) ||
          overView.eventName === '' ||
          overView.eventName.length > 255 ||
          overView.description.length > 255
        }
      >
        {!eventDetail ? 'イベントを作成する' : 'イベントを編集する'}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="xs" scrollBehavior={'inside'}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>内容を確認してください</ModalHeader>
          <ModalBody pt="0" px="50px" mb="4" fontSize="lg">
            <Box fontWeight="bold">イベント名</Box>
            <Box pl="2" pb="4">
              {overView.eventName}
            </Box>
            <Box fontWeight="bold">補足・備考</Box>
            <Box pl="2" pb="4">
              {overView.description}
            </Box>
            <Box fontWeight="bold">候補時間</Box>
            {sortedPossibleDates?.map((sortedPossibleDate, i) => (
              <Box key={i} pb="2">
                <Box pl="2">{sortedPossibleDate.dateString}</Box>
                {sortedPossibleDate.timeWidth.map((timeWidth, j) => (
                  <Box key={j} textAlign="center">
                    {timeWidth.stringTimeWidth}
                  </Box>
                ))}
              </Box>
            ))}
          </ModalBody>
          <ModalFooter pt="0">
            <Center>
              <HStack>
                {!eventDetail ? (
                  <Button colorScheme="blue" onClick={() => handleSubmit()} isLoading={isLoading}>
                    確認
                  </Button>
                ) : (
                  <Button colorScheme="blue" onClick={() => handleUpdate()} isLoading={isLoading}>
                    確認
                  </Button>
                )}
              </HStack>
            </Center>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
