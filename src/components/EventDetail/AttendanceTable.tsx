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
import { EventType } from 'src/atoms/eventState';
import { Count } from 'src/components/EventDetail/EventDetail';

type Props = {
  event: EventType;
  counts: Count[];
  colors: string[];
};

export const AttendanceTable = ({ event, counts, colors }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const table = useRef<HTMLDivElement>(null);
  const [tableWidth, setTableWidth] = useState(0);
  const [votedCount, setVotedCount] = useState(0);
  const tickingX = useRef<boolean>(false);
  const tickingY = useRef<boolean>(false);

  useEffect(() => {
    if (!scroll.current || !table.current || !ref.current || !event) return;
    let count = 0;
    event.participants.filter((participant) => participant.isVote).map(() => (count += 1));
    setVotedCount(count);

    const tableHeight = table.current.getBoundingClientRect().height;

    const stickyHeader = () => {
      if (!tickingY.current) {
        requestAnimationFrame(() => {
          tickingY.current = false;
          if (!scroll.current || !ref.current) return;
          const tableTop = scroll.current.getBoundingClientRect().top;

          if (tableTop >= -1.5) {
            ref.current.style.position = 'absolute';
            ref.current.style.top = '2px';
          } else if (tableTop < -tableHeight + 100) {
            ref.current.style.position = 'fixed';
            ref.current.style.top = `${tableHeight - 100 + tableTop}px`;
          } else {
            ref.current.style.position = 'fixed';
            ref.current.style.top = '0';
          }
        });
        tickingY.current = true;
      }
    };

    const horizontalScroll = () => {
      if (!tickingX.current) {
        requestAnimationFrame(() => {
          tickingX.current = false;
          if (!scroll.current || !ref.current || !table.current) return;
          const scrollLeft = scroll.current.scrollLeft;
          ref.current.style.left = `${-scrollLeft + 12}px`;
        });
        tickingX.current = true;
      }
    };

    const updateWindowWidth = () => {
      if (!table.current) return;
      setTableWidth(table.current.getBoundingClientRect().width);
    };

    window.addEventListener('scroll', stickyHeader, { passive: true });
    window.addEventListener('resize', updateWindowWidth);
    window.addEventListener('resize', stickyHeader);
    scroll.current.addEventListener('scroll', horizontalScroll, { passive: true });
    setTableWidth(table.current.getBoundingClientRect().width);

    return () => {
      window.removeEventListener('scroll', stickyHeader);
      window.removeEventListener('resize', updateWindowWidth);
      window.removeEventListener('resize', stickyHeader);
    };
  }, [event]);

  return (
    <Box position="relative" overflow="hidden">
      <Box ref={ref} zIndex="10" position="absolute" top="2px" left="12px">
        <Table size="sm" borderWidth="1px" w={`${tableWidth}px`}>
          <Tbody>
            <Tr bgColor="white" h="50px">
              <Th fontSize="md" w="90px">
                <Center w="90px">日程</Center>
              </Th>
              <Th fontSize="md" minW="50px">
                <Center>○</Center>
              </Th>
              <Th fontSize="md" minW="50px">
                <Center>△</Center>
              </Th>
              <Th fontSize="md" minW="50px">
                <Center>×</Center>
              </Th>
              {event
                ? event.participants
                    .filter((participant) => participant.isVote)
                    .map((participant, i) => (
                      <Th key={i} py="2" pr={i === votedCount - 1 ? '7px' : '2'} pl="2" minW="12">
                        <Popover eventListeners={false}>
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
          </Tbody>
        </Table>
      </Box>
      <Box ref={scroll} overflowX="scroll">
        <Box ref={table}>
          <Table
            size="sm"
            borderWidth="0 1px 0"
            ml="12px"
            position="relative"
            _after={{
              position: 'absolute',
              top: '0',
              left: '100%',
              height: '1px',
              width: '12px',
              content: '""',
            }}
            _before={{
              content: '""',
              width: '101%',
              height: '52px',
              background: 'white',
              position: 'absolute',
              top: '0',
              left: '-2px',
            }}
          >
            <Thead>
              <Tr h="52px">
                <Td w="90px">
                  <Box w="90px" />
                </Td>
              </Tr>
            </Thead>
            <Tbody>
              {event && counts.length
                ? event.possibleDates.map((possibleDate, i) => (
                    <Tr key={i} bg={colors[i]}>
                      <Td pl="5" pr="0">
                        <Center>
                          {possibleDate.dateString + '  ' + possibleDate.timeWidthString}
                        </Center>
                      </Td>
                      <Td minW="50px">
                        <Center>{counts[i].positiveCount}</Center>
                      </Td>
                      <Td minW="50px">
                        <Center>{counts[i].evenCount}</Center>
                      </Td>
                      <Td minW="50px">
                        <Center>{counts[i].negativeCount}</Center>
                      </Td>
                      {event.participants
                        .filter((participant) => participant.isVote)
                        .map((participant) => {
                          return (
                            <Td key={possibleDate.id + participant.userId} minW="12">
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
          <Box />
        </Box>
      </Box>
    </Box>
  );
};
