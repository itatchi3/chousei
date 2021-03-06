import { Meta } from '@storybook/react';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { InputTimeWidth } from './InputTimeWidth';
import { possibleDateState } from 'src/atoms/eventState';

export default {
  component: InputTimeWidth,
} as Meta;

export const inputTimeWidth = () => {
  return (
    <RecoilRoot>
      <InputTimeWidth indexDate={0} isValidateTime={false} />
    </RecoilRoot>
  );
};

const possibleDate = [
  {
    id: '0',
    date: [],
    dateString: '',
    timeWidth: [{ id: '0', start: '14:00', end: '13:00' }],
  },
];

const initializeStateValidate = ({ set }: MutableSnapshot) => {
  set(possibleDateState, possibleDate);
};

export const inputTimeWidthValidate = () => {
  return (
    <RecoilRoot initializeState={initializeStateValidate}>
      <InputTimeWidth indexDate={0} isValidateTime={true} />
    </RecoilRoot>
  );
};
