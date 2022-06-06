import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Button, Box, HStack, VStack, Center, Flex, Table, Tr, Th, Tbody } from '@chakra-ui/react';
import FullCalendar, { EventClickArg } from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { cloneDeep, sum } from 'lodash';
import { useLiff } from 'src/liff/auth';
import { PossibleDates, useEventDetailQuery } from 'src/hooks/useEventDetail';

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
  const [calendarWidth, setCalendarWidth] = useState(0);
  const [dateColumnWidthArray, setDateColumnWidthArray] = useState<number[]>([]);
  const [eventFullCalendar, setEventFullCalendar] = useState<EventFullCalendar[]>([]);
  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(24);
  const [viewTimes, setViewTimes] = useState<number[]>([]);

  const { data: eventDetail } = useEventDetailQuery();
  const { userId, idToken } = useLiff();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const router = useRouter();

  const eventColor = {
    green: '#9AE6B4',
    yellow: '#FEF0B3',
    red: '#FBDFDF',
    gray: '#E2E8F0',
  };

  const eventTextColor = useMemo(() => {
    return {
      green: 'darkgreen',
      yellow: 'chocolate',
      red: 'crimson',
      black: 'black',
    };
  }, []);

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
    if (!eventDetail) return;
    setLoading(true);
    const votes = eventFullCalendar.map((eventFullCalendar, index) => {
      let vote = { id: eventDetail.event.possibleDates[index].id, vote: '' };
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
        eventId: eventDetail.event.id,
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
      router.push(`/event/${eventDetail.event.id}`);
    } catch (error) {
      alert(error);
      console.error(error);
      setLoading(false);
    }
  };

  const fullCalendarStyle = () => {
    let colomnWidthStyle = '';
    dates.map((date, index) => {
      const dataDate = date.toISOString().slice(0, 10);
      colomnWidthStyle += `[data-date='${dataDate}'] {width: ${dateColumnWidthArray[index]}px !important}`;
    });

    let hiddenStyle = '';
    hiddenDates.map((hiddenDate) => {
      hiddenStyle += `[data-date='${hiddenDate}'] {display: none !important}`;
    });
    return (
      <style jsx>
        {`
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
    if (!eventDetail || !userId) return;
    let dates: Date[] = [eventDetail.event.possibleDates[0].date];
    let dateStrings: string[] = [eventDetail.event.possibleDates[0].dateString];
    let dateTimes: number[] = [eventDetail.event.possibleDates[0].date.getTime()];
    let eventFullCalendar: EventFullCalendar[] = [];
    let newMinTime = 24;
    let newMaxTime = 0;
    let minutesWhenMaxTime = 0;
    let isVote = false;

    eventDetail.event.participants.map((participant) => {
      if (participant.userId === userId && participant.isVote) {
        isVote = true;
      }
    });

    eventDetail.event.possibleDates.map((possibleDate, index) => {
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

    let possibleDatesPerDayArray: PossibleDates[] = [];
    dateStrings.map((dateString) => {
      let possibleDatesPerDay: PossibleDates = [];
      eventDetail.event.possibleDates.map((possibleDate) => {
        if (possibleDate.dateString === dateString) {
          possibleDatesPerDay.push(possibleDate);
        }
      });
      possibleDatesPerDayArray.push(possibleDatesPerDay);
    });

    let eventColumnNumArray: number[] = [];
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
      if (maxColumnNum === 1) {
        maxColumnNum = 2;
      }
      eventColumnNumArray.push(maxColumnNum);
    });

    let minCalendarWidth = 0;
    eventColumnNumArray.map((eventColumnNum) => {
      const dateColumnWidth = eventColumnNum * 50;
      minCalendarWidth += dateColumnWidth;
    });

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
      const viewTableWidth =
        eventColumnNumArray.length >= 4 ? window.innerWidth - 100 : window.innerWidth - 50;

      let newDateColumnWidthArray: number[] = [];
      if (viewTableWidth <= minCalendarWidth) {
        eventColumnNumArray.map((eventColumnNum) => {
          const dateColumnWidth = eventColumnNum * 50;
          newDateColumnWidthArray.push(dateColumnWidth);
        });
        setDateColumnWidthArray(newDateColumnWidthArray);
        setCalendarWidth(minCalendarWidth);
      } else {
        eventColumnNumArray.map((eventColumnNum) => {
          const dateColumnWidth = (viewTableWidth * eventColumnNum) / sum(eventColumnNumArray);
          newDateColumnWidthArray.push(dateColumnWidth);
        });
        setDateColumnWidthArray(newDateColumnWidthArray);
        setCalendarWidth(viewTableWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [eventDetail, userId, eventTextColor]);

  return (
    <Box overflow="hidden">
      <Box height={windowHeight - 110} overflow="scroll" zIndex="1" px="2">
        <Table variant="unstyled">
          <Tbody border="0px none">
            <Tr>
              <Th sx={{ position: 'sticky', top: 0 }} p="0" zIndex="2">
                {dateStrings.length > 0 && dateColumnWidthArray.length && (
                  <Box bg="white" pl="44px" pr={dateStrings.length >= 4 ? '44px' : '0px'} pt="1">
                    <Flex>
                      {dateStrings.map((dateString, index) => (
                        <Center
                          w={dateColumnWidthArray[index] + 'px'}
                          fontWeight="bold"
                          fontSize="sm"
                          key={index}
                        >
                          {dateString}
                        </Center>
                      ))}
                    </Flex>
                  </Box>
                )}
              </Th>
            </Tr>

            <Tr>
              <Th p="0">
                <Flex>
                  <Flex flexDirection="column" mt="-43px" pb="2" pr="1" zIndex="1">
                    {viewTimes.map((viewTime) => (
                      <Flex key={viewTime} fontSize="xs" alignItems="flex-end" h="60px">
                        {viewTime + ':00'}
                      </Flex>
                    ))}
                  </Flex>

                  <Box pt="2" width={calendarWidth}>
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
                    <Flex flexDirection="column" mt="-43px" pb="2" pl="1" pr="2" zIndex="1">
                      {viewTimes.map((viewTime) => (
                        <Flex key={viewTime} fontSize="xs" alignItems="flex-end" h="60px">
                          {viewTime + ':00'}
                        </Flex>
                      ))}
                    </Flex>
                  )}
                  {fullCalendarStyle()}
                </Flex>
              </Th>
            </Tr>
          </Tbody>
        </Table>
      </Box>

      <Center>
        <VStack spacing={1} pos="fixed" bottom="0" bg="white" w="100%" zIndex="1">
          <HStack p="2" spacing={4}>
            <Button
              variant={greenVarient}
              colorScheme="circle"
              color={eventTextColor.green}
              w={windowWidth > 330 ? '24' : '16'}
              onClick={() => handleClickGreen()}
            >
              ○
            </Button>
            <Button
              variant={yellowVarient}
              colorScheme="triangle"
              color={eventTextColor.yellow}
              w={windowWidth > 330 ? '24' : '16'}
              onClick={() => handleClickYellow()}
            >
              △
            </Button>
            <Button
              variant={redVarient}
              colorScheme="x"
              color={eventTextColor.red}
              w={windowWidth > 330 ? '24' : '16'}
              onClick={() => handleClickRed()}
            >
              ×
            </Button>
          </HStack>
          <Box pb="3">
            <Button onClick={() => registerAttendances()} isLoading={loading}>
              出欠を回答する
            </Button>
          </Box>
        </VStack>
      </Center>
    </Box>
  );
};
