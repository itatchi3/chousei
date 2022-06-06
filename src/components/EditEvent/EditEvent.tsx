import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { EditingPossibleDate, overViewState, possibleDateState } from 'src/atoms/eventState';
import { CreateEvent } from '../CreateEvent/CreateEvent';
import { v4 as uuidv4 } from 'uuid';
import { useEventDetailQuery } from 'src/hooks/useEventDetail';

export const EditEvent = () => {
  const { data: eventDetail } = useEventDetailQuery();
  const setOverView = useSetRecoilState(overViewState);
  const setPossibleDates = useSetRecoilState(possibleDateState);

  useEffect(() => {
    if (!eventDetail) return;
    const description = eventDetail.event.description ? eventDetail.event.description : '';
    setOverView({ eventName: eventDetail.event.name, description: description });

    let editingPossibleDates: EditingPossibleDate[] = [];
    let editingPossibleDate: EditingPossibleDate = {
      id: uuidv4(),
      date: [eventDetail.event.possibleDates[0].date],
      dateString: eventDetail.event.possibleDates[0].dateString,
      timeWidth: [],
    };

    let beforeDate = eventDetail.event.possibleDates[0].date;

    eventDetail.event.possibleDates.map((possibleDate) => {
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
  }, [eventDetail, setOverView, setPossibleDates]);
  return <CreateEvent />;
};
