import { RespondentVoteListType } from 'src/atoms/eventState';
import { RespondentCommentType } from 'src/atoms/eventState';

export const respondentVoteListObjectToArray = (respondents: RespondentVoteListType[]) => {
  if (!respondents) {
    return [];
  }
  const respondentsArray = Object.entries(respondents).map((entry) => ({
    userId: entry[1].userId,
    name: entry[1].name,
    profileImg: entry[1].profileImg,
    voteList: entry[1].voteList,
  }));
  return respondentsArray;
};

export const respondentCommentObjectToArray = (respondents: RespondentCommentType[]) => {
  if (!respondents) {
    return [];
  }
  const respondentsArray = Object.entries(respondents).map((entry) => ({
    userId: entry[1].userId,
    name: entry[1].name,
    profileImg: entry[1].profileImg,
    comment: entry[1].comment,
  }));
  return respondentsArray;
};
