import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { eventIdState } from 'src/atoms/eventState';
import { useEventDetailQuery } from 'src/hooks/useEventDetail';

export const EditButton = () => {
  const router = useRouter();
  const id = useRecoilValue(eventIdState);
  const { data: eventDetail } = useEventDetailQuery(id);

  const moveAnswerSchedule = () => {
    if (!eventDetail) return;
    router.push({
      pathname: `/event/${eventDetail.event.id}/edit`,
    });
  };
  return (
    <>
      <Button size="sm" onClick={moveAnswerSchedule} variant="ghost" colorScheme="gray">
        編集
      </Button>
    </>
  );
};
