import { useRecoilState } from 'recoil';
import { candidateDateState } from 'src/atoms/eventState';
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
  HStack,
  ModalCloseButton,
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

    const possibleDates = sortedDates.map((date) => date.getMonth() + '/' + date.getDate());
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
  const changeFromHour = (
    e: React.ChangeEvent<HTMLInputElement>,
    indexDate: number,
    indexWidth: number,
  ) => {
    onChangeTimeWidth('fromHour', e.target.value, indexDate, indexWidth);
  };

  const changeToHour = (
    e: React.ChangeEvent<HTMLInputElement>,
    indexDate: number,
    indexWidth: number,
  ) => {
    onChangeTimeWidth('toHour', e.target.value, indexDate, indexWidth);
  };

  const blurFromHour = (
    e: React.FocusEvent<HTMLInputElement>,
    indexDate: number,
    indexWidth: number,
  ) => {
    if (parseInt(e.target.value) < 0) {
      onChangeTimeWidth('fromHour', '', indexDate, indexWidth);
    } else if (parseInt(e.target.value) > 23) {
      onChangeTimeWidth('fromHour', '23', indexDate, indexWidth);
    } else {
      onChangeTimeWidth('fromHour', String(parseInt(e.target.value)), indexDate, indexWidth);
    }
  };

  const blurToHour = (
    e: React.FocusEvent<HTMLInputElement>,
    indexDate: number,
    indexWidth: number,
  ) => {
    if (
      parseInt(e.target.value) <= parseInt(candidateDates[indexDate].timeWidth[indexWidth].fromHour)
    ) {
      onChangeTimeWidth(
        'toHour',
        candidateDates[indexDate].timeWidth[indexWidth].fromHour,
        indexDate,
        indexWidth,
      );
    } else if (parseInt(e.target.value) > 23) {
      onChangeTimeWidth('toHour', '23', indexDate, indexWidth);
    } else {
      onChangeTimeWidth('toHour', String(parseInt(e.target.value)), indexDate, indexWidth);
    }
  };

  const changeFromMinute = (
    e: React.ChangeEvent<HTMLInputElement>,
    indexDate: number,
    indexWidth: number,
  ) => {
    onChangeTimeWidth('fromMinute', e.target.value, indexDate, indexWidth);
  };

  const changeToMinute = (
    e: React.ChangeEvent<HTMLInputElement>,
    indexDate: number,
    indexWidth: number,
  ) => {
    onChangeTimeWidth('toMinute', e.target.value, indexDate, indexWidth);
  };

  const blurFromMinute = (
    e: React.FocusEvent<HTMLInputElement>,
    indexDate: number,
    indexWidth: number,
  ) => {
    if (parseInt(e.target.value) < 0) {
      onChangeTimeWidth('fromMinute', '00', indexDate, indexWidth);
    } else if (parseInt(e.target.value) >= 0 && parseInt(e.target.value) <= 9) {
      onChangeTimeWidth('fromMinute', '0' + parseInt(e.target.value), indexDate, indexWidth);
    } else if (parseInt(e.target.value) >= 10 && parseInt(e.target.value) <= 59) {
      onChangeTimeWidth('fromMinute', String(parseInt(e.target.value)), indexDate, indexWidth);
    } else if (parseInt(e.target.value) >= 60) {
      onChangeTimeWidth('fromMinute', '59', indexDate, indexWidth);
    }
  };

  const blurToMinute = (
    e: React.FocusEvent<HTMLInputElement>,
    indexDate: number,
    indexWidth: number,
  ) => {
    if (
      candidateDates[indexDate].timeWidth[indexWidth].fromHour ===
        candidateDates[indexDate].timeWidth[indexWidth].toHour &&
      parseInt(e.target.value) <=
        parseInt(candidateDates[indexDate].timeWidth[indexWidth].fromMinute)
    ) {
      onChangeTimeWidth(
        'toMinute',
        candidateDates[indexDate].timeWidth[indexWidth].fromMinute,
        indexDate,
        indexWidth,
      );
    } else if (parseInt(e.target.value) >= 0 && parseInt(e.target.value) <= 9) {
      onChangeTimeWidth('toMinute', '0' + parseInt(e.target.value), indexDate, indexWidth);
    } else if (parseInt(e.target.value) >= 10 && parseInt(e.target.value) <= 59) {
      onChangeTimeWidth('toMinute', String(parseInt(e.target.value)), indexDate, indexWidth);
    } else if (parseInt(e.target.value) >= 60) {
      onChangeTimeWidth('toMinute', '59', indexDate, indexWidth);
    }
  };

  const addTimeWidths = async (indexDate: number) => {
    const currentData = candidateDates[indexDate];
    const newTimeWidth = [
      ...currentData.timeWidth,
      {
        fromHour: '',
        toHour: '',
        fromMinute: '',
        toMinute: '',
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
        timeWidth: [{ fromHour: '', toHour: '', fromMinute: '', toMinute: '' }],
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
  useEffect(() => {
    datePicRef.current = candidateDates.map(() => createRef());
  }, [candidateDates]);

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
          <Box py="2" borderWidth="2px" borderRadius="lg" key={indexDate}>
            <FormControl px="3" isRequired>
              <FormLabel fontWeight="bold" fontSize="sm">
                日付
              </FormLabel>
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
              <FormLabel fontWeight="bold" fontSize="sm">
                時間幅
              </FormLabel>
              <VStack>
                {candidateDate.timeWidth.map((timeWidth, indexWidth) => (
                  <HStack key={indexWidth} pb="1">
                    <Box>
                      <Input
                        type="number"
                        value={timeWidth.fromHour}
                        onChange={(e) => changeFromHour(e, indexDate, indexWidth)}
                        onBlur={(e) => blurFromHour(e, indexDate, indexWidth)}
                        textAlign="center"
                        p="0"
                        ref={datePicRef.current[indexDate] as any}
                      />
                    </Box>
                    <Text>:</Text>
                    <Box>
                      <Input
                        type="number"
                        value={timeWidth.fromMinute}
                        onChange={(e) => changeFromMinute(e, indexDate, indexWidth)}
                        onBlur={(e) => blurFromMinute(e, indexDate, indexWidth)}
                        textAlign="center"
                        p="0"
                      />
                    </Box>
                    <Text>~</Text>
                    <Box>
                      <Input
                        type="number"
                        value={timeWidth.toHour}
                        onChange={(e) => changeToHour(e, indexDate, indexWidth)}
                        onBlur={(e) => blurToHour(e, indexDate, indexWidth)}
                        textAlign="center"
                        p="0"
                      />
                    </Box>
                    <Text>:</Text>
                    <Box>
                      <Input
                        type="number"
                        value={timeWidth.toMinute}
                        onChange={(e) => changeToMinute(e, indexDate, indexWidth)}
                        onBlur={(e) => blurToMinute(e, indexDate, indexWidth)}
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
      <Box pos="fixed" w="100%" zIndex={2}>
        Fixed with zIndex
      </Box>
    </Box>
  );
};
