import { Meta } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { InputPossibleDates } from './InputPossibleDates';

export default {
  component: InputPossibleDates,
} as Meta;

export const inputPossibleDates = () => {
  return (
    <RecoilRoot>
      <InputPossibleDates />
    </RecoilRoot>
  );
};
