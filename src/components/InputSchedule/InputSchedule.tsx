import React, { useEffect, useState, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { eventState } from 'src/atoms/eventState';
import { useRouter } from 'next/router';
import { Button, Box, HStack, VStack, Center, Flex } from '@chakra-ui/react';
import FullCalendar, { EventClickArg } from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { cloneDeep } from 'lodash';
import { useLiff } from 'src/liff/auth';
import { PossibleDate, Vote } from '@prisma/client';

type EventFullCalendar = {
  start: Date;
  end: Date;
  id: string;
  color: string;
  textColor: string;
  title: string;
};

export const InputSchedule = () => {
  const [color, setColor] = useState('Red');
  const [greenVarient, setGreenVarient] = useState<'solid' | 'outline'>('outline');
  const [yellowVarient, setYellowVarient] = useState<'solid' | 'outline'>('outline');
  const [redVarient, setRedVarient] = useState<'solid' | 'outline'>('solid');
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState<Date[]>([]);
  const [dateStrings, setDateStrings] = useState<string[]>([]);
  const [hiddenDates, setHiddenDates] = useState<string[]>([]);
  const [dateWidth, setDateWidth] = useState(0);
  const [eventFullCalendar, setEventFullCalendar] = useState<EventFullCalendar[]>([]);
  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(24);
  const [viewTimes, setViewTimes] = useState<number[]>([]);
  const [eventColumnNumArray, setEventColumnNumArray] = useState<number[]>([]);

  const event = useRecoilValue(eventState);
  const { userId, idToken } = useLiff();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const ref = useRef<HTMLDivElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const tickingX = useRef<boolean>(false);
  const calendar = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const eventColor = {
    green: '#9AE6B4',
    yellow: '#FEF0B3',
    red: '#FBDFDF',
    gray: '#E2E8F0',
  };

  const eventTextColor = {
    green: 'darkgreen',
    yellow: 'chocolate',
    red: 'crimson',
    black: 'black',
  };

  const checkColor = (vote: string) => {
    switch (vote) {
      case '○':
        return '#9AE6B4';
      case '△':
        return '#FEF0B3';
      case '×':
        return '#FBDFDF';
      default:
        return '#E2E8F0';
    }
  };

  const handleClickGreen = () => {
    if (color !== 'Green') {
      setGreenVarient('solid');
      setYellowVarient('outline');
      setRedVarient('outline');
      setColor('Green');
    }
  };

  const handleClickYellow = () => {
    if (color !== 'Yellow') {
      setGreenVarient('outline');
      setYellowVarient('solid');
      setRedVarient('outline');
      setColor('Yellow');
    }
  };

  const handleClickRed = () => {
    if (color !== 'Red') {
      setGreenVarient('outline');
      setYellowVarient('outline');
      setRedVarient('solid');
      setColor('Red');
    }
  };

  const onClickVoteChange = (arg: EventClickArg) => {
    const newEventFullCalendar = cloneDeep(eventFullCalendar);
    let newEventColor = eventColor.green;
    let newTextColor = eventTextColor.black;
    let newTitle = '';
    switch (color) {
      case 'Green':
        newEventColor = eventColor.green;
        newTextColor = eventTextColor.green;
        newTitle = '○';
        break;
      case 'Yellow':
        newEventColor = eventColor.yellow;
        newTextColor = eventTextColor.yellow;
        newTitle = '△';
        break;
      case 'Red':
        newEventColor = eventColor.red;
        newTextColor = eventTextColor.red;
        newTitle = '×';
        break;
      default:
        newEventColor = eventColor.gray;
        newTextColor = eventTextColor.black;
        newTitle = '';
        break;
    }

    newEventFullCalendar[Number(arg.event.id)].color = newEventColor;
    newEventFullCalendar[Number(arg.event.id)].textColor = newTextColor;
    newEventFullCalendar[Number(arg.event.id)].title = newTitle;
    setEventFullCalendar(newEventFullCalendar);
  };

  const registerAttendances = async () => {
    if (!event) return;
    setLoading(true);
    const votes = eventFullCalendar.map((eventFullCalendar, index) => {
      let vote = { id: event.possibleDates[index].id, vote: '' };
      switch (eventFullCalendar.color) {
        case eventColor.green:
          vote.vote = '○';
          break;
        case eventColor.yellow:
          vote.vote = '△';
          break;
        case eventColor.red:
          vote.vote = '×';
          break;
        case eventColor.gray:
          vote.vote = '';
        default:
        // do nothing
      }
      return vote;
    });

    try {
      const body = {
        votes: votes,
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
    let calendarWidth = 0;
    let colomnWidthStyle = '';
    dates.map((date, index) => {
      const dataDate = date.toISOString().slice(0, 10);
      const width = eventColumnNumArray[index] >= 2 ? 50 * eventColumnNumArray[index] : 100;
      calendarWidth += width;
      colomnWidthStyle += `[data-date='${dataDate}'] {width: ${width}px !important}`;
    });

    let widthStyle = '';
    if (windowWidth - 100 <= calendarWidth) {
      widthStyle = `.fc-scrollgrid {width: ${calendarWidth}px !important;}`;
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
          ${colomnWidthStyle}
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
          .fc-timegrid-slot {
            height: 30px !important;
          }
          .fc-event-title {
            text-align: center;
          }
          .fc-event-time {
            text-align: center;
          }
        `}
      </style>
    );
  };

  useEffect(() => {
    if (!event || !userId || !scroll.current) return;
    let dates: Date[] = [event.possibleDates[0].date];
    let dateStrings: string[] = [event.possibleDates[0].dateString];
    let dateTimes: number[] = [event.possibleDates[0].date.getTime()];
    let eventFullCalendar: EventFullCalendar[] = [];
    let newMinTime = 24;
    let newMaxTime = 0;
    let minutesWhenMaxTime = 0;
    let isVote = false;

    event.participants.map((participant) => {
      if (participant.userId === userId && participant.isVote) {
        isVote = true;
      }
    });

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

      let userVote = isVote ? '' : '○';
      possibleDate.votes.map((vote) => {
        if (vote.userId === userId) {
          userVote = vote.vote;
        }
      });

      let textColor = eventTextColor.black;
      switch (userVote) {
        case '○':
          textColor = eventTextColor.green;
          break;
        case '△':
          textColor = eventTextColor.yellow;
          break;
        case '×':
          textColor = eventTextColor.red;
          break;
        default:
          break;
      }

      eventFullCalendar.push({
        start: possibleDate.startTime,
        end: possibleDate.endTime,
        id: index.toString(),
        color: checkColor(userVote),
        textColor: textColor,
        title: userVote,
      });
      if (!dateStrings.includes(possibleDate.dateString)) {
        dates.push(possibleDate.date);
        dateStrings.push(possibleDate.dateString);
      }
      dateTimes.push(possibleDate.date.getTime());
    });
    setDates(dates);
    setDateStrings(dateStrings);
    setEventFullCalendar(eventFullCalendar);
    setMinTime(newMinTime);
    if (minutesWhenMaxTime) {
      newMaxTime += 1;
    }
    setMaxTime(newMaxTime);
    let newTimes: number[] = [];
    for (let i = newMinTime; i <= newMaxTime; i++) {
      newTimes.push(i);
    }
    setViewTimes(newTimes);

    const dateWidth = (dateTimes[dateTimes.length - 1] - dateTimes[0]) / 86400000;
    let hiddenDates: string[] = [];
    for (let i = 1; i < dateWidth; i++) {
      let date = cloneDeep(dates[0]);
      date.setDate(date.getDate() + i);
      if (!dateTimes.includes(date.getTime())) {
        const hiddenDate = date.toISOString().slice(0, 10);
        hiddenDates.push(hiddenDate);
      }
    }
    setDateWidth(dateWidth + 1);
    setHiddenDates(hiddenDates);

    let possibleDatesPerDayArray: (PossibleDate & {
      votes: Vote[];
    })[][] = [];
    dateStrings.map((dateString) => {
      let possibleDatesPerDay: (PossibleDate & {
        votes: Vote[];
      })[] = [];
      event.possibleDates.map((possibleDate) => {
        if (possibleDate.dateString === dateString) {
          possibleDatesPerDay.push(possibleDate);
        }
      });
      possibleDatesPerDayArray.push(possibleDatesPerDay);
    });

    let newEventColumnNumArray: number[] = [];
    possibleDatesPerDayArray.map((possibleDatesPerDay) => {
      let times: { time: Date; type: string }[] = [];
      possibleDatesPerDay.map((possibleDate) => {
        times.push({ time: possibleDate.startTime, type: 'start' });
        times.push({ time: possibleDate.endTime, type: 'end' });
      });

      times = times.sort((time1, time2) => {
        if (time1.time.getTime() > time2.time.getTime()) {
          return 1;
        }
        if (time1.time.getTime() < time2.time.getTime()) {
          return -1;
        }
        return 0;
      });

      let columnNumCount = 0;
      let maxColumnNum = 0;
      times.map((time) => {
        if (time.type === 'start') {
          columnNumCount += 1;
        } else {
          columnNumCount -= 1;
        }
        if (columnNumCount > maxColumnNum) {
          maxColumnNum = columnNumCount;
        }
      });
      newEventColumnNumArray.push(maxColumnNum);
    });
    setEventColumnNumArray(newEventColumnNumArray);

    const horizontalScroll = () => {
      if (!tickingX.current) {
        requestAnimationFrame(() => {
          tickingX.current = false;
          if (!scroll.current || !ref.current) return;
          const scrollLeft = scroll.current.scrollLeft;
          ref.current.style.left = `${-scrollLeft}px`;
        });
        tickingX.current = true;
      }
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    scroll.current.addEventListener('scroll', horizontalScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [event, userId]);

  return (
    <Box overflow="hidden">
      <Box ref={ref} position="fixed" top="0px" zIndex="2" bg="white" px="46px">
        {dateStrings.length > 0 && (
          <Flex>
            {dateStrings.map((dateString, index) => (
              <Center
                w={
                  eventColumnNumArray[index] >= 2 ? 50 * eventColumnNumArray[index] + 'px' : '100px'
                }
                fontWeight="bold"
                fontSize="sm"
                key={index}
              >
                {dateString}
              </Center>
            ))}
          </Flex>
        )}
      </Box>

      <Box height={windowHeight - 150} ref={scroll} overflow="scroll" zIndex="1" px="2" pt="3">
        <Flex>
          <Flex flexDirection="column" mt="-9px" pr="1" zIndex="1">
            {viewTimes.map((viewTime) => (
              <Center key={viewTime} fontSize="xs" h="60px">
                {viewTime + ':00'}
              </Center>
            ))}
          </Flex>
          <Box pt="5" ref={calendar}>
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
            <Flex flexDirection="column" mt="-9px" pl="1" pr="2" zIndex="1">
              {viewTimes.map((viewTime) => (
                <Center key={viewTime} fontSize="xs" h="60px">
                  {viewTime + ':00'}
                </Center>
              ))}
            </Flex>
          )}
          {fullCalendarStyle()}
        </Flex>
      </Box>

      <Center>
        <VStack pos="fixed" bottom="0" bg="white" w="100%" zIndex="1">
          <HStack p="4" spacing={4}>
            <Button
              variant={greenVarient}
              colorScheme="circle"
              color={eventTextColor.green}
              w="24"
              onClick={() => handleClickGreen()}
            >
              ○
            </Button>
            <Button
              variant={yellowVarient}
              colorScheme="triangle"
              color={eventTextColor.yellow}
              w="24"
              onClick={() => handleClickYellow()}
            >
              △
            </Button>
            <Button
              variant={redVarient}
              colorScheme="x"
              color={eventTextColor.red}
              w="24"
              onClick={() => handleClickRed()}
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
