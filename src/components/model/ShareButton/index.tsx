import { useRecoilValue } from 'recoil';
import { eventState } from 'src/atoms/eventState';
import { useLiff } from 'src/liff/auth';
import {
  Menu,
  MenuButton,
  MenuGroup,
  MenuList,
  Button,
  Flex,
  Input,
  useClipboard,
  IconButton,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';

export const ShareButton = () => {
  const event = useRecoilValue(eventState);
  const { liff, isInClient } = useLiff();
  const { onCopy } = useClipboard(
    event ? `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/event/${event.id}` : '',
  );

  const shareScheduleByLine = () => {
    if (!event || !liff) return;
    if (liff.isApiAvailable('shareTargetPicker')) {
      liff.shareTargetPicker([
        {
          type: 'text',
          text:
            '【イベント名】\n' +
            event.name +
            '\n' +
            '【概要】\n' +
            event.description +
            '\n' +
            `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/event/${event.id}`,
        },
      ]);
    }
  };

  return (
    <>
      {isInClient ? (
        <Button
          sx={{ WebkitTapHighlightColor: 'rgba(0,0,0,0)', _focus: { boxShadow: 'none' } }}
          bg="green.300"
          onClick={shareScheduleByLine}
        >
          友達へ共有する
        </Button>
      ) : (
        <Menu>
          <MenuButton
            as={Button}
            colorScheme="green"
            sx={{ WebkitTapHighlightColor: 'rgba(0,0,0,0)', _focus: { boxShadow: 'none' } }}
          >
            友達へ共有する
          </MenuButton>
          <MenuList mr="4">
            <MenuGroup title="リンクを共有してください">
              <Flex px="4" py="2">
                <Input
                  value={
                    event
                      ? `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/event/${event.id}`
                      : ''
                  }
                  isReadOnly
                />
                <IconButton
                  onClick={onCopy}
                  size="sm"
                  ml="2"
                  sx={{
                    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                    _focus: { boxShadow: 'none' },
                  }}
                  icon={<CopyIcon />}
                  aria-label="copy"
                />
              </Flex>
            </MenuGroup>
          </MenuList>
        </Menu>
      )}
    </>
  );
};
