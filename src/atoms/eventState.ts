import { atom } from 'recoil';
import type Liff from '@line/liff';
import { Comment, Event, EventParticipant, PossibleDate, User, Vote } from '.prisma/client';

export type EventType =
  | (Event & {
      possibleDates: (PossibleDate & {
        votes: Vote[];
      })[];
      comments: (Comment & {
        user: User;
      })[];
      participants: (EventParticipant & {
        user: User;
      })[];
    })
  | null;

export type EditingOverViewType = {
  eventName: string;
  description: string;
};

export type EditingPossibleDate = {
  date: Date[];
  dateString: string;
  timeWidth: EditingTimeWidth[];
};

export type EditingTimeWidth = {
  start: string;
  end: string;
  stringTimeWidth?: string;
};

export type RiffObj = {
  liff?: typeof Liff;
  idToken?: string | null;
  userId?: string;
  isInClient?: boolean;
};

export const eventState = atom<EventType>({
  key: 'eventState',
  default: null,
});

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
      date: [],
      dateString: '',
      timeWidth: [{ start: '12:00', end: '13:00' }],
    },
  ],
});

export const isValidateDateState = atom<boolean>({
  key: 'isValidateDateState',
  default: false,
});

export const isValidateTimeListState = atom<boolean[]>({
  key: 'isValidateTimeState',
  default: [false],
});

export const liffObjState = atom<RiffObj>({
  key: 'liffState',
  default: {
    liff: undefined,
    idToken: undefined,
    userId: undefined,
  },
});

export const isCancelModalState = atom<boolean>({
  key: 'isCancelModalState',
  default: false,
});
