import { useRecoilState } from 'recoil';
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
} from '@chakra-ui/react';
import DayPicker, { DateUtils, DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { useEffect, useRef, useState } from 'react';

type CandidateDate = {
  date: Date[];
  timeWidth: TimeWidth[];
};

type TimeWidth = {
  fromHour: string;
  toHour: string;
  fromMinute: string;
  toMinute: string;
};

export const InputDates = () => {
  const [event, setEvent] = useRecoilState(editingEventState);
  const [candidateDates, setCandidateDates] = useState<CandidateDate[]>([
    {
      date: [],
      timeWidth: [{ fromHour: '', toHour: '', fromMinute: '', toMinute: '' }],
    },
  ]);
  const [timeWidths, setTimeWidths] = useState<TimeWidth[]>([
    {
      fromHour: '',
      toHour: '',
      fromMinute: '',
      toMinute: '',
    },
  ]);
  const [sortedDates, setSortedDates] = useState(['']);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef(null);

  const handleDayClick = (day: Date, { selected }: DayModifiers, e: any, indexDate: number) => {
    const selectedDays = candidateDates[indexDate].date.concat();
    if (selected) {
      const selectedIndex = selectedDays.findIndex((selectedDay) =>
        DateUtils.isSameDay(selectedDay, day),
      );
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    const sortedDates = selectedDays.sort((a, b) => {
      return a.valueOf() - b.valueOf();
    });

    setCandidateDates((state) => {
      const currentData = state[indexDate];
      const newData = { ...currentData, date: sortedDates };
      state[indexDate] = newData;
      return state;
    });

    const possibleDates = sortedDates.map((date) => date.getMonth() + '/' + date.getDate());

    setSortedDates((currentState) => {
      currentState[indexDate] = possibleDates.join(', ');
      return currentState;
    });
  };

  // const setTimeObject = (indexDate: number, indexWidth: number) => {
  //   const currentData = candidateDates[indexDate];
  //   const currentTimeWidth = currentData.timeWidth[indexWidth];
  //   const newData = { ...currentData, timeWidth: value };
  //   state[index] = newData;
  //   setCandidateDates(state);
  // };

  const setObjectList = (state: any, setState: any, key: string, value: any, index: number) => {
    const currentData = state[index];
    const newData = { ...currentData, [key]: value };
    state[index] = newData;
    setState(state);
  };

  const changeFromHour = (
    e: React.ChangeEvent<HTMLInputElement>,
    indexDate: number,
    indexWidth: number,
  ) => {
    setEvent((state) => ({ ...state, fromHour: e.target.value }));
  };

  const changeToHour = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEvent((state) => ({ ...state, toHour: e.target.value }));
  };

  const blurFromHour = (e: React.FocusEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) < 0) {
      setEvent((state) => ({ ...state, fromHour: '' }));
    } else if (parseInt(e.target.value) > 24) {
      setEvent((state) => ({ ...state, fromHour: '24' }));
    } else {
      setEvent((state) => ({ ...state, fromHour: String(parseInt(e.target.value)) }));
    }
  };

  const blurToHour = (e: React.FocusEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) <= parseInt(event.fromHour)) {
      setEvent((state) => ({ ...state, toHour: event.fromHour }));
    } else if (parseInt(e.target.value) > 24) {
      setEvent((state) => ({ ...state, toHour: '24' }));
    } else {
      setEvent((state) => ({ ...state, toHour: String(parseInt(e.target.value)) }));
    }
  };

  const changeFromMinute = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEvent((state) => ({ ...state, fromMinute: e.target.value }));
  };

  const changeToMinute = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEvent((state) => ({ ...state, toMinute: e.target.value }));
  };

  const blurFromMinute = (e: React.FocusEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) < 0) {
      setEvent((state) => ({ ...state, fromMinute: '00' }));
    } else if (parseInt(e.target.value) >= 0 && parseInt(e.target.value) <= 9) {
      setEvent((state) => ({ ...state, fromMinute: '0' + parseInt(e.target.value) }));
    } else if (parseInt(e.target.value) >= 10 && parseInt(e.target.value) <= 59) {
      setEvent((state) => ({ ...state, fromMinute: String(parseInt(e.target.value)) }));
    } else if (parseInt(e.target.value) >= 60) {
      setEvent((state) => ({ ...state, fromMinute: '59' }));
    }
  };

  const blurToMinute = (e: React.FocusEvent<HTMLInputElement>) => {
    if (event.fromHour === event.toHour && parseInt(e.target.value) <= parseInt(event.fromMinute)) {
      setEvent((state) => ({ ...state, toMinute: event.fromMinute }));
    } else if (parseInt(e.target.value) >= 0 && parseInt(e.target.value) <= 9) {
      setEvent((state) => ({ ...state, toMinute: '0' + parseInt(e.target.value) }));
    } else if (parseInt(e.target.value) >= 10 && parseInt(e.target.value) <= 59) {
      setEvent((state) => ({ ...state, toMinute: String(parseInt(e.target.value)) }));
    } else if (parseInt(e.target.value) >= 60) {
      setEvent((state) => ({ ...state, toMinute: '59' }));
    }
  };

  const addTimeWidths = () => {
    setTimeWidths([...timeWidths, { fromHour: '', toHour: '', fromMinute: '', toMinute: '' }]);
  };

  const addCandidateDate = () => {
    setCandidateDates([
      ...candidateDates,
      {
        date: [],
        timeWidth: [{ fromHour: '', toHour: '', fromMinute: '', toMinute: '' }],
      },
    ]);
  };

  return (
    <Box pt="4">
      <Flex align="center">
        <Circle size="30px" bg="green.500" color="white" fontWeight="bold">
          2
        </Circle>
        <Text fontSize="lg" fontWeight="bold" pl="4">
          時間候補を入力
        </Text>
      </Flex>
      {candidateDates.map((candidateDate, indexDate) => (
        <Box key={indexDate}>
          <Box p="3">
            <FormControl px="3" py="2" borderWidth="2px" borderRadius="lg" isRequired>
              <FormLabel fontWeight="bold" fontSize="sm" ref={finalRef}>
                日付
              </FormLabel>
              <Input placeholder="タップしてください" value={sortedDates} onFocus={onOpen} />
              <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose} size="xs">
                <ModalOverlay />
                <ModalContent>
                  <ModalCloseButton />
                  <ModalHeader></ModalHeader>
                  <ModalBody py="0">
                    <Box>
                      <DayPicker
                        selectedDays={candidateDates[indexDate].date}
                        onDayClick={(day, modifires, e) =>
                          handleDayClick(day, modifires, e, indexDate)
                        }
                      />
                    </Box>
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
            </FormControl>
          </Box>
          <Box px="3">
            <FormControl px="3" py="2" borderWidth="2px" borderRadius="lg" isRequired>
              <FormLabel fontWeight="bold" fontSize="sm" ref={finalRef}>
                時間幅
              </FormLabel>
              {timeWidths.map((timeWidth, indexWidth) => (
                <HStack key={indexWidth}>
                  <Box>
                    <Input
                      type="number"
                      value={candidateDates[indexDate].timeWidth[indexWidth].fromHour}
                      onChange={(e) => changeFromHour(e, indexDate, indexWidth)}
                      onBlur={blurFromHour}
                      textAlign="center"
                      p="0"
                    />
                  </Box>
                  <Text>:</Text>
                  <Box>
                    <Input
                      type="number"
                      value={event.fromMinute}
                      onChange={changeFromMinute}
                      onBlur={blurFromMinute}
                      textAlign="center"
                      p="0"
                    />
                  </Box>
                  <Text>~</Text>
                  <Box>
                    <Input
                      type="number"
                      value={event.toHour}
                      onChange={changeToHour}
                      onBlur={blurToHour}
                      textAlign="center"
                      p="0"
                    />
                  </Box>
                  <Text>:</Text>
                  <Box>
                    <Input
                      type="number"
                      value={event.toMinute}
                      onChange={changeToMinute}
                      onBlur={blurToMinute}
                      textAlign="center"
                      p="0"
                    />
                  </Box>
                </HStack>
              ))}

              <Button onClick={addTimeWidths}>追加</Button>
            </FormControl>
          </Box>
        </Box>
      ))}
      <Button onClick={addCandidateDate}>追加</Button>
      <Box pos="fixed" w="100%" zIndex={2}>
        Fixed with zIndex
      </Box>
    </Box>
  );
};
