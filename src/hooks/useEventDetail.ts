import { eventIdState } from './../atoms/eventState';
import { useRecoilValue } from 'recoil';
import { useQuery } from 'react-query';
import superjson from 'superjson';

type EventDetail = {
  event: Event;
  counts: Counts;
  colors: Colors;
};

export type Event = {
  id: string;
  name: string;
  description: string | null;
  possibleDates: PossibleDates;
  comments: Comments;
  participants: {
    userId: string;
    isCreate: boolean;
    isVote: boolean;
    isCheck: boolean;
    user: {
      name: string;
      profileImg: string;
    };
  }[];
};

type PossibleDate = {
  votes: {
    userId: string;
    vote: string;
    possibleDateId: number;
  }[];
  eventId: string;
  id: number;
  index: number;
  dateString: string;
  timeWidthString: string;
  date: Date;
  startTime: Date;
  endTime: Date;
};

export type PossibleDates = PossibleDate[];

export type Comments = Comment[] | null;

export type Comment = {
  userId: string;
  comment: string;
  user: {
    name: string;
    profileImg: string;
  };
};

export type Counts = Count[];

type Count = {
  date: Date;
  positiveCount: number;
  evenCount: number;
  negativeCount: number;
};

export type Colors = Color[];

type Color = string;

const fetchEventDetail = async (id: string | string[] | undefined): Promise<EventDetail | null> => {
  if (!id) {
    return null;
  }
  const res = await fetch(`/api/getEventDetail`, {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
  const json: { ok?: boolean; eventDetailData?: string; error?: string } = await res.json();
  if (!json.ok || !json.eventDetailData) {
    throw new Error(json.error);
  }
  return superjson.parse(json.eventDetailData);
};

export const useEventDetailQuery = () => {
  const id = useRecoilValue(eventIdState);
  return useQuery(['eventDetail'], () => fetchEventDetail(id));
};
