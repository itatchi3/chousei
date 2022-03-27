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
import { useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { EventType, tableWidthState } from 'src/atoms/eventState';
import { Count } from 'src/components/EventDetail/EventDetail';

type Props = {
  event: EventType;
  counts: Count[];
  colors: string[];
};

export const AttendanceTable = ({ event, counts, colors }: Props) => {
  const table = useRef<HTMLTableElement>(null);
  const setTableWidth = useSetRecoilState(tableWidthState);
  const [isOpenArray, setIsOpenArray] = useState<boolean[]>([]);
  useEffect(() => {
    if (!table.current) return;
    setTableWidth(table.current.getBoundingClientRect().width);
  }, [setTableWidth]);

  useEffect(() => {
    if (!event) return;
    setIsOpenArray(
      Array(event.participants.filter((participant) => participant.isVote).length).fill(false),
    );
  }, [event]);

  const triggerPopOver = (index: number) => {
    const newIsOpen = [...isOpenArray];
    newIsOpen[index] = true;
    setIsOpenArray(newIsOpen);
  };

  return (
    <Table size="sm" borderWidth="1px" ref={table}>
      <Thead>
        <Tr>
          <Th
            px="2"
            py="1"
            fontSize="md"
            position="sticky"
            top="0"
            zIndex="1"
            bgColor="white"
            _before={{
              position: 'absolute',
              top: '-0.5px',
              left: '-0.5px',
              width: 'calc(100% + 1px)',
              height: 'calc(100% + 1px)',
              content: '""',
              borderWidth: '0.5px 0',
            }}
          >
            <Center h="32px">日程</Center>
          </Th>
          <Th
            px="2"
            py="1"
            fontSize="md"
            position="sticky"
            top="0"
            zIndex="1"
            bgColor="white"
            _before={{
              position: 'absolute',
              top: '-0.5px',
              left: '-0.5px',
              width: 'calc(100% + 1px)',
              height: 'calc(100% + 1px)',
              content: '""',
              borderWidth: '0.5px 0',
            }}
          >
            <Center h="32px">○</Center>
          </Th>
          <Th
            px="2"
            py="1"
            fontSize="md"
            position="sticky"
            top="0"
            zIndex="1"
            bgColor="white"
            _before={{
              position: 'absolute',
              top: '-0.5px',
              left: '-0.5px',
              width: 'calc(100% + 1px)',
              height: 'calc(100% + 1px)',
              content: '""',
              borderWidth: '0.5px 0',
            }}
          >
            <Center h="32px">△</Center>
          </Th>
          <Th
            px="0"
            py="1"
            fontSize="md"
            position="sticky"
            top="0"
            zIndex="1"
            bgColor="white"
            _before={{
              position: 'absolute',
              top: '-0.5px',
              left: '-0.5px',
              width: 'calc(100% + 1px)',
              height: 'calc(100% + 1px)',
              content: '""',
              borderWidth: '0.5px 0',
            }}
          >
            <Center h="32px">×</Center>
          </Th>
          {event
            ? event.participants
                .filter((participant) => participant.isVote)
                .map((participant, i) => (
                  <Th
                    p="1"
                    key={i}
                    position="sticky"
                    top="0"
                    zIndex="1"
                    bgColor="white"
                    _before={{
                      position: 'absolute',
                      top: '-0.5px',
                      left: '-0.5px',
                      width: 'calc(100% + 1px)',
                      height: 'calc(100% + 1px)',
                      content: '""',
                      borderWidth: '0.5px 0',
                    }}
                  >
                    <Popover
                      onOpen={() => triggerPopOver(i)}
                      // onClose={() => triggerPopOver(i)}
                      eventListeners={false}
                    >
                      <Center>
                        <PopoverTrigger>
                          <Avatar
                            src={participant.user.profileImg}
                            size="sm"
                            name={participant.user.name}
                          />
                        </PopoverTrigger>
                      </Center>
                      <PopoverContent
                        w={isOpenArray[i] ? 'auto' : '32px'}
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
                <Td px="2" py="1">
                  <Center>
                    <Box>
                      <Box>{possibleDate.dateString}</Box>
                      <Box>{possibleDate.timeWidthString}</Box>
                    </Box>
                  </Center>
                </Td>
                <Td px="0" py="1">
                  <Center minW="32px">{counts[i].positiveCount}</Center>
                </Td>
                <Td px="0" py="1">
                  <Center minW="32px">{counts[i].evenCount}</Center>
                </Td>
                <Td px="0" py="1">
                  <Center minW="32px">{counts[i].negativeCount}</Center>
                </Td>
                {event.participants
                  .filter((participant) => participant.isVote)
                  .map((participant) => {
                    return (
                      <Td key={possibleDate.id + participant.userId} px="0">
                        {possibleDate.votes.map((_vote) => {
                          if (_vote.userId === participant.userId) {
                            return <Center key={_vote.userId}>{_vote.vote}</Center>;
                          }
                        })}
                      </Td>
                    );
                  })}
              </Tr>
            ))
          : null}
      </Tbody>
    </Table>
  );
};
