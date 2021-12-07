import { Meta } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { EventOverview } from './EventOverview';

export default {
  component: EventOverview,
} as Meta;

export const eventOverview = () => {
  return (
    <RecoilRoot>
      <EventOverview name={'test'} description={'testです。'} />
    </RecoilRoot>
  );
};
