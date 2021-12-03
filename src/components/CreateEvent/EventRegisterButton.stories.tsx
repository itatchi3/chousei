import { Meta } from '@storybook/react';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import {
  possibleDateState,
  isValidateDateState,
  isValidateTimeListState,
  overViewState,
} from 'src/atoms/eventState';
import { EventRegisterButton } from './EventRegisterButton';

export default {
  component: EventRegisterButton,
} as Meta;

const possibleDate = [
  {
    date: [new Date(2021, 11, 1), new Date(2021, 11, 3), new Date(2021, 11, 4)],
    dateString: '12/1(水), 12/3(金), 12/4(土)',
    timeWidth: [
      { start: '12:00', end: '13:00' },
      { start: '14:00', end: '15:00' },
    ],
  },
];

const isValidateTimeList = [false];

const initializeState = ({ set }: MutableSnapshot) => {
  set(overViewState, { eventName: 'test', description: '' });
  set(possibleDateState, possibleDate);
  set(isValidateDateState, false);
  set(isValidateTimeListState, isValidateTimeList);
};

const initializeStateNoEventName = ({ set }: MutableSnapshot) => {
  set(possibleDateState, possibleDate);
  set(isValidateDateState, false);
  set(isValidateTimeListState, isValidateTimeList);
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
