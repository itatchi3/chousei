import { Meta } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { InputEventDiscription } from './InputEventDiscription';

export default {
  component: InputEventDiscription,
} as Meta;

export const inputEventDiscription = () => {
  return (
    <RecoilRoot>
      <InputEventDiscription />
    </RecoilRoot>
  );
};
