import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  possibleDateState,
  isValidateDateState,
  isValidateTimeArrayState,
} from 'src/atoms/eventState';
import { Box, Button, Circle, CloseButton, Flex, Text, VStack } from '@chakra-ui/react';
import 'react-day-picker/lib/style.css';
import { useEffect } from 'react';
import { cloneDeep } from 'lodash';
import { InputDate } from 'src/components/CreateEvent/InputDate';
import { InputTimeWidth } from 'src/components/CreateEvent/InputTimeWidth';
import { v4 as uuidv4 } from 'uuid';

export const InputPossibleDates = () => {
  const [possibleDates, setPossibleDates] = useRecoilState(possibleDateState);
  const setIsValidateDate = useSetRecoilState(isValidateDateState);
  const [isValidateTimeArray, setIsValidateTimeArray] = useRecoilState(isValidateTimeArrayState);
  const addPossibleDate = () => {
    setPossibleDates([
      ...possibleDates,
      {
        id: uuidv4(),
        date: [],
        dateString: '',
        timeWidth: [{ id: uuidv4(), start: '12:00', end: '13:00' }],
      },
    ]);
    setIsValidateTimeArray([...isValidateTimeArray, false]);
  };

  const onDeleteDate = (indexDate: number) => {
    const newPossibleDates = cloneDeep(possibleDates);
    newPossibleDates.splice(indexDate, 1);
    setPossibleDates(newPossibleDates);
  };

  useEffect(() => {
    let validateDate = false;
    let validateTimeArray = Array(possibleDates.length).fill(false);
    possibleDates.map((possibleDate, indexDate) => {
      if (possibleDate.date.length === 0) {
        validateDate = true;
      }
      possibleDate.timeWidth.map((timeWidth) => {
        if (timeWidth.start >= timeWidth.end) {
          validateTimeArray[indexDate] = true;
        }
      });
    });
    setIsValidateDate(validateDate);
    setIsValidateTimeArray(validateTimeArray);
  }, [possibleDates, setIsValidateDate, setIsValidateTimeArray]);

  return (
    <>
      <Flex align="center">
        <Circle size="30px" bg="green.500" color="white" fontWeight="bold">
          2
        </Circle>
        <Text fontSize="lg" fontWeight="bold" pl="4">
          候補時間を入力
        </Text>
      </Flex>
      <VStack px="3" pt="3">
        {possibleDates.map((possibleDate, indexDate) => (
          <Box px="3" py="2" borderWidth="2px" borderRadius="lg" width="100%" key={possibleDate.id}>
            <Flex justifyContent="flex-end">
              <CloseButton
                mb="-6"
                zIndex="1"
                onClick={() => onDeleteDate(indexDate)}
                visibility={possibleDates.length >= 2 ? 'visible' : 'hidden'}
              />
            </Flex>
            <Box zIndex="0">
              <InputDate indexDate={indexDate} />
            </Box>
            <Box pt="3">
              <InputTimeWidth
                indexDate={indexDate}
                isValidateTime={isValidateTimeArray[indexDate]}
              />
            </Box>
          </Box>
        ))}
        <Box pt="2">
          <Button onClick={addPossibleDate}>+</Button>
        </Box>
      </VStack>
    </>
  );
};
