import { AttendeeVotesType } from 'src/atoms/eventState';
import { AttendeeCommentType } from 'src/atoms/eventState';
/*

attendees: {
  -Lxxxxxxxxxxxxxxx : {
      name: "一郎",
      votes: [ "○", "△", "×" ],
      comment: "9日はいけません"
  },
  -Lxxxxxxxxxxxxxxx : {
      name: "次郎",
      votes: [ "○", "○", "×" ],
      comment: ''
  }
}

↓以下のように変換する

[
  {
    name: "一郎",
    votes: [ "○", "△", "×" ],
    comment: "9日はいけません"
  },
  {
    name: "次郎",
    votes: [ "○", "○", "×" ],
    comment: ''
  }
]

*/

export function attendeeVotesObjectToArray(attendees: AttendeeVotesType[]) {
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
}

export function attendeeCommentObjectToArray(attendees: AttendeeCommentType[]) {
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
}
