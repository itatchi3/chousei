import { useRecoilState } from 'recoil';
import {
  candidateDateState,
  isValidateDateState,
  isValidateTimeListState,
} from 'src/atoms/eventState';
import { Box, Button, Circle, CloseButton, Flex, Text, VStack } from '@chakra-ui/react';
import 'react-day-picker/lib/style.css';
import { useEffect } from 'react';
import { cloneDeep } from 'lodash';
import { InputDate } from 'src/components/model/InputDate';
import { InputTimeWidth } from 'src/components/model/InputTimeWidth';

export const InputDates = () => {
  const [candidateDates, setCandidateDates] = useRecoilState(candidateDateState);
  const [isValidateDate, setIsValidateDate] = useRecoilState(isValidateDateState);
  const [isValidateTimeList, setIsValidateTimeList] = useRecoilState(isValidateTimeListState);
  const addCandidateDate = () => {
    setCandidateDates([
      ...candidateDates,
      {
        date: [],
        dateString: '',
        timeWidth: [{ start: '12:00', end: '13:00' }],
      },
    ]);
    setIsValidateTimeList([...isValidateTimeList, false]);
  };

  const onDeleteDate = (indexDate: number) => {
    const newCandidateDates = cloneDeep(candidateDates);
    newCandidateDates.splice(indexDate, 1);
    setCandidateDates(newCandidateDates);
  };

  useEffect(() => {
    let validateDate = false;
    let validateTimeList = Array(candidateDates.length).fill(false);
    candidateDates.map((candidateDate, indexDate) => {
      if (candidateDate.date.length === 0) {
        validateDate = true;
      }
      candidateDate.timeWidth.map((timeWidth) => {
        if (timeWidth.start >= timeWidth.end) {
          validateTimeList[indexDate] = true;
        }
      });
    });
    setIsValidateDate(validateDate);
    setIsValidateTimeList(validateTimeList);
  }, [candidateDates, setIsValidateDate, setIsValidateTimeList]);

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
        {candidateDates.map((_, indexDate) => (
          <Box px="3" py="2" borderWidth="2px" borderRadius="lg" width="100%" key={indexDate}>
            <Flex justifyContent="flex-end" mb="-6">
              <CloseButton
                sx={{
                  WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                  _focus: { boxShadow: 'none' },
                }}
                onClick={() => onDeleteDate(indexDate)}
                visibility={candidateDates.length >= 2 ? 'visible' : 'hidden'}
              />
            </Flex>
            <InputDate indexDate={indexDate} />
            <Box pt="3">
              <InputTimeWidth indexDate={indexDate} isValidateTimeList={isValidateTimeList} />
            </Box>
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
    </>
  );
};
