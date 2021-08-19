import { atom } from 'recoil';
import { DateObject } from 'react-multi-date-picker';

export type EventType = {
  eventId: string;
  name: string;
  description: string;
  dates: string[];
  times: string[];
  prospectiveDates: string[];
  attendees: AttendeeType[];
};

export type AttendeeType = {
  userId: string;
  name: string;
  votes: ('○' | '△' | '×')[];
  comment: string;
  profileImg: string;
};

export type EditingEventType = {
  eventName: string;
  description: string;
  dates: DateObject | DateObject[] | Date[] | null;
  timeWidth: number[];
  timeInterval: number[];
};

export const eventState = atom<EventType>({
  key: 'eventState',
  default: {
    eventId: '',
    name: '',
    description: '',
    dates: [''],
    times: [''],
    prospectiveDates: [''],
    attendees: [
      {
        userId: '',
        name: '',
        votes: [],
        comment: '',
        profileImg: '',
      },
    ],
  },
});

export const attendeeState = atom<AttendeeType>({
  key: 'attendeeState',
  default: {
    userId: '',
    name: '',
    votes: [],
    comment: '',
    profileImg: '',
  },
});

export const editingEventState = atom<EditingEventType>({
  key: 'editingEventState',
  default: {
    eventName: '',
    description: '',
    dates: [],
    timeWidth: [0, 24],
    timeInterval: [60],
  },
});
