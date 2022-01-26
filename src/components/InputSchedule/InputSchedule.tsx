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
  textColor: string;
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
  const [viewTimeList, setViewTimeList] = useState<number[]>([]);

  const event = useRecoilValue(eventState);
  const { userId, idToken, isInClient } = useLiff();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

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
    switch (color) {
      case 'Green':
        newEventColor = eventColor.green;
        newTextColor = eventTextColor.green;
        break;
      case 'Yellow':
        newEventColor = eventColor.yellow;
        newTextColor = eventTextColor.yellow;
        break;
      case 'Red':
        newEventColor = eventColor.red;
        newTextColor = eventTextColor.red;
        break;
      default:
        newEventColor = eventColor.gray;
        newTextColor = eventTextColor.black;
        break;
    }

    newEventFullCalendar[Number(arg.event.id)].color = newEventColor;
    newEventFullCalendar[Number(arg.event.id)].textColor = newTextColor;
    setEventFullCalendar(newEventFullCalendar);
  };

  const registerAttendances = async () => {
    if (!event) return;
    setLoading(true);
    const voteList = eventFullCalendar.map((eventFullCalendar, index) => {
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
    if (
      (isInClient && numberOfDates >= 4) ||
      (!isInClient && windowWidth - 120 <= 100 * numberOfDates)
    ) {
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
          .fc-timegrid-slot {
            height: 25px !important;
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
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <Box p="3">
      <Box height={windowHeight - 150} overflow="scroll">
        <Flex>
          <Flex flexDirection="column" mt="-1" pr="2">
            {viewTimeList.map((viewTime) => (
              <Center key={viewTime} fontSize="xs" h="50px">
                {viewTime + ':00'}
              </Center>
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
            <Flex flexDirection="column" mt="-1" pl="2">
              {viewTimeList.map((viewTime) => (
                <Center key={viewTime} fontSize="xs" h="50px">
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
