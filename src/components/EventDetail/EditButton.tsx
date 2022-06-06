import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEventDetailQuery } from 'src/hooks/useEventDetail';

export const EditButton = () => {
  const router = useRouter();
  const { data: eventDetail } = useEventDetailQuery();

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
