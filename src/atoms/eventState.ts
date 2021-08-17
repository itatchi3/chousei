import { atom } from 'recoil';

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
  votes?: ('○' | '△' | '×')[];
  comment: string;
  profileImg: string;
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
        votes: undefined,
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
    votes: undefined,
    comment: '',
    profileImg: '',
  },
});
