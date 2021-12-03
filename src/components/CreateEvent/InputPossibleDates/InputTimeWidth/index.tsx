import { useRecoilState } from 'recoil';
import { possibleDateState } from 'src/atoms/eventState';
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
  const [possibleDates, setPossibleDates] = useRecoilState(possibleDateState);

  const onDeleteTimeWidth = (indexDate: number, indexWidth: number) => {
    const newPossibleDates = cloneDeep(possibleDates);
    newPossibleDates[indexDate].timeWidth.splice(indexWidth, 1);
    setPossibleDates(newPossibleDates);
  };

  const onChangeTimeWidth = (key: string, value: string, indexDate: number, indexWidth: number) => {
    const currentTimeWidth = possibleDates[indexDate].timeWidth[indexWidth];
    const newTimeWidth = { ...currentTimeWidth, [key]: value };
    const newState = cloneDeep(possibleDates);
    newState[indexDate].timeWidth[indexWidth] = newTimeWidth;
    setPossibleDates(newState);
  };

  const addTimeWidths = (indexDate: number) => {
    const lastTimeWidth =
      possibleDates[indexDate].timeWidth[possibleDates[indexDate].timeWidth.length - 1];
    console.log(lastTimeWidth);
    const [startHour, startMin] = lastTimeWidth.start.split(':').map(Number);
    const [endHour, endMin] = lastTimeWidth.end.split(':').map(Number);

    let minLength = endMin - startMin;
    let hourLength = endHour - startHour;
    if (minLength < 0) {
      hourLength -= 1;
      minLength += 60;
    }

    const newStartTIme = lastTimeWidth.end;
    let newEndTime = '';
    console.log(endMin + minLength);
    console.log(('00' + (endMin + minLength)).slice(-2));

    if (endMin + minLength < 60) {
      newEndTime = `${('00' + (endHour + hourLength)).slice(-2)}:${(
        '00' +
        (endMin + minLength)
      ).slice(-2)}`;
    } else {
      newEndTime = `${('00' + (endHour + hourLength + 1)).slice(-2)}:${(
        '00' +
        (endMin + minLength - 60)
      ).slice(-2)}`;
    }

    if (newEndTime.split(':').map(Number)[0] >= 24) {
      newEndTime = '23:59';
    }

    const newTimeWidth = [
      ...possibleDates[indexDate].timeWidth,
      {
        start: newStartTIme,
        end: newEndTime,
      },
    ];
    const newState = cloneDeep(possibleDates);
    newState[indexDate].timeWidth = newTimeWidth;
    setPossibleDates(newState);
  };
  return (
    <FormControl isRequired>
      <Box py="1">
        <FormLabel fontWeight="bold" fontSize="sm" pb="1">
          時間帯
        </FormLabel>
      </Box>
      <VStack>
        {possibleDates[indexDate].timeWidth.map((timeWidth, indexWidth) => (
          <HStack key={indexWidth} pb="1">
            <CloseButton
              size="sm"
              onClick={() => onDeleteTimeWidth(indexDate, indexWidth)}
              visibility={possibleDates[indexDate].timeWidth.length >= 2 ? 'visible' : 'hidden'}
            />
            <Box
              borderWidth="1px"
              borderRadius="lg"
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
        <Button onClick={() => addTimeWidths(indexDate)} disabled={isValidateTimeList[indexDate]}>
          +
        </Button>
      </VStack>
    </FormControl>
  );
};
