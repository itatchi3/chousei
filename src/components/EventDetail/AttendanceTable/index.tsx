// import "../assets/styles/AttendanceTable.css";
import { useState, useEffect } from 'react';
// import Table from '@material-ui/core/Table';
import { AttendeeVotesType, eventState } from 'src/atoms/eventState';
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
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

type Count = {
  date: string;
  positiveCount: number;
  evenCount: number;
  negativeCount: number;
};

const AttendanceTable = () => {
  const event = useRecoilValue(eventState);
  const [counts, setCounts] = useState<Count[]>([]);
  const [colours, setColours] = useState<string[]>([]);

  useEffect(() => {
    const attendanceCounts = event.prospectiveDates.map((column, i) => {
      return {
        date: column,
        positiveCount:
          event.attendeeVotes !== undefined
            ? event.attendeeVotes.filter((attendee) => attendee.votes[i] === '○').length
            : 0,
        evenCount:
          event.attendeeVotes !== undefined
            ? event.attendeeVotes.filter((attendee) => attendee.votes[i] === '△').length
            : 0,
        negativeCount:
          event.attendeeVotes !== undefined
            ? event.attendeeVotes.filter((attendee) => attendee.votes[i] === '×').length
            : 0,
      };
    });
    setCounts(attendanceCounts);
    if (event.attendeeVotes === undefined) {
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
  }, [event.attendeeVotes, event.prospectiveDates]);

  return (
    <>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>
              <Center>日程</Center>
            </Th>
            <Th>
              <Center>○</Center>
            </Th>
            <Th>
              <Center>△</Center>
            </Th>
            <Th>
              <Center>×</Center>
            </Th>
            {event.attendeeVotes !== undefined &&
              event.attendeeVotes.map((atendee, i) => (
                <Th key={i} p="2">
                  <Popover placement="top">
                    <PopoverTrigger>
                      <Center>
                        <Avatar src={atendee.profileImg} size="sm" />
                      </Center>
                    </PopoverTrigger>
                    <PopoverContent w="auto">
                      <PopoverArrow />
                      <PopoverBody>{atendee.name}</PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Th>
              ))}
          </Tr>
        </Thead>
        <Tbody>
          {counts.map((count, i) => (
            <Tr key={i} bg={colours[i]}>
              <Td>
                <Center>{event.prospectiveDates[i]}</Center>
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
              {event.attendeeVotes !== undefined &&
                event.attendeeVotes.map((atendee, index) => (
                  <Td key={index}>
                    <Center>{atendee.votes[i]}</Center>
                  </Td>
                ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Table>
        <Tr>
          <Th size="small">コメント</Th>
        </Tr>
      </Table>
      <Table>
        <Tbody>
          {event.attendeeComment !== undefined &&
            event.attendeeComment.map(
              (atendee, i) =>
                atendee.comment !== '' && (
                  <Tr key={i}>
                    <Td key={i} p="2" w="24">
                      <Popover placement="top">
                        <PopoverTrigger>
                          <Center>
                            <Avatar src={atendee.profileImg} size="sm" />
                          </Center>
                        </PopoverTrigger>
                        <PopoverContent w="auto">
                          <PopoverArrow />
                          <PopoverBody>{atendee.name}</PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Td>
                    <Td align="center">{atendee.comment}</Td>
                  </Tr>
                ),
            )}
        </Tbody>
      </Table>
    </>
  );
};

export default AttendanceTable;
