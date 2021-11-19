import { useEffect, useState, useRef } from 'react';
import { database } from 'src/utils/firebase';
import { useRecoilState, useRecoilValue } from 'recoil';
import { eventState, respondentCommentState } from 'src/atoms/eventState';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Button,
  Textarea,
} from '@chakra-ui/react';

export const AnswerComment = () => {
  const event = useRecoilValue(eventState);
  const [respondentComments, setRespondentComment] = useRecoilState(respondentCommentState);
  const [isAnsweredComment, setIsAnsweredComment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

  const handleInputComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRespondentComment((state) => ({
      ...state,
      comment: e.target.value,
    }));
  };

  const registerComment = async () => {
    setIsLoading(true);
    const respondentData = {
      userId: respondentComments.userId,
      name: respondentComments.name,
      profileImg: respondentComments.profileImg,
      comment: respondentComments.comment,
    };
    await database
      .ref(`events/${event.id}/respondentComments/${respondentData.userId}`)
      .set(respondentData);
    location.reload();
  };

  useEffect(() => {
    if (event.respondentComments === undefined) {
      return;
    }
    event.respondentComments!.map((answeredRespondent) => {
      if (answeredRespondent.userId === respondentComments.userId) {
        setIsAnsweredComment(true);
        setRespondentComment((state) => ({
          ...state,
          comment: answeredRespondent.comment,
        }));
      }
    });
  }, [respondentComments.userId, event.respondentComments, setRespondentComment]);

  return (
    <>
      <Button
        sx={{
          WebkitTapHighlightColor: 'rgba(0,0,0,0)',
          _focus: { boxShadow: 'none' },
        }}
        onClick={onOpen}
      >
        {isAnsweredComment ? 'コメントを修正する' : 'コメントを入力する'}
      </Button>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>コメントを入力してください</ModalHeader>
          <ModalBody>
            <Textarea
              value={respondentComments.comment}
              onChange={handleInputComment}
              ref={initialRef}
              rows={6}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              sx={{
                WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                _focus: { boxShadow: 'none' },
              }}
              colorScheme="blue"
              mr={3}
              onClick={registerComment}
              isLoading={isLoading}
            >
              保存
            </Button>
            <Button
              sx={{
                WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                _focus: { boxShadow: 'none' },
              }}
              onClick={onClose}
            >
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
