import { Meta } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { EventDetail } from './EventDetail';

export default {
  component: EventDetail,
} as Meta;

export const eventDetail = () => {
  return (
    <RecoilRoot>
      <EventDetail />
    </RecoilRoot>
  );
};
