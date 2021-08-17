import { AttendeeType } from 'src/atoms/eventState';

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

export function attendeesObjectToArray(attendees: AttendeeType[]) {
  if (!attendees) {
    return [];
  }
  const attendeesArray = Object.entries(attendees).map((entry) => ({
    userId: entry[1].userId,
    name: entry[1].name,
    comment: entry[1].comment,
    votes: entry[1].votes,
    profileImg: entry[1].profileImg,
  }));
  return attendeesArray;
}
