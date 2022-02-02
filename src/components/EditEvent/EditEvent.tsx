import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  EditingPossibleDate,
  eventState,
  overViewState,
  possibleDateState,
} from 'src/atoms/eventState';
import { CreateEvent } from '../CreateEvent/CreateEvent';
import { v4 as uuidv4 } from 'uuid';

export const EditEvent = () => {
  const event = useRecoilValue(eventState);
  const setOverView = useSetRecoilState(overViewState);
  const setPossibleDates = useSetRecoilState(possibleDateState);

  useEffect(() => {
    if (!event) return;
    const description = event.description ? event.description : '';
    setOverView({ eventName: event.name, description: description });

    let editingPossibleDates: EditingPossibleDate[] = [];
    let editingPossibleDate: EditingPossibleDate = {
      id: uuidv4(),
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
          id: uuidv4(),
          start: startTimeString,
          end: endTimeString,
          stringTimeWidth: possibleDate.timeWidthString,
        });
        beforeDate = possibleDate.date;
      };

      if (possibleDate.date.getTime() === beforeDate.getTime()) {
        pushTimeWidth();
      } else {
        editingPossibleDates.push(editingPossibleDate);
        editingPossibleDate = {
          id: uuidv4(),
          date: [possibleDate.date],
          dateString: possibleDate.dateString,
          timeWidth: [],
        };
        pushTimeWidth();
      }
    });
    editingPossibleDates.push(editingPossibleDate);
    setPossibleDates(editingPossibleDates);
  }, [event, setOverView, setPossibleDates]);
  return <CreateEvent />;
};
