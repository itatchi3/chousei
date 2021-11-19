import { useEffect, useState } from 'react';
import AttendanceTable from 'src/components/model/AttendanceTable';
import {
  respondentVoteListObjectToArray,
  respondentCommentObjectToArray,
} from 'src/utils/DataConvert';
import { useRecoilState } from 'recoil';
import {
  eventState,
  respondentVoteListState,
  EventType,
  respondentCommentState,
} from 'src/atoms/eventState';
import { useLiff } from 'src/hooks/auth';
import { Box, VStack } from '@chakra-ui/react';
import { ShareButton } from 'src/components/model/ShareButton';
import { MoveAnswerScheduleButton } from 'src/components/model/MoveAnswerScheduleButton';
import { AnswerComment } from 'src/components/model/AnswerComment';
import { EventOverView } from 'src/components/model/EventOverView';

type Props = {
  eventId: string;
  eventData: EventType;
};

export const EventDetail = ({ eventId, eventData }: Props) => {
  const { liff } = useLiff();
  const [event, setEvent] = useRecoilState(eventState);
  const [respondentVoteList, setRespondentVoteList] = useRecoilState(respondentVoteListState);
  const [respondentComment, setRespondentComment] = useRecoilState(respondentCommentState);

  useEffect(() => {
    setEvent({
      id: eventId,
      name: eventData.name,
      description: eventData.description,
      candidateDates: eventData.candidateDates,
      respondentVoteLists:
        eventData.respondentVoteLists !== undefined
          ? respondentVoteListObjectToArray(eventData.respondentVoteLists)
          : undefined,
      respondentComments:
        eventData.respondentComments !== undefined
          ? respondentCommentObjectToArray(eventData.respondentComments)
          : undefined,
    });

    const getProfile = async () => {
      const profile = await liff!.getProfile();
      let profileImg: string;
      if (profile.pictureUrl) {
        profileImg = profile.pictureUrl;
      } else {
        profileImg = '';
      }

      setRespondentVoteList((state) => ({
        ...state,
        name: profile.displayName,
        userId: profile.userId,
        profileImg: profileImg,
      }));

      setRespondentComment((state) => ({
        ...state,
        name: profile.displayName,
        userId: profile.userId,
        profileImg: profileImg,
      }));
    };
    getProfile();
  }, [eventData, setEvent, eventId, liff, setRespondentVoteList, setRespondentComment]);
  return (
    <Box p="3">
      <EventOverView />
      <Box pt="4">
        <AttendanceTable />
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
