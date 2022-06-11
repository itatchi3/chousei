import { atom } from 'recoil';
import type Liff from '@line/liff';
import { v4 as uuidv4 } from 'uuid';

export type EditingOverViewType = {
  eventName: string;
  description: string;
};

export type EditingPossibleDate = {
  id: string;
  date: Date[];
  dateString: string;
  timeWidth: EditingTimeWidth[];
};

export type EditingTimeWidth = {
  id: string;
  start: string;
  end: string;
  stringTimeWidth?: string;
};

export type RiffObj = {
  liff?: typeof Liff;
  idToken?: string | null;
  isInClient?: boolean;
};

export const overViewState = atom<EditingOverViewType>({
  key: 'overViewState',
  default: {
    eventName: '',
    description: '',
  },
});

export const possibleDateState = atom<EditingPossibleDate[]>({
  key: 'possibleDateState',
  default: [
    {
      id: uuidv4(),
      date: [],
      dateString: '',
      timeWidth: [{ id: uuidv4(), start: '12:00', end: '13:00' }],
    },
  ],
});

export const isValidateDateState = atom<boolean>({
  key: 'isValidateDateState',
  default: false,
});

export const isValidateTimeArrayState = atom<boolean[]>({
  key: 'isValidateTimeState',
  default: [false],
});

export const liffObjState = atom<RiffObj>({
  key: 'liffState',
  default: {},
});

export const isCancelModalState = atom<boolean>({
  key: 'isCancelModalState',
  default: false,
});

export const userIdState = atom<string | undefined>({
  key: 'userIdState',
  default: undefined,
});

export const tableWidthState = atom<number>({
  key: 'tableWidthState',
  default: 0,
});

export const eventIdState = atom<string>({
  key: 'eventIdState',
  default: '',
});
