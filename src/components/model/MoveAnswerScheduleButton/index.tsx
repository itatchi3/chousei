import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { eventState } from 'src/atoms/eventState';
import { useLiff } from 'src/liff/auth';
import { Button } from '@chakra-ui/react';

export const MoveAnswerScheduleButton = () => {
  const event = useRecoilValue(eventState);
  const { userId } = useLiff();
  const [isAnsweredVoteList, setIsAnsweredVoteList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const moveAnswerSchedule = () => {
    if (!event) return;
    setIsLoading(true);
    router.push({
      pathname: `/event/${event.id}/input`,
    });
  };

  useEffect(() => {
    if (!event) return;
    event.participants
      .filter((participant) => participant.isVote)
      .map((participant) => {
        if (participant.userId === userId) {
          setIsAnsweredVoteList(true);
        }
      });
  }, [event, userId]);
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
