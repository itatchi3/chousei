import { atom } from 'recoil';

export type EventType = {
  eventId: string;
  name: string;
  description: string;
  dates: string[];
  times: string[];
  prospectiveDates: string[];
  attendeeVotes?: AttendeeVotesType[];
  attendeeComment?: AttendeeCommentType[];
};

export type AttendeeVotesType = {
  userId: string;
  name: string;
  profileImg: string;
  votes: ('○' | '△' | '×')[];
};

export type AttendeeCommentType = {
  userId: string;
  name: string;
  profileImg: string;
  comment: string;
};

export type EditingEventType = {
  eventName: string;
  description: string;
  dates: string[];
  fromHour: string;
  toHour: string;
  fromMinute: string;
  toMinute: string;
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
    attendeeVotes: undefined,
    attendeeComment: undefined,
  },
});

export const attendeeVotesState = atom<AttendeeVotesType>({
  key: 'attendeeVotesState',
  default: {
    userId: '',
    name: '',
    votes: [],
    profileImg: '',
  },
});

export const attendeeCommentState = atom<AttendeeCommentType>({
  key: 'attendeeCommentState',
  default: {
    userId: '',
    name: '',
    profileImg: '',
    comment: '',
  },
});

export const editingEventState = atom<EditingEventType>({
  key: 'editingEventState',
  default: {
    eventName: '',
    description: '',
    dates: [],
    fromHour: '',
    toHour: '',
    fromMinute: '',
    toMinute: '',
  },
});
