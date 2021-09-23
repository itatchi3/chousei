import { atom } from 'recoil';

export type FireBaseEventType = {
  name: string;
  description: string;
  candidateDates: CandidateDate[];
};

export type EventType = {
  name: string;
  description: string;
  candidateDates: CandidateDate[];
  attendeeComment?: AttendeeCommentType[];
  attendeeVotes?: AttendeeVotesType[];
};

export type CandidateDate = {
  date: number;
  timeWidth: TimeWidth;
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
};

export type EditingCandidateDate = {
  date: Date[];
  timeWidth: TimeWidth[];
};

export type TimeWidth = {
  fromHour: string;
  toHour: string;
  fromMinute: string;
  toMinute: string;
  stringTimeWidth?: string;
};

export const eventState = atom<EventType>({
  key: 'eventState',
  default: {
    name: '',
    description: '',
    candidateDates: [
      {
        date: 0,
        timeWidth: { fromHour: '', toHour: '', fromMinute: '', toMinute: '', stringTimeWidth: '' },
      },
    ],
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
  },
});

export const candidateDateState = atom<EditingCandidateDate[]>({
  key: 'candidateDateState',
  default: [
    {
      date: [],
      timeWidth: [{ fromHour: '', toHour: '', fromMinute: '', toMinute: '' }],
    },
  ],
});
