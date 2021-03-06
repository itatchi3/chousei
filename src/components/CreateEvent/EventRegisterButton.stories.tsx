import { Meta } from '@storybook/react';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import {
  possibleDateState,
  isValidateDateState,
  isValidateTimeArrayState,
  overViewState,
} from 'src/atoms/eventState';
import { EventRegisterButton } from './EventRegisterButton';

export default {
  component: EventRegisterButton,
} as Meta;

const possibleDate = [
  {
    id: '0',
    date: [new Date(2021, 11, 1), new Date(2021, 11, 3)],
    dateString: '12/1(水), 12/3(金)',
    timeWidth: [
      { id: '0', start: '12:00', end: '13:00' },
      { id: '1', start: '14:00', end: '16:00' },
    ],
  },
];

const isValidateTimeArray = [false];

const initializeState = ({ set }: MutableSnapshot) => {
  set(overViewState, { eventName: 'test', description: '' });
  set(possibleDateState, possibleDate);
  set(isValidateDateState, false);
  set(isValidateTimeArrayState, isValidateTimeArray);
};

const initializeStateNoEventName = ({ set }: MutableSnapshot) => {
  set(possibleDateState, possibleDate);
  set(isValidateDateState, false);
  set(isValidateTimeArrayState, isValidateTimeArray);
};

export const eventRegisterButton = () => {
  return (
    <RecoilRoot initializeState={initializeState}>
      <EventRegisterButton />
    </RecoilRoot>
  );
};

export const eventRegisterButtonValidate = () => {
  return (
    <RecoilRoot initializeState={initializeStateNoEventName}>
      <EventRegisterButton />
    </RecoilRoot>
  );
};
