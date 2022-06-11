import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useLiff } from 'src/liff/auth';
import { Button } from '@chakra-ui/react';
import { useEventDetailQuery } from 'src/hooks/useEventDetail';
import { useRecoilValue } from 'recoil';
import { eventIdState } from 'src/atoms/eventState';

export const MoveAnswerScheduleButton = () => {
  const id = useRecoilValue(eventIdState);
  const { data: eventDetail } = useEventDetailQuery(id);
  const { userId } = useLiff();
  const [isAnsweredVoteArray, setIsAnsweredVoteArray] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const moveAnswerSchedule = () => {
    if (!eventDetail) return;
    setIsLoading(true);
    router.push({
      pathname: `/event/${eventDetail.event.id}/input`,
    });
  };

  useEffect(() => {
    if (!eventDetail || !userId) return;
    eventDetail.event.participants
      .filter((participant) => participant.isVote)
      .map((participant) => {
        if (participant.userId === userId) {
          setIsAnsweredVoteArray(true);
        }
      });
  }, [eventDetail, userId]);
  return (
    <>
      <Button w="44" isLoading={isLoading} onClick={moveAnswerSchedule}>
        {isAnsweredVoteArray ? '予定を修正する' : ' 予定を入力する'}
      </Button>
    </>
  );
};
