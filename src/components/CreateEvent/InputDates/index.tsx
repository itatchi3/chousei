import { Calendar, DateObject } from 'react-multi-date-picker';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import { useRecoilState } from 'recoil';
import { editingEventState } from 'src/atoms/eventState';

export const InputDates = () => {
  const [event, setEvent] = useRecoilState(editingEventState);
  const chengeDates = (dateobject: DateObject[]) => {
    setEvent((state) => ({
      ...state,
      dates: dateobject,
    }));
  };
  return (
    <Grid container item xs={11}>
      <div className="guide-title">
        <Chip color="primary" label="2" className="guide-title__chip" />
        イベント候補日を入力
      </div>
      <Grid container justify="center" alignItems="center">
        <Calendar value={event.dates} onChange={chengeDates} />
      </Grid>
    </Grid>
  );
};
