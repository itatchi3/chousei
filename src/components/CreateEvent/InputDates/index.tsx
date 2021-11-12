import { useRecoilState } from 'recoil';
import { candidateDateState } from 'src/atoms/eventState';
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

    const possibleDates = sortedDates.map((date) => date.getMonth() + 1 + '/' + date.getDate());
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
  const changeStartHour = (
    e: React.ChangeEvent<HTMLInputElement>,
    indexDate: number,
    indexWidth: number,
  ) => {
    onChangeTimeWidth('startHour', e.target.value, indexDate, indexWidth);
  };

  const changeEndHour = (
    e: React.ChangeEvent<HTMLInputElement>,
    indexDate: number,
    indexWidth: number,
  ) => {
    onChangeTimeWidth('endHour', e.target.value, indexDate, indexWidth);
  };

  const blurStartHour = (
    e: React.FocusEvent<HTMLInputElement>,
    indexDate: number,
    indexWidth: number,
  ) => {
    if (parseInt(e.target.value) < 0) {
      onChangeTimeWidth('startHour', '', indexDate, indexWidth);
    } else if (parseInt(e.target.value) > 23) {
      onChangeTimeWidth('startHour', '23', indexDate, indexWidth);
    } else {
      onChangeTimeWidth('startHour', String(parseInt(e.target.value)), indexDate, indexWidth);
    }
  };

  const blurEndHour = (
    e: React.FocusEvent<HTMLInputElement>,
    indexDate: number,
    indexWidth: number,
  ) => {
    if (
      parseInt(e.target.value) <=
      parseInt(candidateDates[indexDate].timeWidth[indexWidth].startHour)
    ) {
      onChangeTimeWidth(
        'endHour',
        candidateDates[indexDate].timeWidth[indexWidth].startHour,
        indexDate,
        indexWidth,
      );
    } else if (parseInt(e.target.value) > 23) {
      onChangeTimeWidth('endHour', '23', indexDate, indexWidth);
    } else {
      onChangeTimeWidth('endHour', String(parseInt(e.target.value)), indexDate, indexWidth);
    }
  };

  const changestartMinute = (
    e: React.ChangeEvent<HTMLInputElement>,
    indexDate: number,
    indexWidth: number,
  ) => {
    onChangeTimeWidth('startMinute', e.target.value, indexDate, indexWidth);
  };

  const changeendMinute = (
    e: React.ChangeEvent<HTMLInputElement>,
    indexDate: number,
    indexWidth: number,
  ) => {
    onChangeTimeWidth('endMinute', e.target.value, indexDate, indexWidth);
  };

  const blurstartMinute = (
    e: React.FocusEvent<HTMLInputElement>,
    indexDate: number,
    indexWidth: number,
  ) => {
    if (parseInt(e.target.value) < 0) {
      onChangeTimeWidth('startMinute', '00', indexDate, indexWidth);
    } else if (parseInt(e.target.value) >= 0 && parseInt(e.target.value) <= 9) {
      onChangeTimeWidth('startMinute', '0' + parseInt(e.target.value), indexDate, indexWidth);
    } else if (parseInt(e.target.value) >= 10 && parseInt(e.target.value) <= 59) {
      onChangeTimeWidth('startMinute', String(parseInt(e.target.value)), indexDate, indexWidth);
    } else if (parseInt(e.target.value) >= 60) {
      onChangeTimeWidth('startMinute', '59', indexDate, indexWidth);
    }
  };

  const blurendMinute = (
    e: React.FocusEvent<HTMLInputElement>,
    indexDate: number,
    indexWidth: number,
  ) => {
    if (
      candidateDates[indexDate].timeWidth[indexWidth].startHour ===
        candidateDates[indexDate].timeWidth[indexWidth].endHour &&
      parseInt(e.target.value) <=
        parseInt(candidateDates[indexDate].timeWidth[indexWidth].startMinute)
    ) {
      onChangeTimeWidth(
        'endMinute',
        candidateDates[indexDate].timeWidth[indexWidth].startMinute,
        indexDate,
        indexWidth,
      );
    } else if (parseInt(e.target.value) >= 0 && parseInt(e.target.value) <= 9) {
      onChangeTimeWidth('endMinute', '0' + parseInt(e.target.value), indexDate, indexWidth);
    } else if (parseInt(e.target.value) >= 10 && parseInt(e.target.value) <= 59) {
      onChangeTimeWidth('endMinute', String(parseInt(e.target.value)), indexDate, indexWidth);
    } else if (parseInt(e.target.value) >= 60) {
      onChangeTimeWidth('endMinute', '59', indexDate, indexWidth);
    }
  };

  const addTimeWidths = async (indexDate: number) => {
    const currentData = candidateDates[indexDate];
    const newTimeWidth = [
      ...currentData.timeWidth,
      {
        startHour: '',
        endHour: '',
        startMinute: '',
        endMinute: '',
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
        timeWidth: [{ startHour: '', endHour: '', startMinute: '', endMinute: '' }],
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

  console.log(candidateDates);
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
          <Box mt="3" py="2" borderWidth="2px" borderRadius="lg" key={indexDate}>
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
                  <ModalCloseButton />
                  <ModalHeader></ModalHeader>
                  <ModalBody py="0">
                    <Box>
                      <DayPicker
                        selectedDays={candidateDate.date}
                        onDayClick={(day, modifires, e) =>
                          handleDayClick(day, modifires, indexDate)
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
                  時間幅
                </FormLabel>
              </Box>
              <VStack>
                {candidateDate.timeWidth.map((timeWidth, indexWidth) => (
                  <HStack key={indexWidth} pb="1" align="center">
                    <CloseButton
                      size="sm"
                      ml="-2"
                      mr="-1"
                      sx={{
                        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                        _focus: { boxShadow: 'none' },
                      }}
                      onClick={() => onDeleteTimeWidth(indexDate, indexWidth)}
                      visibility={candidateDate.timeWidth.length >= 2 ? 'visible' : 'hidden'}
                    />
                    <Box>
                      <Input
                        type="number"
                        value={timeWidth.startHour}
                        onChange={(e) => changeStartHour(e, indexDate, indexWidth)}
                        onBlur={(e) => blurStartHour(e, indexDate, indexWidth)}
                        textAlign="center"
                        p="0"
                        ref={datePicRef.current[indexDate] as any}
                      />
                    </Box>
                    <Text>:</Text>
                    <Box>
                      <Input
                        type="number"
                        value={timeWidth.startMinute}
                        onChange={(e) => changestartMinute(e, indexDate, indexWidth)}
                        onBlur={(e) => blurstartMinute(e, indexDate, indexWidth)}
                        textAlign="center"
                        p="0"
                      />
                    </Box>
                    <Text>~</Text>
                    <Box>
                      <Input
                        type="number"
                        value={timeWidth.endHour}
                        onChange={(e) => changeEndHour(e, indexDate, indexWidth)}
                        onBlur={(e) => blurEndHour(e, indexDate, indexWidth)}
                        textAlign="center"
                        p="0"
                      />
                    </Box>
                    <Text>:</Text>
                    <Box pr="4">
                      <Input
                        type="number"
                        value={timeWidth.endMinute}
                        onChange={(e) => changeendMinute(e, indexDate, indexWidth)}
                        onBlur={(e) => blurendMinute(e, indexDate, indexWidth)}
                        textAlign="center"
                        p="0"
                      />
                    </Box>
                  </HStack>
                ))}

                <Button onClick={() => addTimeWidths(indexDate)}>+</Button>
              </VStack>
            </FormControl>
          </Box>
        ))}
        <Box pt="2">
          <Button onClick={addCandidateDate}>+</Button>
        </Box>
      </VStack>
    </Box>
  );
};
