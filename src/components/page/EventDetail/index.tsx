import { useEffect } from 'react';
import { AttendanceTable } from 'src/components/model/AttendanceTable';
import {
  respondentVoteListObjectToArray,
  respondentCommentObjectToArray,
} from 'src/utils/DataConvert';
import { useRecoilState } from 'recoil';
import { eventState, EventType } from 'src/atoms/eventState';
import { useLiff } from 'src/hooks/auth';
import { Box, VStack } from '@chakra-ui/react';
import { ShareButton } from 'src/components/model/ShareButton';
import { MoveAnswerScheduleButton } from 'src/components/model/MoveAnswerScheduleButton';
import { AnswerComment } from 'src/components/model/AnswerComment';
import { EventOverView } from 'src/components/model/EventOverView';
import { CommentList } from 'src/components/model/CommentList';

type Props = {
  eventData: EventType;
};

export const EventDetail = ({ eventData }: Props) => {
  const { liff } = useLiff();
  const [event, setEvent] = useRecoilState(eventState);
  // const [respondentComment, setRespondentComment] = useRecoilState(respondentCommentState);

  useEffect(() => {
    setEvent(eventData);

    // const getProfile = async () => {
    //   const profile = await liff!.getProfile();
    //   let profileImg: string;
    //   if (profile.pictureUrl) {
    //     profileImg = profile.pictureUrl;
    //   } else {
    //     profileImg = '';
    //   }

    //   setRespondentVoteList((state) => ({
    //     ...state,
    //     name: profile.displayName,
    //     userId: profile.userId,
    //     profileImg: profileImg,
    //   }));

    //   setRespondentComment((state) => ({
    //     ...state,
    //     name: profile.displayName,
    //     userId: profile.userId,
    //     profileImg: profileImg,
    //   }));
    // };
    // getProfile();
  }, [eventData, setEvent]);
  console.log(event);
  return (
    <Box p="3">
      <EventOverView />
      <Box pt="4">
        <AttendanceTable />
        <CommentList />
      </Box>
      <VStack justify="center" p="6">
        <MoveAnswerScheduleButton />
        <AnswerComment />
        <Box pt="4">
          <ShareButton />
        </Box>
      </VStack>
    </Box>
  );
};
