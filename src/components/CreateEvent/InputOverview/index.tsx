import { TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import { useRecoilState } from 'recoil';
import { editingEventState } from 'src/atoms/eventState';

export const InputEventOverview = () => {
  const [event, setEvent] = useRecoilState(editingEventState);
  const changeEventname = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setEvent((state) => ({
      ...state,
      eventName: evt.target.value,
    }));
  };
  const changeDescription = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setEvent((state) => ({
      ...state,
      description: evt.target.value,
    }));
  };
  return (
    <Grid container item xs={11} justify="flex-start">
      <div className="guide-title">
        <Chip color="primary" label="1" className="guide-title__chip" />
        イベント概要を入力
      </div>
      <TextField
        placeholder="イベント名"
        onChange={changeEventname}
        value={event.eventName}
        fullWidth={true}
        variant="outlined"
      />
      <TextField
        placeholder="説明"
        onChange={changeDescription}
        value={event.description}
        margin="normal"
        multiline
        rows={7}
        fullWidth={true}
        variant="outlined"
      />
    </Grid>
  );
};
