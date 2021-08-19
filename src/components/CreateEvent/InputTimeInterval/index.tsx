import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import { useRecoilState } from 'recoil';
import { editingEventState } from 'src/atoms/eventState';

export const InputTimeInterval = () => {
  const [event, setEvent] = useRecoilState(editingEventState);
  const changeTimeInterval = (event: any, newTimeInterval: number | number[]) => {
    setEvent((state) => ({
      ...state,
      timeInterval: newTimeInterval as number[],
    }));
  };
  const marksTimeInterval = [
    {
      value: 15,
      label: '15分',
    },
    {
      value: 30,
      label: '30分',
    },
    {
      value: 60,
      label: '60分',
    },
    {
      value: 120,
      label: '120分',
    },
  ];
  return (
    <Grid container item xs={11} justify="center">
      <Grid container item xs={12} justify="flex-start" alignItems="flex-start">
        <div className="guide-title">
          <Chip color="primary" label="4" className="guide-title__chip" />
          時間幅を入力
        </div>
      </Grid>
      <Grid container item xs={9} justify="center" alignItems="center">
        <Slider
          value={event.timeInterval}
          onChange={changeTimeInterval}
          valueLabelDisplay="auto"
          aria-labelledby="track-false-slider"
          step={null}
          marks={marksTimeInterval}
          min={15}
          max={120}
          track={false}
        />
      </Grid>
    </Grid>
  );
};
