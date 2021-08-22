import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { eventState, attendeeVotesState } from 'src/atoms/eventState';
import { useRouter } from 'next/router';
import { database } from 'src/utils/firebase';
import {
  Button,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  VStack,
  Center,
} from '@chakra-ui/react';

export const InputSchedule = () => {
  //ボタンの色
  const [color, setColor] = useState('Red');
  //入力ボタンが選択されているかどうか
  const [redVarient, setRedVarient] = useState<'solid' | 'outline'>('solid');
  const [greenVarient, setGreenVarient] = useState<'solid' | 'outline'>('outline');
  const [blueVarient, setBlueVarient] = useState<'solid' | 'outline'>('outline');
  const [loading, setLoading] = useState(false);

  const event = useRecoilValue(eventState);
  const attendee = useRecoilValue(attendeeVotesState);

  const [possibleDates, setPossibleDates] = useState<{ date: string; vote: '○' | '△' | '×' }[]>(
    !attendee.votes.length
      ? event.prospectiveDates.map((date) => {
          return {
            date: date,
            vote: '△',
          };
        })
      : event.prospectiveDates.map((date, i) => {
          return {
            date: date,
            vote: attendee.votes[i],
          };
        }),
  );

  const [buttonColors, setButtonColors] = useState([]);

  const router = useRouter();

  const checkColor = (vote: '○' | '△' | '×') => {
    switch (vote) {
      case '○':
        return 'red';
      case '△':
        return 'green';
      case '×':
        return 'blue';
    }
  };

  const onSelectVote = (targetDate: string, selectedVote: '○' | '△' | '×') => {
    const newPossibleDates = possibleDates.map((possibleDate) => {
      return possibleDate.date === targetDate
        ? { ...possibleDate, vote: selectedVote }
        : possibleDate;
    });
    setPossibleDates(newPossibleDates);
  };

  const handleClickRed = () => {
    if (color !== 'Red') {
      setRedVarient('solid');
      setGreenVarient('outline');
      setBlueVarient('outline');
      setColor('Red');
    }
  };

  const handleClickGreen = () => {
    if (color !== 'Green') {
      setRedVarient('outline');
      setGreenVarient('solid');
      setBlueVarient('outline');
      setColor('Green');
    }
  };

  const handleClickBlue = () => {
    if (color !== 'Blue') {
      setRedVarient('outline');
      setGreenVarient('outline');
      setBlueVarient('solid');
      setColor('Blue');
    }
  };

  const handleClickChange = (possibleDate: { date: string }) => {
    switch (color) {
      case 'Red':
        onSelectVote(possibleDate.date, '○');
        break;
      case 'Green':
        onSelectVote(possibleDate.date, '△');
        break;
      case 'Blue':
        onSelectVote(possibleDate.date, '×');
        break;
      default:
      // do nothing
    }
  };

  const registerAttendances = async () => {
    setLoading(true);
    const votes = possibleDates.map((possibleDate) => possibleDate.vote);
    const attendeeData = {
      userId: attendee.userId,
      name: attendee.name,
      votes: votes,
      profileImg: attendee.profileImg,
    };

    await database
      .ref(`events/${event.eventId}/attendeeVotes/${attendeeData.userId}`)
      .set(attendeeData);

    router.push(`/event/${event.eventId}`);
  };

  return (
    <Box p="3">
      <Box overflowX="scroll" pb="36">
        <Table variant="unstyled">
          <Thead>
            <Tr>
              {event.dates.map((date) => (
                <Th key={date}>
                  <Center>{date}</Center>
                </Th>
              ))}
            </Tr>
          </Thead>
          {event.times.map((time, i) => (
            <Tr key={time}>
              {event.dates.map((date, j) => (
                <Th key={date} px="3" py="2">
                  <Center>
                    <Button
                      sx={{
                        '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
                        _focus: { boxShadow: 'none', outline: 'none' },
                      }}
                      colorScheme={checkColor(possibleDates[j * event.times.length + i].vote)}
                      onClick={() => handleClickChange(possibleDates[j * event.times.length + i])}
                    >
                      {time}
                    </Button>
                  </Center>
                </Th>
              ))}
            </Tr>
          ))}
        </Table>
      </Box>
      <Center>
        <VStack pos="fixed" bottom="0" bg="white" w="100%">
          <HStack p="4" spacing={4}>
            <Button
              sx={{
                '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
                _focus: { boxShadow: 'none', outline: 'none' },
              }}
              variant={redVarient}
              colorScheme="red"
              w="24"
              onClick={() => handleClickRed()}
            >
              ○
            </Button>
            <Button
              sx={{
                '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
                _focus: { boxShadow: 'none', outline: 'none' },
              }}
              variant={greenVarient}
              colorScheme="green"
              w="24"
              onClick={() => handleClickGreen()}
            >
              △
            </Button>
            <Button
              sx={{ '-webkit-tap-highlight-color': 'rgba(0,0,0,0)', _focus: { boxShadow: 'none' } }}
              variant={blueVarient}
              colorScheme="blue"
              w="24"
              onClick={() => handleClickBlue()}
            >
              ×
            </Button>
          </HStack>
          <Box pb="4">
            {loading ? (
              <Button
                sx={{
                  '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
                  _focus: { boxShadow: 'none', outline: 'none' },
                }}
                isLoading
              >
                出欠を回答する
              </Button>
            ) : (
              <Button
                sx={{
                  '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
                  _focus: { boxShadow: 'none', outline: 'none' },
                }}
                onClick={() => registerAttendances()}
              >
                出欠を回答する
              </Button>
            )}
          </Box>
        </VStack>
      </Center>
    </Box>
  );
};
export default InputSchedule;
