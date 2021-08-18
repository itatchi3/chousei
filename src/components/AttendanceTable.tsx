// import "../assets/styles/AttendanceTable.css";
import React from 'react';
// import Table from '@material-ui/core/Table';
import { AttendeeType } from 'src/atoms/eventState';
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

type Props = {
  columns: string[];
  attendees: AttendeeType[];
};

const AttendanceTable = (props: Props) => {
  if (!props.columns) {
    return <></>;
  }
  const attendanceCounts = props.columns.map((column, i) => {
    return {
      date: column,
      positiveCounts: props.attendees.filter((attendee) => attendee.votes[i] === '○').length,
      evenCounts: props.attendees.filter((attendee) => attendee.votes[i] === '△').length,
      negativeCounts: props.attendees.filter((attendee) => attendee.votes[i] === '×').length,
    };
  });

  return (
    <>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>日程</Th>
            <Th>
              <Center>○</Center>
            </Th>
            <Th>
              <Center>△</Center>
            </Th>
            <Th>
              <Center>×</Center>
            </Th>
            {props.attendees.map((atendee, i) => (
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
                <Center>{props.columns[i]}</Center>
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
              {props.attendees.map((atendee, index) => (
                <Td key={index}>
                  <Center>{atendee.votes[i]}</Center>
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Table>
        <Thead>
          <Tr>
            <Th size="small">コメント</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.attendees.map(
            (atendee, i) =>
              atendee.comment !== '' && (
                <Tr key={i}>
                  <Th component="th" scope="row">
                    {atendee.name}
                  </Th>
                  <Th align="center">{atendee.comment}</Th>
                </Tr>
              ),
          )}
        </Tbody>
      </Table>
    </>
  );
};

export default AttendanceTable;
