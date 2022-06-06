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
import { tableWidthState } from 'src/atoms/eventState';
import { Event, Counts, Colors, useEventDetailQuery } from 'src/hooks/useEventDetail';

export const AttendanceTable = () => {
  const { data: eventDetail } = useEventDetailQuery();
  const table = useRef<HTMLTableElement>(null);
  const setTableWidth = useSetRecoilState(tableWidthState);
  const [isOpenArray, setIsOpenArray] = useState<boolean[]>([]);

  useEffect(() => {
    if (!table.current) return;
    setTableWidth(table.current.getBoundingClientRect().width);
  }, [setTableWidth]);

  useEffect(() => {
    if (!eventDetail) return;
    setIsOpenArray(
      Array(eventDetail.event.participants.filter((participant) => participant.isVote).length).fill(
        false,
      ),
    );
  }, [eventDetail]);

  const triggerPopOver = (index: number) => {
    const newIsOpen = [...isOpenArray];
    newIsOpen[index] = true;
    setIsOpenArray(newIsOpen);
  };

  return (
    <Table size="sm" borderWidth="1px" ref={table}>
      <Thead>
        <Tr h="50px">
          <Th
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
            <Center>
              <Center h="32px" w="16px">
                ○
              </Center>
            </Center>
          </Th>
          <Th
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
            <Center>
              <Center h="32px" w="16px">
                △
              </Center>
            </Center>
          </Th>
          <Th
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
            <Center>
              <Center h="32px" w="16px">
                ×
              </Center>
            </Center>
          </Th>
          {eventDetail
            ? eventDetail.event.participants
                .filter((participant) => participant.isVote)
                .map((participant, i) => (
                  <Th
                    px="2"
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
                    <Popover onOpen={() => triggerPopOver(i)} eventListeners={false}>
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
        {eventDetail && eventDetail.counts.length
          ? eventDetail.event.possibleDates.map((possibleDate, i) => (
              <Tr key={i} bg={eventDetail.colors[i]}>
                <Td>
                  <Center>
                    <Box>
                      <Box>{possibleDate.dateString}</Box>
                      <Box>{possibleDate.timeWidthString}</Box>
                    </Box>
                  </Center>
                </Td>
                <Td px="0">
                  <Center> {eventDetail.counts[i].positiveCount}</Center>
                </Td>
                <Td px="0">
                  <Center>{eventDetail.counts[i].evenCount}</Center>
                </Td>
                <Td px="0">
                  <Center>{eventDetail.counts[i].negativeCount}</Center>
                </Td>
                {eventDetail.event.participants
                  .filter((participant) => participant.isVote)
                  .map((participant) => {
                    return (
                      <Td key={possibleDate.id + participant.userId}>
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
