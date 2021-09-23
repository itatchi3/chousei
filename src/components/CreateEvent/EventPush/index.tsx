import { useState } from 'react';
import { candidateDateState, TimeWidth, CandidateDate } from 'src/atoms/eventState';
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
  date: number;
  timeWidth: TimeWidth[];
};

export const EventPush = () => {
  // const { liff } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const candidateDates = useRecoilValue(candidateDateState);
  const [shapedCandidateDates, setShapedCandidateDates] = useState<CandidateDate[]>();
  const [sortedCandidateDates, setSortedCandidateDates] = useState<SortedCandidateDate[]>();
  const event = useRecoilValue(editingEventState);

  const registerEvent = () => {
    const candidateDates2: SortedCandidateDate[] = [];
    candidateDates.map((candidateDate) => {
      let stringTimeWidth: TimeWidth[] = [];
      candidateDate.timeWidth.map((timeWidth) => {
        stringTimeWidth.push({
          ...timeWidth,
          stringTimeWidth:
            timeWidth.fromHour +
            ':' +
            timeWidth.fromMinute +
            '~' +
            timeWidth.toHour +
            ':' +
            timeWidth.toMinute,
        });
      });

      candidateDate.date.map((date) => {
        candidateDates2.push({
          date: date.getTime(),
          timeWidth: stringTimeWidth,
        });
      });
    });

    const candidateDates3: SortedCandidateDate[] = [];
    const overTwo: number[] = [];
    candidateDates2.map((candidateDate2) => {
      const filteredDates = candidateDates2.filter((n) => n.date === candidateDate2.date);
      if (filteredDates.length > 1) {
        if (!overTwo.includes(candidateDate2.date)) {
          let newTimeWidth: TimeWidth[] = [];
          filteredDates.map((filteredDate) => {
            newTimeWidth = [...newTimeWidth, ...filteredDate.timeWidth];
          });
          candidateDates3.push({ date: candidateDate2.date, timeWidth: newTimeWidth });
          overTwo.push(candidateDate2.date);
        }
      } else {
        candidateDates3.push(candidateDate2);
      }
    });

    candidateDates3.sort((a, b) => a.date - b.date);
    candidateDates3.map((candidateDate3) => {
      let sortTimeWidth: TimeWidth[] = [];
      let filterTimeWidth: string[] = [];
      candidateDate3.timeWidth.filter((e) => {
        if (e.stringTimeWidth === undefined) return;
        if (filterTimeWidth.indexOf(e.stringTimeWidth) === -1) {
          filterTimeWidth.push(e.stringTimeWidth);
          sortTimeWidth.push(e);
        }
      });

      sortTimeWidth.sort((a, b) => {
        if (a.fromHour > b.fromHour) return 1;
        if (a.fromHour < b.fromHour) return -1;
        if (a.fromMinute > b.fromMinute) return 1;
        if (a.fromMinute < b.fromMinute) return -1;
        if (a.toHour > b.toHour) return 1;
        if (a.toHour < b.toHour) return -1;
        if (a.toMinute > b.toMinute) return 1;
        if (a.toMinute < b.toMinute) return -1;
        return 0;
      });
      candidateDate3.timeWidth = sortTimeWidth;
    });
    setSortedCandidateDates(candidateDates3);

    let candidateDates4: CandidateDate[] = [];
    candidateDates3.map((candidateDate) => {
      candidateDate.timeWidth.map((timeWidth) => {
        candidateDates4.push({ date: candidateDate.date, timeWidth: timeWidth });
      });
    });
    setShapedCandidateDates(candidateDates4);
    console.log(shapedCandidateDates);
    onOpen();
  };
  const handleSubmit = async () => {
    console.log(shapedCandidateDates);
    const eventPush = await database.ref('events').push({
      name: event.eventName,
      description: event.description,
      candidateDates: shapedCandidateDates,
    });
    const eventId = eventPush.key;
    // await liff!
    //   .sendMessages([
    //     {
    //       type: 'text',
    //       text: '出欠表が完成したよ！',
    //     },
    //     {
    //       type: 'text',
    //       text:
    //         '【イベント名】\n' +
    //         event.eventName +
    //         '\n' +
    //         '【概要】\n' +
    //         event.description +
    //         '\n' +
    //         'https://liff.line.me/1656098585-v7VEeZ7Q/event/' +
    //         eventId,
    //     },
    //   ])
    //   .then(() => {
    //     console.log('message sent');
    //   })
    //   .catch((err) => {
    //     console.log('error', err);
    //     alert(err);
    //   });
    // // liffアプリを閉じる
    // liff!.closeWindow();
    // router.push(`/event/${eventId}`);
  };

  return (
    <VStack>
      <Button bg="green.200" onClick={() => registerEvent()}>
        イベントを作成する
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="xs" scrollBehavior={'inside'}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader></ModalHeader>
          <ModalBody py="0">
            {sortedCandidateDates?.map((sortedCandidateDate, i) => (
              <Box key={i}>
                <Box>
                  {new Date(sortedCandidateDate.date).getMonth() +
                    '/' +
                    new Date(sortedCandidateDate.date).getDay()}
                </Box>
                {sortedCandidateDate.timeWidth.map((timeWidth, j) => (
                  <Box key={j}>{timeWidth.stringTimeWidth}</Box>
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
                >
                  保存
                </Button>
              </HStack>
            </Center>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
