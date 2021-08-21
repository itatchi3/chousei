import Grid from '@material-ui/core/Grid';
import { EventPush } from 'src/components/CreateEvent/EventPush';
import { InputTimeInterval } from 'src/components/CreateEvent/InputTimeInterval';
import { InputTimeWidth } from 'src/components/CreateEvent/InputTimeWidth';
import { InputDates } from 'src/components/CreateEvent/InputDates';
import { InputEventOverview } from 'src/components/CreateEvent/InputOverview';

export const CreateEvent = () => {
  return (
    <Grid
      id="event-entry"
      container
      item
      direction="column"
      justify="space-between"
      alignItems="center"
      xs={12}
      spacing={3}
    >
      <InputEventOverview />
      <InputDates />
      <InputTimeWidth />
      <InputTimeInterval />
      <EventPush />
    </Grid>
  );
};
