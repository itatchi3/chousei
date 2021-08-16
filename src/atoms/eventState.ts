import { atom } from 'recoil';
import { ParsedUrlQuery } from 'node:querystring';

export type EventType = {
  eventId: string;
  name: string;
  description: string;
  dates: string[];
  times: string[];
  prospectiveDates: string[];
  attendees: Attendee[];
};

type Attendee = {
  name: string;
  votes: string[];
  comment: string;
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
        name: '',
        votes: [''],
        comment: '',
      },
    ],
  },
});

export const attendeeState = atom<Attendee>({
  key: 'attendeeState',
  default: {
    name: '',
    votes: [''],
    comment: '',
  },
});
