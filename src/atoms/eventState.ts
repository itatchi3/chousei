import { atom } from 'recoil';

export type FireBaseEventType = {
  name: string;
  description: string;
  candidateDates: CandidateDate[];
};

export type EventType = {
  id: string;
  name: string;
  description: string;
  candidateDates: CandidateDate[];
  attendeeComment?: AttendeeCommentType[];
  attendeeVotes?: AttendeeVotesType[];
};

export type TimeWidth = {
  stringTimeWidth: string;
  start: number;
  end: number;
};

export type CandidateDate = {
  date: number;
  dateString: string;
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
  timeWidth: EditingTimeWidth[];
};

export type EditingTimeWidth = {
  start: string;
  end: string;
  stringTimeWidth?: string;
};

export const eventState = atom<EventType>({
  key: 'eventState',
  default: {
    id: '',
    name: '',
    description: '',
    candidateDates: [
      {
        date: 0,
        dateString: '',
        timeWidth: {
          start: 0,
          end: 0,
          stringTimeWidth: '',
        },
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
      timeWidth: [{ start: '12:00', end: '13:00' }],
    },
  ],
});

export const isValidateDateState = atom<boolean>({
  key: 'isValidateDateState',
  default: false,
});

export const isValidateTimeState = atom<boolean>({
  key: 'isValidateTimeState',
  default: false,
});
