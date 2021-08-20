// import "../assets/styles/AttendanceTable.css";
import React from 'react';
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

const AttendanceTable = () => {
  const event = useRecoilValue(eventState);
  if (!event.prospectiveDates) {
    return <></>;
  }
  const attendanceCounts = event.prospectiveDates.map((column, i) => {
    return {
      date: column,
      positiveCounts: event.attendeeVotes.filter((attendee) => attendee.votes[i] === '○').length,
      evenCounts: event.attendeeVotes.filter((attendee) => attendee.votes[i] === '△').length,
      negativeCounts: event.attendeeVotes.filter((attendee) => attendee.votes[i] === '×').length,
    };
  });

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
            {event.attendeeVotes.map((atendee, i) => (
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
          {attendanceCounts.map((count, i) => (
            <Tr key={i}>
              <Td>
                <Center>{event.prospectiveDates[i]}</Center>
              </Td>
              <Td>
                <Center>{count.positiveCounts}</Center>
              </Td>
              <Td>
                <Center>{count.evenCounts}</Center>
              </Td>
              <Td>
                <Center>{count.negativeCounts}</Center>
              </Td>
              {event.attendeeVotes.map((atendee, index) => (
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
          {event.attendeeComment.map(
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
