import { useRecoilState } from 'recoil';
import {
  possibleDateState,
  isValidateDateState,
  isValidateTimeListState,
} from 'src/atoms/eventState';
import { Box, Button, Circle, CloseButton, Flex, Text, VStack } from '@chakra-ui/react';
import 'react-day-picker/lib/style.css';
import { useEffect } from 'react';
import { cloneDeep } from 'lodash';
import { InputDate } from 'src/components/model/InputDate';
import { InputTimeWidth } from 'src/components/model/InputTimeWidth';

export const InputPossibleDates = () => {
  const [possibleDates, setPossibleDates] = useRecoilState(possibleDateState);
  const [isValidateDate, setIsValidateDate] = useRecoilState(isValidateDateState);
  const [isValidateTimeList, setIsValidateTimeList] = useRecoilState(isValidateTimeListState);
  const addPossibleDate = () => {
    setPossibleDates([
      ...possibleDates,
      {
        date: [],
        dateString: '',
        timeWidth: [{ start: '12:00', end: '13:00' }],
      },
    ]);
    setIsValidateTimeList([...isValidateTimeList, false]);
  };

  const onDeleteDate = (indexDate: number) => {
    const newPossibleDates = cloneDeep(possibleDates);
    newPossibleDates.splice(indexDate, 1);
    setPossibleDates(newPossibleDates);
  };

  useEffect(() => {
    let validateDate = false;
    let validateTimeList = Array(possibleDates.length).fill(false);
    possibleDates.map((possibleDate, indexDate) => {
      if (possibleDate.date.length === 0) {
        validateDate = true;
      }
      possibleDate.timeWidth.map((timeWidth) => {
        if (timeWidth.start >= timeWidth.end) {
          validateTimeList[indexDate] = true;
        }
      });
    });
    setIsValidateDate(validateDate);
    setIsValidateTimeList(validateTimeList);
  }, [possibleDates, setIsValidateDate, setIsValidateTimeList]);

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
        {possibleDates.map((_, indexDate) => (
          <Box px="3" py="2" borderWidth="2px" borderRadius="lg" width="100%" key={indexDate}>
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
              <InputTimeWidth indexDate={indexDate} isValidateTimeList={isValidateTimeList} />
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
