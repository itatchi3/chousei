import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import { useRecoilState } from 'recoil';
import { editingEventState } from 'src/atoms/eventState';

export const InputTimeWidth = () => {
  const [event, setEvent] = useRecoilState(editingEventState);
  const changeTimeWidth = (event: any, newTimeWidth: number | number[]) => {
    setEvent((state) => ({
      ...state,
      timeWidth: newTimeWidth as number[],
    }));
  };
  const marksTimeWidth = [
    {
      value: 0,
      label: '0:00',
    },
    {
      value: 12,
      label: '12:00',
    },
    {
      value: 24,
      label: '24:00',
    },
  ];
  return (
    <Grid container item xs={11} justify="center">
      <Grid container item xs={12} justify="flex-start" alignItems="flex-start">
        <div className="guide-title">
          <Chip color="primary" label="3" className="guide-title__chip" />
          調整したい時間を入力
        </div>
      </Grid>
      <Grid container item xs={9} justify="center" alignItems="center">
        <Slider
          value={event.timeWidth}
          onChange={changeTimeWidth}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          step={1}
          marks={marksTimeWidth}
          min={0}
          max={24}
        />
      </Grid>
    </Grid>
  );
};
