import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { eventState, respondentVoteListState } from 'src/atoms/eventState';
import { useRouter } from 'next/router';
import { database } from 'src/utils/firebase';
import { Button, Box, HStack, VStack, Center, Flex } from '@chakra-ui/react';
import FullCalendar, { EventClickArg } from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { cloneDeep } from 'lodash';

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
  const [dates, setDates] = useState<number[]>([]);
  const [dateStrings, setDateStrings] = useState<string[]>([]);
  const [eventFullCalendarList, setEventFullCalendarList] = useState<EventFullCalendar[][]>([]);
  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(24);
  const [viewTimeList, setViewTimeList] = useState<number[]>([]);

  const event = useRecoilValue(eventState);
  const respondent = useRecoilValue(respondentVoteListState);

  const [voteList, setVoteList] = useState<('○' | '△' | '×')[]>(
    !respondent.voteList.length
      ? event.candidateDates.map(() => {
          return '△';
        })
      : event.candidateDates.map((date, i) => {
          return respondent.voteList[i];
        }),
  );

  const router = useRouter();

  const checkColor = (vote: '○' | '△' | '×') => {
    switch (vote) {
      case '○':
        return '#C53030';
      case '△':
        return '#2F855A';
      case '×':
        return '#3182CE';
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

  const onClickVoteChange = (arg: EventClickArg, indexDate: number) => {
    const index = Number(arg.event.id);
    const newVoteList = cloneDeep(voteList);
    const newEventFullCalendarList = cloneDeep(eventFullCalendarList);
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
    newVoteList[index] = newVote;
    setVoteList(newVoteList);
    eventFullCalendarList[indexDate].map((event, indexEvent) => {
      if (event.id === arg.event.id) {
        newEventFullCalendarList[indexDate][indexEvent].color = checkColor(newVote);
      }
    });
    setEventFullCalendarList(newEventFullCalendarList);
  };

  const registerAttendances = async () => {
    setLoading(true);
    const respondentData = {
      userId: respondent.userId,
      name: respondent.name,
      voteList: voteList,
      profileImg: respondent.profileImg,
    };

    await database
      .ref(`events/${event.id}/respondentVoteLists/${respondentData.userId}`)
      .set(respondentData);

    router.push(`/event/${event.id}`);
  };

  useEffect(() => {
    let dateList: number[] = [event.candidateDates[0].date];
    let dateStringList: string[] = [event.candidateDates[0].dateString];
    let eventFullCalendarList: EventFullCalendar[][] = [];
    let eventFullCalendar: EventFullCalendar[] = [];
    let newMinTime = 24;
    let newMaxTime = 0;
    let minutesWhenMaxTime = 0;

    event.candidateDates.map((candidateDate, index) => {
      if (new Date(candidateDate.timeWidth.start).getHours() < newMinTime) {
        newMinTime = new Date(candidateDate.timeWidth.start).getHours();
      }
      if (new Date(candidateDate.timeWidth.end).getHours() > newMaxTime) {
        newMaxTime = new Date(candidateDate.timeWidth.end).getHours();
        minutesWhenMaxTime = new Date(candidateDate.timeWidth.end).getMinutes();
      }
      if (dateList.includes(candidateDate.date)) {
        eventFullCalendar.push({
          start: new Date(candidateDate.timeWidth.start),
          end: new Date(candidateDate.timeWidth.end),
          id: index.toString(),
          color: checkColor(voteList[index]),
        });
      } else {
        eventFullCalendarList.push(eventFullCalendar);
        dateList.push(candidateDate.date);
        dateStringList.push(candidateDate.dateString);
        eventFullCalendar = [
          {
            start: new Date(candidateDate.timeWidth.start),
            end: new Date(candidateDate.timeWidth.end),
            id: index.toString(),
            color: checkColor(voteList[index]),
          },
        ];
      }
    });
    if (eventFullCalendar.length) {
      eventFullCalendarList.push(eventFullCalendar);
    }
    setDates(dateList);
    setDateStrings(dateStringList);
    setEventFullCalendarList(eventFullCalendarList);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {dates.map((date, index) => {
          return (
            <Box minWidth="100px" key={index}>
              <Center fontWeight="bold">{dateStrings[index]}</Center>
              <FullCalendar
                plugins={[timeGridPlugin]}
                initialView="timeGridDay"
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
        })}
        {dates.length >= 4 && (
          <VStack pt="4" pl="2">
            {viewTimeList.map((viewTime) => (
              <Box key={viewTime} fontSize="xs" pb="6">
                {viewTime + ':00'}
              </Box>
            ))}
          </VStack>
        )}

        <style jsx global>{`
          .fc-timegrid-slot-label,
          thead {
            display: none !important;
          }
          .fc-timegrid-event .fc-event-time {
            white-space: normal;
            font-size: 10px;
          }
        `}</style>
      </Flex>
      <Center>
        <VStack pos="fixed" bottom="0" bg="white" w="100%">
          <HStack p="4" spacing={4}>
            <Button
              sx={{ WebkitTapHighlightColor: 'rgba(0,0,0,0)', _focus: { boxShadow: 'none' } }}
              variant={redVarient}
              colorScheme="red"
              w="24"
              onClick={() => handleClickRed()}
            >
              ○
            </Button>
            <Button
              sx={{ WebkitTapHighlightColor: 'rgba(0,0,0,0)', _focus: { boxShadow: 'none' } }}
              variant={greenVarient}
              colorScheme="green"
              w="24"
              onClick={() => handleClickGreen()}
            >
              △
            </Button>
            <Button
              sx={{ WebkitTapHighlightColor: 'rgba(0,0,0,0)', _focus: { boxShadow: 'none' } }}
              variant={blueVarient}
              colorScheme="blue"
              w="24"
              onClick={() => handleClickBlue()}
            >
              ×
            </Button>
          </HStack>
          <Box pb="4">
            <Button
              sx={{
                WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                _focus: { boxShadow: 'none' },
              }}
              onClick={() => registerAttendances()}
              isLoading={loading}
            >
              出欠を回答する
            </Button>
          </Box>
        </VStack>
      </Center>
    </Box>
  );
};
