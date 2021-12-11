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
  const [hiddenDates, setHiddenDates] = useState<string[]>([]);
  const [dateWidth, setDateWidth] = useState(0);
  const [eventFullCalendar, setEventFullCalendar] = useState<EventFullCalendar[]>([]);
  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(24);
  const [viewTimeList, setViewTimeList] = useState<number[]>([]);

  const event = useRecoilValue(eventState);
  const { userId, idToken, isInClient } = useLiff();

  const [windowSize, setWindowSize] = useState(window.innerWidth - 120);

  const router = useRouter();

  const eventColor = {
    red: '#C53030',
    green: '#2F855A',
    blue: '#3182CE',
    gray: '#000000',
  };

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
    const newEventFullCalendar = cloneDeep(eventFullCalendar);
    let newEventColor = eventColor.green;
    switch (color) {
      case 'Red':
        newEventColor = eventColor.red;
        break;
      case 'Green':
        newEventColor = eventColor.green;
        break;
      case 'Blue':
        newEventColor = eventColor.blue;
        break;
      default:
        newEventColor = eventColor.gray;
        break;
    }

    newEventFullCalendar[Number(arg.event.id)].color = newEventColor;
    setEventFullCalendar(newEventFullCalendar);
  };

  const registerAttendances = async () => {
    if (!event) return;
    setLoading(true);
    const voteList = eventFullCalendar.map((eventFullCalendar, index) => {
      let vote = { id: event.possibleDates[index].id, vote: '' };
      switch (eventFullCalendar.color) {
        case eventColor.red:
          vote.vote = '○';
          break;
        case eventColor.green:
          vote.vote = '△';
          break;
        case eventColor.blue:
          vote.vote = '×';
          break;
        case eventColor.gray:
          vote.vote = '△';
        default:
        // do nothing
      }
      return vote;
    });

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
      console.error(error);
      setLoading(false);
    }
  };

  const fullCalendarStyle = () => {
    const numberOfDates = dates.length;
    let widthStyle = '';
    if ((isInClient && numberOfDates >= 4) || (!isInClient && windowSize <= 100 * numberOfDates)) {
      widthStyle = `.fc-scrollgrid, .fc-scrollgrid table {width: ${
        100 * numberOfDates
      }px !important;}`;
    }

    let hiddenStyle = '';
    hiddenDates.map((hiddenDate) => {
      hiddenStyle += `[data-date='${hiddenDate}'] {display: none !important}`;
    });
    return (
      <style jsx>
        {`
          ${widthStyle}
          ${hiddenStyle}
          .fc-scrollgrid thead {
            display: none !important;
          }
          .fc-timegrid-event .fc-event-time {
            white-space: normal;
            font-size: 10px;
          }
          .fc-day-today {
            background-color: white !important;
          }
          .fc-timegrid-slot-label {
            display: none !important;
          }
        `}
      </style>
    );
  };

  useEffect(() => {
    if (!event || !userId) return;
    let dateList: Date[] = [event.possibleDates[0].date];
    let dateStringList: string[] = [event.possibleDates[0].dateString];
    let dateTimeList: number[] = [event.possibleDates[0].date.getTime()];
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

      let userVote = '△';
      possibleDate.votes.map((vote) => {
        if (vote.userId === userId) {
          userVote = vote.vote;
        }
      });

      eventFullCalendar.push({
        start: possibleDate.startTime,
        end: possibleDate.endTime,
        id: index.toString(),
        color: checkColor(userVote),
      });
      if (!dateStringList.includes(possibleDate.dateString)) {
        dateList.push(possibleDate.date);
        dateStringList.push(possibleDate.dateString);
      }
      dateTimeList.push(possibleDate.date.getTime());
    });
    setDates(dateList);
    setDateStrings(dateStringList);
    setEventFullCalendar(eventFullCalendar);
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

    const dateWidth = (dateTimeList[dateTimeList.length - 1] - dateTimeList[0]) / 86400000;
    let hiddenDates: string[] = [];
    for (let i = 1; i < dateWidth; i++) {
      let date = cloneDeep(dateList[0]);
      date.setDate(date.getDate() + i);
      if (!dateTimeList.includes(date.getTime())) {
        const hiddenDate = date.toISOString().slice(0, 10);
        hiddenDates.push(hiddenDate);
      }
    }
    setDateWidth(dateWidth + 1);
    setHiddenDates(hiddenDates);
  }, [event, userId]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth - 120);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <Box p="3">
      <Box height={window.innerHeight - 150} overflow="scroll">
        <Flex>
          <Flex flexDirection="column" pt="3" pr="2">
            {viewTimeList.map((viewTime) => (
              <Box key={viewTime} fontSize="xs" pb="8">
                {viewTime + ':00'}
              </Box>
            ))}
          </Flex>
          <Box>
            {dateStrings.length > 0 && (
              <Flex>
                {dateStrings.map((dateString, index) => (
                  <Center w="100%" fontWeight="bold" fontSize="sm" key={index}>
                    {dateString}
                  </Center>
                ))}
              </Flex>
            )}

            {dateWidth > 0 && dates.length > 0 && (
              <FullCalendar
                plugins={[timeGridPlugin]}
                initialView="timeGrid"
                duration={{ days: dateWidth }}
                headerToolbar={false}
                allDaySlot={false}
                contentHeight={'auto'}
                initialDate={dates[0]}
                eventSources={[{ events: eventFullCalendar }]}
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
            )}
          </Box>

          {dates.length >= 4 && (
            <Flex flexDirection="column" pt="3" pl="2">
              {viewTimeList.map((viewTime) => (
                <Box key={viewTime} fontSize="xs" pb="8">
                  {viewTime + ':00'}
                </Box>
              ))}
            </Flex>
          )}
          {fullCalendarStyle()}
        </Flex>
      </Box>

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
