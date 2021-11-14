import { AttendeeVotesType } from 'src/atoms/eventState';
import { AttendeeCommentType } from 'src/atoms/eventState';

export const attendeeVotesObjectToArray = (attendees: AttendeeVotesType[]) => {
  if (!attendees) {
    return [];
  }
  const attendeesArray = Object.entries(attendees).map((entry) => ({
    userId: entry[1].userId,
    name: entry[1].name,
    profileImg: entry[1].profileImg,
    votes: entry[1].votes,
  }));
  return attendeesArray;
};

export const attendeeCommentObjectToArray = (attendees: AttendeeCommentType[]) => {
  if (!attendees) {
    return [];
  }
  const attendeesArray = Object.entries(attendees).map((entry) => ({
    userId: entry[1].userId,
    name: entry[1].name,
    profileImg: entry[1].profileImg,
    comment: entry[1].comment,
  }));
  return attendeesArray;
};
