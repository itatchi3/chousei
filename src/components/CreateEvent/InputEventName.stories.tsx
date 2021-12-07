import { Meta } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { InputEventName } from './InputEventName';

export default {
  component: InputEventName,
} as Meta;

export const inputEventName = () => {
  return (
    <RecoilRoot>
      <InputEventName />
    </RecoilRoot>
  );
};
