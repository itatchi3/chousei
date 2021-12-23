import { Box, Flex } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  EditingPossibleDate,
  eventState,
  overViewState,
  possibleDateState,
} from 'src/atoms/eventState';
import { CreateEvent } from '../CreateEvent/CreateEvent';

export const EditEvent = () => {
  const event = useRecoilValue(eventState);
  const setOverView = useSetRecoilState(overViewState);
  const setPossibleDates = useSetRecoilState(possibleDateState);

  useEffect(() => {
    if (!event) return;
    const description = event.description ? event.description : '';
    setOverView({ eventName: event.name, description: description });

    let editingPossibleDateList: EditingPossibleDate[] = [];
    let editingPossibleDate: EditingPossibleDate = {
      date: [event.possibleDates[0].date],
      dateString: event.possibleDates[0].dateString,
      timeWidth: [],
    };

    let beforeDate = event.possibleDates[0].date;

    event.possibleDates.map((possibleDate) => {
      const pushTimeWidth = () => {
        const startTimeString = possibleDate.startTime.toLocaleTimeString('ja-JP', {
          hour: '2-digit',
          minute: '2-digit',
        });
        const endTimeString = possibleDate.endTime.toLocaleTimeString('ja-JP', {
          hour: '2-digit',
          minute: '2-digit',
        });
        editingPossibleDate.timeWidth.push({
          start: startTimeString,
          end: endTimeString,
          stringTimeWidth: possibleDate.timeWidthString,
        });
        beforeDate = possibleDate.date;
      };

      if (possibleDate.date.getTime() === beforeDate.getTime()) {
        pushTimeWidth();
      } else {
        editingPossibleDateList.push(editingPossibleDate);
        editingPossibleDate = {
          date: [possibleDate.date],
          dateString: possibleDate.dateString,
          timeWidth: [],
        };
        pushTimeWidth();
      }
    });
    editingPossibleDateList.push(editingPossibleDate);
    setPossibleDates(editingPossibleDateList);
  }, [event, setOverView, setPossibleDates]);
  return (
    <>
      {event ? (
        <CreateEvent />
      ) : (
        <Flex height="100vh" justifyContent="center" alignItems="center">
          <Box fontWeight="bold">イベント詳細画面へ戻ってください</Box>
        </Flex>
      )}
    </>
  );
};
