import { useState, useEffect, useLayoutEffect } from 'react';
import { eventState } from 'src/atoms/eventState';
import { Avatar } from '@chakra-ui/react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Center,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Box,
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

type Count = {
  date: Date;
  positiveCount: number;
  evenCount: number;
  negativeCount: number;
};

export const AttendanceTable = () => {
  const event = useRecoilValue(eventState);
  const [counts, setCounts] = useState<Count[]>([]);
  const [colours, setColours] = useState<string[]>([]);

  useEffect(() => {
    if (!event) return;

    const attendanceCounts = event.possibleDates.map((possibleDate) => {
      return {
        date: possibleDate.date,
        positiveCount:
          possibleDate.votes !== undefined
            ? possibleDate.votes.filter((_vote) => _vote.vote === '○').length
            : 0,
        evenCount:
          possibleDate.votes !== undefined
            ? possibleDate.votes.filter((_vote) => _vote.vote === '△').length
            : 0,
        negativeCount:
          possibleDate.votes !== undefined
            ? possibleDate.votes.filter((_vote) => _vote.vote === '×').length
            : 0,
      };
    });
    setCounts(attendanceCounts);

    const scores = attendanceCounts.map((count) => {
      return count.positiveCount * 3 + count.evenCount * 2;
    });
    const max = Math.max(...scores);
    const evaluations = scores.map((score) => {
      return score === max && score > 0 ? 'green.100' : 'white';
    });
    setCounts(attendanceCounts);
    setColours(evaluations);

    // TODO: 候補日編集機能をつける場合は投票した人を格納する変数がいる
  }, [event]);

  return (
    <>
      <Box overflowX="scroll">
        <Table size="sm" borderWidth="2px">
          <Thead>
            <Tr h="50px">
              <Th fontSize="md" w="100px" px="0">
                <Center w="100px">日程</Center>
              </Th>
              <Th fontSize="md">
                <Center>○</Center>
              </Th>
              <Th fontSize="md">
                <Center>△</Center>
              </Th>
              <Th fontSize="md">
                <Center>×</Center>
              </Th>
              {event
                ? event.participants
                    .filter((participant) => participant.isVote)
                    .map((participant, i) => (
                      <Th key={i} p="2">
                        <Popover placement="top">
                          <PopoverTrigger>
                            <Center>
                              <Avatar src={participant.user.profileImg} size="sm" />
                            </Center>
                          </PopoverTrigger>
                          <PopoverContent
                            w="auto"
                            sx={{ _focus: { boxShadow: 'none', outline: 'none' } }}
                            fontWeight="bold"
                            color="gray.600"
                            fontSize="xs"
                            textTransform="none"
                          >
                            <PopoverArrow />
                            <PopoverBody>{participant.user.name}</PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Th>
                    ))
                : null}
            </Tr>
          </Thead>
          <Tbody>
            {event && counts.length
              ? event.possibleDates.map((possibleDate, i) => (
                  <Tr key={i} bg={colours[i]}>
                    <Td pl="20px" pr="2px">
                      <Box>{possibleDate.dateString + '  ' + possibleDate.timeWidthString}</Box>
                    </Td>
                    <Td>
                      <Center>{counts[i].positiveCount}</Center>
                    </Td>
                    <Td>
                      <Center>{counts[i].evenCount}</Center>
                    </Td>
                    <Td>
                      <Center>{counts[i].negativeCount}</Center>
                    </Td>
                    {possibleDate.votes !== undefined &&
                      possibleDate.votes.map((_vote, index) => (
                        <Td key={index}>
                          <Center>{_vote.vote}</Center>
                        </Td>
                      ))}
                  </Tr>
                ))
              : null}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};
