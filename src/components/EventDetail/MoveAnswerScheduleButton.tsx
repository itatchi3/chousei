import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { eventState } from 'src/atoms/eventState';
import { useLiff } from 'src/liff/auth';
import { Button } from '@chakra-ui/react';

export const MoveAnswerScheduleButton = () => {
  const event = useRecoilValue(eventState);
  const { userId } = useLiff();
  const [isAnsweredVoteArray, setIsAnsweredVoteArray] = useState(false);
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
          setIsAnsweredVoteArray(true);
        }
      });
  }, [event, userId]);
  return (
    <>
      <Button w="44" isLoading={isLoading} onClick={moveAnswerSchedule}>
        {isAnsweredVoteArray ? '予定を修正する' : ' 予定を入力する'}
      </Button>
    </>
  );
};
