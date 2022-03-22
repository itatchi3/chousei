import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { isCancelModalState } from 'src/atoms/eventState';
import {
  Box,
  Button,
  Flex,
  Image,
  Link,
  ModalFooter,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useLiff } from 'src/liff/auth';

export const NotFriendModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { liff } = useLiff();
  const [isCancel, setIsCancel] = useRecoilState(isCancelModalState);

  const handleClose = () => {
    setIsOpen(false);
    setIsCancel(true);
  };

  useEffect(() => {
    if (!liff || isCancel) return;
    const func = async () => {
      try {
        const friendFlag = await liff.getFriendship();
        setIsOpen(!friendFlag.friendFlag);
      } catch (e) {
        console.error(e);
      }
    };
    func();
  }, [liff, isCancel]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>おすすめ</ModalHeader>
        <ModalBody>
          <Box fontWeight="bold">
            チョーセイ公式アカウントと友だちになると、イベントが作成できるようになります。
          </Box>
          <Flex direction="column" alignItems="center" pt="7">
            <Image
              borderRadius="full"
              src="/chouseiIcon.PNG"
              alt="アイコン"
              height="80px"
              width="80px"
            />
            <Box fontWeight="bold" pt="2" pb="5">
              チョーセイ
            </Box>

            <Link href="https://lin.ee/InOsTpg" sx={{ _focus: { outline: 'none !important' } }}>
              <Image
                src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png"
                alt="友だち追加"
                height="43.45px"
                width="140px"
              />
            </Link>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={handleClose}>
            キャンセル
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
