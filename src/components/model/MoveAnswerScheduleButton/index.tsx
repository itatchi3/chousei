import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { eventState, respondentVoteListState } from 'src/atoms/eventState';
import { Button } from '@chakra-ui/react';

export const MoveAnswerScheduleButton = () => {
  const event = useRecoilValue(eventState);
  const [respondentVoteList, setRespondentVoteList] = useRecoilState(respondentVoteListState);
  const [isAnsweredVoteList, setIsAnsweredVoteList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const moveAnswerSchedule = () => {
    setIsLoading(true);
    router.push({
      pathname: `/event/${event.id}/input`,
    });
  };

  useEffect(() => {
    if (event.respondentVoteLists === undefined) {
      return;
    }
    event.respondentVoteLists!.map((respondent) => {
      if (respondent.userId === respondentVoteList.userId) {
        setIsAnsweredVoteList(true);
        setRespondentVoteList((state) => ({
          ...state,
          voteList: respondent.voteList,
        }));
      }
    });
  }, [respondentVoteList.userId, event.respondentVoteLists, setRespondentVoteList]);
  return (
    <>
      <Button
        sx={{
          WebkitTapHighlightColor: 'rgba(0,0,0,0)',
          _focus: { boxShadow: 'none' },
        }}
        w="44"
        isLoading={isLoading}
        onClick={moveAnswerSchedule}
      >
        {isAnsweredVoteList ? '予定を修正する' : ' 予定を入力する'}
      </Button>
    </>
  );
};
