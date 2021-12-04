import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { eventState } from 'src/atoms/eventState';
import { useRouter } from 'next/router';
import { Button, Box, HStack, VStack, Center, Flex } from '@chakra-ui/react';
import FullCalendar, { EventClickArg } from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { cloneDeep } from 'lodash';
import { useLiff } from 'src/liff/auth';

type EventFullCalendar = {
  start: Date;
  end: Date;
  id: string;
  color: string;
};

export const InputSchedule = () => {
  const [color, setColor] = useState('Red');
  const [redVarient, setRedVarient] = useState<'solid' | 'outline'>('solid');
  const [greenVarient, setGreenVarient] = useState<'solid' | 'outline'>('outline');
  const [blueVarient, setBlueVarient] = useState<'solid' | 'outline'>('outline');
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState<Date[]>([]);
  const [dateStrings, setDateStrings] = useState<string[]>([]);
  const [eventFullCalendar, setEventFullCalendar] = useState<EventFullCalendar[]>([]);
  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(24);
  const [viewTimeList, setViewTimeList] = useState<number[]>([]);

  const event = useRecoilValue(eventState);
  const { userId, idToken } = useLiff();
  const [voteList, setVoteList] = useState<{ id: number; vote: string }[]>();
  const [firstVoteList, setFirstVoteList] = useState<{ id: number; vote: string }[]>();

  const router = useRouter();

  const hiddenDate = [];

  const checkColor = (vote: string) => {
    switch (vote) {
      case '○':
        return '#C53030';
      case '△':
        return '#2F855A';
      case '×':
        return '#3182CE';
      default:
        return '#000000';
    }
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

  const onClickVoteChange = (arg: EventClickArg) => {
    if (!voteList) return;
    const index = Number(arg.event.id);
    const newVoteList = cloneDeep(voteList);
    const newEventFullCalendar = cloneDeep(eventFullCalendar);
    let newVote: '○' | '△' | '×' = '△';
    switch (color) {
      case 'Red':
        newVote = '○';
        break;
      case 'Green':
        newVote = '△';
        break;
      case 'Blue':
        newVote = '×';
        break;
      default:
      // do nothing
    }
    newVoteList[index].vote = newVote;
    setVoteList(newVoteList);
    eventFullCalendar.map((event, indexEvent) => {
      if (event.id === arg.event.id) {
        newEventFullCalendar[indexEvent].color = checkColor(newVote);
      }
    });
    setEventFullCalendar(newEventFullCalendar);
  };

  const registerAttendances = async () => {
    if (!event) return;
    setLoading(true);
    try {
      const body = {
        voteList: voteList,
        eventId: event.id,
        idToken: idToken,
      };

      const res = await fetch(`/api/updateVote`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const json: { ok?: boolean; error?: string } = await res.json();
      if (!json.ok) {
        throw json.error;
      }
      router.push(`/event/${event.id}`);
    } catch (error) {
      alert(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!event || !firstVoteList) return;
    let dateList: Date[] = [event.possibleDates[0].date];
    let dateStringList: string[] = [event.possibleDates[0].dateString];
    let eventFullCalendar: EventFullCalendar[] = [];
    let newMinTime = 24;
    let newMaxTime = 0;
    let minutesWhenMaxTime = 0;

    event.possibleDates.map((possibleDate, index) => {
      if (possibleDate.startTime.getHours() < newMinTime) {
        newMinTime = possibleDate.startTime.getHours();
      }
      if (possibleDate.endTime.getHours() >= newMaxTime) {
        newMaxTime = possibleDate.endTime.getHours();
        if (possibleDate.endTime.getMinutes()) {
          minutesWhenMaxTime = possibleDate.endTime.getMinutes();
        }
      }
      eventFullCalendar.push({
        start: possibleDate.startTime,
        end: possibleDate.endTime,
        id: index.toString(),
        color: checkColor(firstVoteList[index].vote),
      });
      // if (dateStringList.includes(possibleDate.dateString)) {
      //   eventFullCalendar.push({
      //     start: possibleDate.startTime,
      //     end: possibleDate.endTime,
      //     id: index.toString(),
      //     color: checkColor(firstVoteList[index].vote),
      //   });
      // } else {
      //   eventFullCalendarList.push(eventFullCalendar);
      //   dateList.push(possibleDate.date);
      //   dateStringList.push(possibleDate.dateString);
      //   eventFullCalendar = [
      //     {
      //       start: possibleDate.startTime,
      //       end: possibleDate.endTime,
      //       id: index.toString(),
      //       color: checkColor(firstVoteList[index].vote),
      //     },
      //   ];
      // }
    });
    // if (eventFullCalendar.length) {
    //   eventFullCalendarList.push(eventFullCalendar);
    // }
    setDates(dateList);
    setDateStrings(dateStringList);
    setEventFullCalendar(eventFullCalendar);
    // setEventFullCalendarList(eventFullCalendarList);
    setMinTime(newMinTime);
    if (minutesWhenMaxTime) {
      newMaxTime += 1;
    }
    setMaxTime(newMaxTime);
    let newTimeList: number[] = [];
    for (let i = newMinTime; i <= newMaxTime; i++) {
      newTimeList.push(i);
    }
    setViewTimeList(newTimeList);
  }, [event, firstVoteList]);

  useEffect(() => {
    if (!event) return;
    let voteList: { id: number; vote: string }[] = [];
    event.possibleDates.map((possibleDate) => {
      let userVote = { id: possibleDate.id, vote: '△' };
      possibleDate.votes.map((vote) => {
        if (vote.userId === userId) {
          userVote = { id: possibleDate.id, vote: vote.vote };
        }
      });
      voteList.push(userVote);
    });
    setVoteList(voteList);
    setFirstVoteList(voteList);
  }, [event, userId]);

  return (
    <Box p="3">
      <Flex height={window.innerHeight - 150} overflow="scroll">
        <VStack pt="4" pr="2">
          {viewTimeList.map((viewTime) => (
            <Box key={viewTime} fontSize="xs" pb="6">
              {viewTime + ':00'}
            </Box>
          ))}
        </VStack>
        <FullCalendar
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          headerToolbar={false}
          allDaySlot={false}
          contentHeight={'auto'}
          // initialDate={new Date(eventFullCalendarList[0][0].)}
          events={eventFullCalendar}
          slotEventOverlap={false}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }}
          eventClick={(arg) => onClickVoteChange(arg)}
          slotMinTime={minTime + ':00:00'}
          slotMaxTime={maxTime + ':00:00'}
        />

        {/* {dates.map((date, index) => {
          return (
            <Box minWidth="100px" key={index}>
              <Center fontWeight="bold">{dateStrings[index]}</Center>
              <FullCalendar
                plugins={[timeGridPlugin]}
                initialView="timeGridWeek"
                headerToolbar={false}
                allDaySlot={false}
                contentHeight={'auto'}
                initialDate={new Date(date)}
                events={eventFullCalendarList[index]}
                slotEventOverlap={false}
                eventTimeFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                }}
                eventClick={(arg) => onClickVoteChange(arg, index)}
                slotMinTime={minTime + ':00:00'}
                slotMaxTime={maxTime + ':00:00'}
              />
            </Box>
          );
        })} */}
        {dates.length >= 4 && (
          <VStack pt="4" pl="2">
            {viewTimeList.map((viewTime) => (
              <Box key={viewTime} fontSize="xs" pb="6">
                {viewTime + ':00'}
              </Box>
            ))}
          </VStack>
        )}
        {/* 
        <style jsx>{`
          .fc-timegrid-slot-label,
          thead {
            display: none !important;
          }
          .fc-timegrid-event .fc-event-time {
            white-space: normal;
            font-size: 10px;
          }
          .fc-timegrid-slot {
            background-color: white;
          }
        `}</style> */}

        {/* {hiddenDate.map((date, index) => {
          return (
            <style jsx global key={index}>
              {`
                [data-date='${date}'] {
                  display: none !important;
                }
                ,
                .fc-timegrid-slot-label,
                thead {
                  display: none !important;
                }
                .fc-timegrid-event .fc-event-time {
                  white-space: normal;
                  font-size: 10px;
                }
                .fc-timegrid-slot {
                  background-color: white;
                }
              `}
            </style>
          );
        })} */}
      </Flex>
      <Center>
        <VStack pos="fixed" bottom="0" bg="white" w="100%">
          <HStack p="4" spacing={4}>
            <Button variant={redVarient} colorScheme="red" w="24" onClick={() => handleClickRed()}>
              ○
            </Button>
            <Button
              variant={greenVarient}
              colorScheme="green"
              w="24"
              onClick={() => handleClickGreen()}
            >
              △
            </Button>
            <Button
              variant={blueVarient}
              colorScheme="blue"
              w="24"
              onClick={() => handleClickBlue()}
            >
              ×
            </Button>
          </HStack>
          <Box pb="4">
            <Button onClick={() => registerAttendances()} isLoading={loading}>
              出欠を回答する
            </Button>
          </Box>
        </VStack>
      </Center>
    </Box>
  );
};
