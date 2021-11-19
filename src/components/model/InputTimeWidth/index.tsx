import { useRecoilState } from 'recoil';
import { candidateDateState } from 'src/atoms/eventState';
import {
  Box,
  Button,
  CloseButton,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import 'react-day-picker/lib/style.css';
import { cloneDeep } from 'lodash';

type Props = {
  indexDate: number;
  isValidateTimeList: boolean[];
};

export const InputTimeWidth = ({ indexDate, isValidateTimeList }: Props) => {
  const [candidateDates, setCandidateDates] = useRecoilState(candidateDateState);

  const onDeleteTimeWidth = (indexDate: number, indexWidth: number) => {
    const newCandidateDates = cloneDeep(candidateDates);
    newCandidateDates[indexDate].timeWidth.splice(indexWidth, 1);
    setCandidateDates(newCandidateDates);
  };

  const onChangeTimeWidth = (key: string, value: string, indexDate: number, indexWidth: number) => {
    const currentTimeWidth = candidateDates[indexDate].timeWidth[indexWidth];
    const newTimeWidth = { ...currentTimeWidth, [key]: value };
    const newState = cloneDeep(candidateDates);
    newState[indexDate].timeWidth[indexWidth] = newTimeWidth;
    setCandidateDates(newState);
  };

  const addTimeWidths = (indexDate: number) => {
    const lastTimeWidth =
      candidateDates[indexDate].timeWidth[candidateDates[indexDate].timeWidth.length - 1];
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
      ...candidateDates[indexDate].timeWidth,
      {
        start: newStartTIme,
        end: newEndTime,
      },
    ];
    const newState = cloneDeep(candidateDates);
    newState[indexDate].timeWidth = newTimeWidth;
    setCandidateDates(newState);
  };
  return (
    <FormControl isRequired>
      <Box py="1">
        <FormLabel fontWeight="bold" fontSize="sm" pb="1">
          時間帯
        </FormLabel>
      </Box>
      <VStack>
        {candidateDates[indexDate].timeWidth.map((timeWidth, indexWidth) => (
          <HStack key={indexWidth} pb="1">
            <CloseButton
              size="sm"
              sx={{
                WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                _focus: { boxShadow: 'none' },
              }}
              onClick={() => onDeleteTimeWidth(indexDate, indexWidth)}
              visibility={candidateDates[indexDate].timeWidth.length >= 2 ? 'visible' : 'hidden'}
            />
            <Box
              borderWidth="1px"
              borderRadius="lg"
              width="100px"
              position="relative"
              borderColor={
                timeWidth.start >= timeWidth.end || timeWidth.start === '' || timeWidth.end === ''
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
                onChange={(e) => onChangeTimeWidth('start', e.target.value, indexDate, indexWidth)}
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
                  timeWidth.start >= timeWidth.end || timeWidth.start === '' || timeWidth.end === ''
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
                  onChange={(e) => onChangeTimeWidth('end', e.target.value, indexDate, indexWidth)}
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
          disabled={isValidateTimeList[indexDate]}
        >
          +
        </Button>
      </VStack>
    </FormControl>
  );
};
