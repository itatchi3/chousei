import { useRecoilState } from 'recoil';
import { candidateDateState, isValidateState } from 'src/atoms/eventState';
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
  const [isValidate, setIsValidate] = useRecoilState(isValidateState);

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
    const newTimeWidth = [
      ...currentData.timeWidth,
      {
        start: '12:00',
        end: '13:00',
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
    let validate = false;
    candidateDates.map((candidateDate) => {
      if (candidateDate.date.length === 0) {
        validate = true;
        setIsValidate(true);
      }
      candidateDate.timeWidth.map((timeWidth) => {
        if (timeWidth.start >= timeWidth.end) {
          validate = true;
          setIsValidate(true);
        }
      });
    });
    if (!validate) {
      setIsValidate(false);
    }
  }, [candidateDates, setIsValidate]);

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
                  <HStack key={indexWidth} pb="1" width="100%" align="center">
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
                    <Box width="100%">
                      {timeWidth.start >= timeWidth.end ||
                      timeWidth.start === '' ||
                      timeWidth.end === '' ? (
                        <Input
                          type="time"
                          display="flex"
                          justifyContent="center"
                          pl="10"
                          sx={{
                            WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                            _focus: { boxShadow: '0 0 0 1px #e53e3e' },
                          }}
                          value={timeWidth.start}
                          onChange={(e) => changeStartTime(e, indexDate, indexWidth)}
                          isInvalid
                        />
                      ) : (
                        <Input
                          type="time"
                          display="flex"
                          justifyContent="center"
                          pl="10"
                          sx={{
                            WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                            _focus: { boxShadow: 'none' },
                          }}
                          value={timeWidth.start}
                          onChange={(e) => changeStartTime(e, indexDate, indexWidth)}
                        />
                      )}
                    </Box>
                    <Text>~</Text>
                    {timeWidth.start >= timeWidth.end ||
                    timeWidth.start === '' ||
                    timeWidth.end === '' ? (
                      <Box width="100%" pr="5">
                        <Input
                          type="time"
                          display="flex"
                          justifyContent="center"
                          pl="10"
                          sx={{
                            WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                            _focus: { boxShadow: '0 0 0 1px #e53e3e' },
                          }}
                          value={timeWidth.end}
                          onChange={(e) => changeEndTime(e, indexDate, indexWidth)}
                          isInvalid
                        />
                      </Box>
                    ) : (
                      <Box width="100%" pr="5">
                        <Input
                          type="time"
                          display="flex"
                          justifyContent="center"
                          pl="10"
                          sx={{
                            WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                            _focus: { boxShadow: 'none' },
                          }}
                          value={timeWidth.end}
                          onChange={(e) => changeEndTime(e, indexDate, indexWidth)}
                        />
                      </Box>
                    )}
                  </HStack>
                ))}
                <Button
                  sx={{
                    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                    _focus: { boxShadow: 'none' },
                  }}
                  onClick={() => addTimeWidths(indexDate)}
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
