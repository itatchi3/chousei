import { useRecoilState } from 'recoil';
import { candidateDateState, isValidateDateState, isValidateTimeState } from 'src/atoms/eventState';
import {
  Box,
  Button,
  Center,
  Circle,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import DayPicker, { DateUtils, DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { useRef, useState, createRef, useEffect } from 'react';
import { cloneDeep } from 'lodash';

export const InputDates = () => {
  const [candidateDates, setCandidateDates] = useRecoilState(candidateDateState);
  const [sortedDatesString, setSortedDatesString] = useState(['']);
  const datePicRef = useRef<React.RefObject<HTMLLabelElement>[]>([]);
  const [isOpen, setIsOpen] = useState([false]);
  const [isValidateDate, setIsValidateDate] = useRecoilState(isValidateDateState);
  const [isValidateTime, setIsValidateTime] = useRecoilState(isValidateTimeState);
  const dayOfWeekStr = ['日', '月', '火', '水', '木', '金', '土'];

  const handleDayClick = (day: Date, { selected }: DayModifiers, indexDate: number) => {
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

    const currentData = candidateDates[indexDate];
    const newData = { ...currentData, date: sortedDates };
    const newState = cloneDeep(candidateDates);
    newState[indexDate] = newData;
    setCandidateDates(newState);

    const possibleDates = sortedDates.map(
      (date) =>
        date.getMonth() + 1 + '/' + date.getDate() + '(' + dayOfWeekStr[date.getDay()] + ')',
    );
    const newSortedDatesString = cloneDeep(sortedDatesString);
    newSortedDatesString[indexDate] = possibleDates.join(', ');
    setSortedDatesString(newSortedDatesString);
  };

  const onChangeTimeWidth = (key: string, value: string, indexDate: number, indexWidth: number) => {
    const currentData = candidateDates[indexDate];
    const currentTimeWidth = currentData.timeWidth[indexWidth];
    const newTimeWidth = { ...currentTimeWidth, [key]: value };
    const newState = cloneDeep(candidateDates);
    newState[indexDate].timeWidth[indexWidth] = newTimeWidth;
    setCandidateDates(newState);
  };
  const changeStartTime = (
    e: React.ChangeEvent<HTMLInputElement>,
    indexDate: number,
    indexWidth: number,
  ) => {
    onChangeTimeWidth('start', e.target.value, indexDate, indexWidth);
  };

  const changeEndTime = (
    e: React.ChangeEvent<HTMLInputElement>,
    indexDate: number,
    indexWidth: number,
  ) => {
    onChangeTimeWidth('end', e.target.value, indexDate, indexWidth);
  };

  const addTimeWidths = async (indexDate: number) => {
    const currentData = candidateDates[indexDate];
    const lastTimeWidth = currentData.timeWidth[currentData.timeWidth.length - 1];
    const [startHour, startMin] = lastTimeWidth.start.split(':').map(Number);
    const [endHour, endMin] = lastTimeWidth.end.split(':').map(Number);
    const minLength = endMin - startMin;
    const hourLength = endHour - startHour;
    const newStartTIme = lastTimeWidth.end;
    let newEndTime = '';
    if (endMin + minLength < 60) {
      newEndTime = `${endHour + hourLength}:${('00' + endMin + minLength).slice(-2)}`;
    } else {
      newEndTime = `${endHour + hourLength + 1}:${('00' + (endMin + minLength - 60)).slice(-2)}`;
    }

    if (newEndTime.split(':').map(Number)[0] >= 24) {
      newEndTime = '23:59';
    }

    const newTimeWidth = [
      ...currentData.timeWidth,
      {
        start: newStartTIme,
        end: newEndTime,
      },
    ];
    const newState = cloneDeep(candidateDates);
    newState[indexDate].timeWidth = newTimeWidth;
    setCandidateDates(newState);
  };

  const addCandidateDate = () => {
    setCandidateDates([
      ...candidateDates,
      {
        date: [],
        timeWidth: [{ start: '12:00', end: '13:00' }],
      },
    ]);
    setIsOpen([...isOpen, false]);
  };

  const onOpen = (indexDate: number) => {
    const newIsOpen = cloneDeep(isOpen);
    newIsOpen[indexDate] = true;
    setIsOpen(newIsOpen);
  };

  const onClose = (indexDate: number) => {
    const newIsOpen = cloneDeep(isOpen);
    newIsOpen[indexDate] = false;
    setIsOpen(newIsOpen);
  };

  const onDeleteDate = (indexDate: number) => {
    const newCandidateDates = cloneDeep(candidateDates);
    newCandidateDates.splice(indexDate, 1);
    setCandidateDates(newCandidateDates);
    const newSortedDatesString = cloneDeep(sortedDatesString);
    newSortedDatesString.splice(indexDate, 1);
    setSortedDatesString(newSortedDatesString);
  };

  const onDeleteTimeWidth = (indexDate: number, indexWidth: number) => {
    const newCandidateDates = cloneDeep(candidateDates);
    newCandidateDates[indexDate].timeWidth.splice(indexWidth, 1);
    setCandidateDates(newCandidateDates);
  };
  useEffect(() => {
    datePicRef.current = candidateDates.map(() => createRef());
  }, [candidateDates]);

  useEffect(() => {
    let validateDate = false;
    let validateTime = false;
    candidateDates.map((candidateDate) => {
      if (candidateDate.date.length === 0) {
        validateDate = true;
        setIsValidateDate(true);
      }
      candidateDate.timeWidth.map((timeWidth) => {
        if (timeWidth.start >= timeWidth.end) {
          validateTime = true;
          setIsValidateTime(true);
        }
      });
    });
    if (!validateDate) {
      setIsValidateDate(false);
    }
    if (!validateTime) {
      setIsValidateTime(false);
    }
  }, [candidateDates, setIsValidateDate, setIsValidateTime]);

  return (
    <Box>
      <Flex align="center">
        <Circle size="30px" bg="green.500" color="white" fontWeight="bold">
          2
        </Circle>
        <Text fontSize="lg" fontWeight="bold" pl="4">
          候補時間を入力
        </Text>
      </Flex>
      <VStack px="3">
        {candidateDates.map((candidateDate, indexDate) => (
          <Box mt="3" py="2" borderWidth="2px" borderRadius="lg" width="100%" key={indexDate}>
            <FormControl px="3" isRequired>
              <Flex>
                <Box my="1">
                  <FormLabel fontWeight="bold" fontSize="sm">
                    日付
                  </FormLabel>
                </Box>
                <Spacer />

                <CloseButton
                  sx={{
                    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                    _focus: { boxShadow: 'none' },
                  }}
                  onClick={() => onDeleteDate(indexDate)}
                  visibility={candidateDates.length >= 2 ? 'visible' : 'hidden'}
                />
              </Flex>
              <Input
                placeholder="タップしてください"
                defaultValue={sortedDatesString[indexDate]}
                onFocus={() => onOpen(indexDate)}
              />
              <Modal
                finalFocusRef={datePicRef.current[indexDate]}
                isOpen={isOpen[indexDate]}
                onClose={() => onClose(indexDate)}
                size="xs"
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalCloseButton
                    sx={{
                      WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                      _focus: { boxShadow: 'none' },
                    }}
                  />
                  <ModalHeader></ModalHeader>
                  <ModalBody py="0" px="0">
                    <Box>
                      <DayPicker
                        selectedDays={candidateDate.date}
                        onDayClick={(day, modifires, e) =>
                          handleDayClick(day, modifires, indexDate)
                        }
                        weekdaysShort={['日', '月', '火', '水', '木', '金', '土']}
                      />
                      <style jsx global>{`
                        .DayPicker-Day {
                          padding: 4px 8px;
                          margin: 2px;
                        }
                        .DayPicker {
                          font-size: 21px;
                          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                        }
                        .DayPicker:not(.DayPicker--interactionDisabled)
                          .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
                          background: none;
                        }
                        .DayPicker-Day--today {
                          color: #000000;
                        }
                      `}</style>
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
                          onClick={() => onClose(indexDate)}
                        >
                          保存
                        </Button>
                      </HStack>
                    </Center>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </FormControl>
            <FormControl px="3" pt="3" isRequired>
              <Box py="1">
                <FormLabel fontWeight="bold" fontSize="sm" pb="1">
                  時間帯
                </FormLabel>
              </Box>
              <VStack>
                {candidateDate.timeWidth.map((timeWidth, indexWidth) => (
                  <HStack key={indexWidth} pb="1">
                    <CloseButton
                      size="sm"
                      sx={{
                        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                        _focus: { boxShadow: 'none' },
                      }}
                      onClick={() => onDeleteTimeWidth(indexDate, indexWidth)}
                      visibility={candidateDate.timeWidth.length >= 2 ? 'visible' : 'hidden'}
                    />
                    <Box
                      borderWidth="1px"
                      borderRadius="lg"
                      width="100px"
                      position="relative"
                      borderColor={
                        timeWidth.start >= timeWidth.end ||
                        timeWidth.start === '' ||
                        timeWidth.end === ''
                          ? 'red.500'
                          : 'gray.200'
                      }
                    >
                      <Box
                        textAlign="center"
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translateY(-50%) translateX(-50%)"
                      >
                        {timeWidth.start}
                      </Box>
                      <Input
                        type="time"
                        onChange={(e) => changeStartTime(e, indexDate, indexWidth)}
                        opacity="0"
                        value={timeWidth.start}
                      />
                    </Box>
                    <Text>~</Text>
                    <Box pr="8">
                      <Box
                        borderWidth="1px"
                        borderRadius="lg"
                        position="relative"
                        width="100px"
                        borderColor={
                          timeWidth.start >= timeWidth.end ||
                          timeWidth.start === '' ||
                          timeWidth.end === ''
                            ? 'red.500'
                            : 'gray.200'
                        }
                      >
                        <Box
                          textAlign="center"
                          position="absolute"
                          top="50%"
                          left="50%"
                          transform="translateY(-50%) translateX(-50%)"
                        >
                          {timeWidth.end}
                        </Box>
                        <Input
                          type="time"
                          onChange={(e) => changeEndTime(e, indexDate, indexWidth)}
                          opacity="0"
                          value={timeWidth.end}
                        />
                      </Box>
                    </Box>
                  </HStack>
                ))}
                <style jsx global>{`
                  input[type='time']::-webkit-calendar-picker-indicator {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    width: 100%;
                  }
                `}</style>
                <Button
                  sx={{
                    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                    _focus: { boxShadow: 'none' },
                  }}
                  onClick={() => addTimeWidths(indexDate)}
                  disabled={isValidateTime}
                >
                  +
                </Button>
              </VStack>
            </FormControl>
          </Box>
        ))}
        <Box pt="2">
          <Button
            sx={{
              WebkitTapHighlightColor: 'rgba(0,0,0,0)',
              _focus: { boxShadow: 'none' },
            }}
            onClick={addCandidateDate}
          >
            +
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};
