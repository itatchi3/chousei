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
import { EventType } from 'src/atoms/eventState';

type Count = {
  date: Date;
  positiveCount: number;
  evenCount: number;
  negativeCount: number;
};

type Props = {
  event: EventType;
  counts: Count[];
  colors: string[];
};

export const AttendanceTable = ({ event, counts, colors }: Props) => {
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
                  <Tr key={i} bg={colors[i]}>
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
