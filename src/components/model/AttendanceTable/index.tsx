import { useState, useEffect } from 'react';
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
  date: number;
  positiveCount: number;
  evenCount: number;
  negativeCount: number;
};

export const AttendanceTable = () => {
  const event = useRecoilValue(eventState);
  const [counts, setCounts] = useState<Count[]>([]);
  const [colours, setColours] = useState<string[]>([]);

  useEffect(() => {
    const attendanceCounts = event.candidateDates.map((column, i) => {
      return {
        date: column.date,
        positiveCount:
          event.respondentVoteLists !== undefined
            ? event.respondentVoteLists.filter((respondent) => respondent.voteList[i] === '○')
                .length
            : 0,
        evenCount:
          event.respondentVoteLists !== undefined
            ? event.respondentVoteLists.filter((respondent) => respondent.voteList[i] === '△')
                .length
            : 0,
        negativeCount:
          event.respondentVoteLists !== undefined
            ? event.respondentVoteLists.filter((respondent) => respondent.voteList[i] === '×')
                .length
            : 0,
      };
    });
    setCounts(attendanceCounts);
    if (event.respondentVoteLists === undefined) {
      return;
    }
    const scores = attendanceCounts.map((count) => {
      return count.positiveCount * 3 + count.evenCount * 2;
    });
    const max = Math.max(...scores);
    const evaluations = scores.map((score) => {
      return score === max ? 'green.100' : 'white';
    });
    setCounts(attendanceCounts);
    setColours(evaluations);
  }, [event.respondentVoteLists, event.candidateDates]);

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
              {event.respondentVoteLists !== undefined &&
                event.respondentVoteLists.map((respondent, i) => (
                  <Th key={i} p="2">
                    <Popover placement="top">
                      <PopoverTrigger>
                        <Center>
                          <Avatar src={respondent.profileImg} size="sm" />
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
                        <PopoverBody>{respondent.name}</PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Th>
                ))}
            </Tr>
          </Thead>
          <Tbody>
            {counts.map((count, i) => (
              <Tr key={i} bg={colours[i]}>
                <Td pl="20px" pr="2px">
                  <Box>
                    {event.candidateDates[i].dateString +
                      '  ' +
                      event.candidateDates[i].timeWidth.stringTimeWidth}
                  </Box>
                </Td>
                <Td>
                  <Center>{count.positiveCount}</Center>
                </Td>
                <Td>
                  <Center>{count.evenCount}</Center>
                </Td>
                <Td>
                  <Center>{count.negativeCount}</Center>
                </Td>
                {event.respondentVoteLists !== undefined &&
                  event.respondentVoteLists.map((respondent, index) => (
                    <Td key={index}>
                      <Center>{respondent.voteList[i]}</Center>
                    </Td>
                  ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};

export const CommentList = () => {
  const event = useRecoilValue(eventState);

  return (
    <>
      <Table>
        <Tbody>
          <Tr>
            <Th size="small">コメント</Th>
          </Tr>
        </Tbody>
      </Table>
      <Table>
        <Tbody>
          {event.respondentComments !== undefined &&
            event.respondentComments.map(
              (respondent, i) =>
                respondent.comment !== '' && (
                  <Tr key={i}>
                    <Td key={i} p="2" w="24">
                      <Popover placement="top">
                        <PopoverTrigger>
                          <Center>
                            <Avatar src={respondent.profileImg} size="sm" />
                          </Center>
                        </PopoverTrigger>
                        <PopoverContent
                          w="auto"
                          sx={{ _focus: { boxShadow: 'none', outline: 'none' } }}
                          fontWeight="bold"
                          color="gray.600"
                          fontSize="xs"
                        >
                          <PopoverArrow />
                          <PopoverBody>{respondent.name}</PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Td>
                    <Td align="center" pl="0">
                      {respondent.comment}
                    </Td>
                  </Tr>
                ),
            )}
        </Tbody>
      </Table>
    </>
  );
};
