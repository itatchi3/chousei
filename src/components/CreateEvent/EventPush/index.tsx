import { useState, useEffect, useRef } from 'react';
import { candidateDateState } from 'src/atoms/eventState';
import { database } from 'src/utils/firebase';
// import { DateObject } from 'react-multi-date-picker';
// import Grid from '@material-ui/core/Grid';
// import Button from '@material-ui/core/Button';
import { useAuth } from 'src/hooks/auth';
import { useRecoilValue } from 'recoil';
import { editingEventState } from 'src/atoms/eventState';
import {
  Box,
  Center,
  Circle,
  Flex,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
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

export const EventPush = () => {
  const { liff } = useAuth();
  const [eventNameValidation, setEventNameValidation] = useState(true);
  const [datesValidation, setDatesValidation] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef(null);
  const candidateDates = useRecoilValue(candidateDateState);

  const registerEvent = async () => {
    let sortedCandidateDates = [];
    candidateDates.map((candidateDate, i) => {
      candidateDate.date.map((date, j) => {
        date;
      });
    });
    //   if (event.eventName !== '' && event.dates !== null) {
    //     //入力した値の整形
    //     const possibleDates = (event.dates as DateObject[]).map(
    //       (date) => date.month + '/' + date.day,
    //     );
    //     const sortedPossibleDates = possibleDates.sort((a, b) => {
    //       return a > b ? 1 : -1;
    //     });
    //     const times = [];
    //     switch (event.timeInterval[0]) {
    //       case 15:
    //         for (let i = event.timeWidth[0]; i < event.timeWidth[1]; i++) {
    //           times.push(i + ':00');
    //           times.push(i + ':15');
    //           times.push(i + ':45');
    //         }
    //         break;
    //       case 30:
    //         for (let i = event.timeWidth[0]; i < event.timeWidth[1]; i++) {
    //           times.push(i + ':00');
    //           times.push(i + ':30');
    //         }
    //         break;
    //       case 60:
    //         for (let i = event.timeWidth[0]; i < event.timeWidth[1]; i++) {
    //           times.push(i + ':00');
    //         }
    //         break;
    //       case 120:
    //         for (let i = event.timeWidth[0]; i < event.timeWidth[1]; i = i + 2) {
    //           times.push(i + ':00');
    //         }
    //         break;
    //       default:
    //       // do nothing
    //     }
    // const prospectiveDates = [];
    // for (let j = 0; j < sortedPossibleDates.length; j++) {
    //   for (let k = 0; k < times.length; k++) {
    //     prospectiveDates.push(sortedPossibleDates[j] + '  ' + times[k]);
    //   }
    // }
    // const eventData = {
    //   name: event.eventName,
    //   description: event.description,
    //   dates: sortedPossibleDates,
    //   times: times,
    //   prospectiveDates: prospectiveDates,
    // };
    //Realtime Databaseに整形した値を書き込む
    //LINEに出欠表のURLを送信する
    // const eventPush = await database.ref('events').push(eventData);
    // const eventId = eventPush.key;
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
    //       .then(() => {
    //         console.log('message sent');
    //       })
    //       .catch((err) => {
    //         console.log('error', err);
    //         alert(err);
    //       });
    //     // liffアプリを閉じる
    //     liff!.closeWindow();
    //     // router.push(`/event/${eventId}`);
    //   }
  };

  // useEffect(() => {
  //   const errorCheck = () => {
  //     if (event.eventName === '') {
  //       setEventNameValidation(false);
  //     } else {
  //       setEventNameValidation(true);
  //     }

  //     // 無理矢理感ある
  //     if ((event.dates as DateObject[]).length === 0) {
  //       setDatesValidation(false);
  //     } else {
  //       setDatesValidation(true);
  //     }
  //   };
  //   errorCheck();
  // }, [event.eventName, event.dates]);
  return (
    <VStack>
      <Button
        bg="green.200"
        onFocus={onOpen}
        onClick={() => {
          registerEvent();
        }}
      >
        イベントを作成する
      </Button>
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader></ModalHeader>
          <ModalBody py="0">
            <Box>aaaaa</Box>
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
                  onClick={onClose}
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
