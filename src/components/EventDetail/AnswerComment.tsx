import { useEffect, useState, useRef } from 'react';
import { useLiff } from 'src/liff/auth';
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
import { useEventDetailQuery } from 'src/hooks/useEventDetail';
import { useRecoilValue } from 'recoil';
import { eventIdState } from 'src/atoms/eventState';

export const AnswerComment = () => {
  const id = useRecoilValue(eventIdState);
  const { data: eventDetail } = useEventDetailQuery(id);
  const { userId, idToken } = useLiff();
  const [isAnsweredComment, setIsAnsweredComment] = useState(false);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

  const handleInputComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const registerComment = async () => {
    if (!eventDetail) return;
    setIsLoading(true);
    try {
      const body = {
        comment: comment,
        eventId: eventDetail.event.id,
        idToken: idToken,
      };

      const res = await fetch(`/api/updateComment`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const json: { ok?: boolean; error?: string } = await res.json();
      if (!json.ok) {
        throw json.error;
      }
      location.reload();
    } catch (error) {
      alert(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!eventDetail || !eventDetail.event.comments || !userId) return;

    eventDetail.event.comments.map((_comment) => {
      if (_comment.userId === userId && _comment.comment !== '') {
        setComment(_comment.comment);
        setIsAnsweredComment(true);
      }
    });
  }, [eventDetail, userId]);

  return (
    <>
      <Button onClick={onOpen} w="44">
        {isAnsweredComment ? 'コメントを修正する' : 'コメントを入力する'}
      </Button>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay />
        <ModalContent>
          {comment.length <= 255 ? (
            <ModalHeader>コメントを入力してください</ModalHeader>
          ) : (
            <ModalHeader color="crimson">255字以内にしてください</ModalHeader>
          )}

          <ModalBody>
            <Textarea
              isInvalid={comment.length > 255}
              value={comment}
              onChange={handleInputComment}
              ref={initialRef}
              rows={6}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={registerComment}
              isLoading={isLoading}
              isDisabled={comment.length > 255}
            >
              保存
            </Button>
            <Button onClick={onClose}>閉じる</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
