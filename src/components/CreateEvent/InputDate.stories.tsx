import { Meta } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { InputDate } from './InputDate';

export default {
  component: InputDate,
} as Meta;

export const inputDate = () => {
  return (
    <RecoilRoot>
      <InputDate indexDate={0} />
    </RecoilRoot>
  );
};
