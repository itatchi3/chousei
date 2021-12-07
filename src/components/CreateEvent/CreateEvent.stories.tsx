import { Meta } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { CreateEvent } from './CreateEvent';

export default {
  component: CreateEvent,
} as Meta;

export const createEvent = () => {
  return (
    <RecoilRoot>
      <CreateEvent />
    </RecoilRoot>
  );
};
