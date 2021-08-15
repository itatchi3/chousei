import { atom } from 'recoil';
import { ParsedUrlQuery } from 'node:querystring';

type Event = {
  eventId: ParsedUrlQuery;
  eventName: string;
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

export const eventState = atom<Event>({
  key: 'eventState',
  default: {
    eventId: {},
    eventName: '',
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
