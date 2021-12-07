import { useEffect, useState, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { eventState } from 'src/atoms/eventState';
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

export const AnswerComment = () => {
  const event = useRecoilValue(eventState);
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
    if (!event) return;
    setIsLoading(true);
    try {
      const body = {
        comment: comment,
        eventId: event.id,
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
    if (!event || !event.comments.length) return;

    event.comments.map((_comment) => {
      if (_comment.userId === userId && _comment.comment !== '') {
        setComment(_comment.comment);
        setIsAnsweredComment(true);
      }
    });
  }, [event, userId]);

  return (
    <>
      <Button onClick={onOpen}>
        {isAnsweredComment ? 'コメントを修正する' : 'コメントを入力する'}
      </Button>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>コメントを入力してください</ModalHeader>
          <ModalBody>
            <Textarea value={comment} onChange={handleInputComment} ref={initialRef} rows={6} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={registerComment} isLoading={isLoading}>
              保存
            </Button>
            <Button onClick={onClose}>閉じる</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
