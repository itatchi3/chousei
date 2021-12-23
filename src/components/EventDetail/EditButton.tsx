import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { eventState } from 'src/atoms/eventState';

export const EditButton = () => {
  const router = useRouter();
  const event = useRecoilValue(eventState);

  const moveAnswerSchedule = () => {
    if (!event) return;
    router.push({
      pathname: `/event/${event.id}/edit`,
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
