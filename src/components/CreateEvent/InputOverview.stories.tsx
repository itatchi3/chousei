import { Meta } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { InputEventOverview } from './InputOverview';

export default {
  component: InputEventOverview,
} as Meta;

export const inputEventOverview = () => {
  return (
    <RecoilRoot>
      <InputEventOverview />
    </RecoilRoot>
  );
};
