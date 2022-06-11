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
import { useEventDetailQuery } from 'src/hooks/useEventDetail';
import { useRecoilValue } from 'recoil';
import { eventIdState } from 'src/atoms/eventState';

export const ShareButton = () => {
  const id = useRecoilValue(eventIdState);
  const { data: eventDetail } = useEventDetailQuery(id);
  const { liff, isInClient } = useLiff();
  const { onCopy } = useClipboard(
    eventDetail
      ? `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/event/${eventDetail.event.id}`
      : '',
  );

  const shareScheduleByLine = () => {
    if (!eventDetail || !liff) return;
    if (liff.isApiAvailable('shareTargetPicker')) {
      let shareText =
        '【イベント名】\n' +
        eventDetail.event.name +
        '\n' +
        '【補足・備考】\n' +
        eventDetail.event.description +
        '\n' +
        `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/event/${eventDetail.event.id}`;

      if (eventDetail.colors.includes('green.100') || eventDetail.colors.includes('green.200')) {
        shareText += '\n【おすすめ】';
        let recomendePossibleDate = '';
        eventDetail.colors.map((color, i) => {
          if (color !== 'white') {
            recomendePossibleDate += `\n${eventDetail.event.possibleDates[i].dateString}${eventDetail.event.possibleDates[i].timeWidthString}\n○${eventDetail.counts[i].positiveCount} △${eventDetail.counts[i].evenCount} ×${eventDetail.counts[i].negativeCount}`;
          }
        });
        shareText += recomendePossibleDate;
      }

      liff.shareTargetPicker([
        {
          type: 'text',
          text: shareText,
        },
      ]);
    }
  };

  return (
    <>
      {isInClient ? (
        <Button bg="green.300" onClick={shareScheduleByLine}>
          友達へ共有する
        </Button>
      ) : (
        <Menu>
          <MenuButton as={Button} colorScheme="green">
            友達へ共有する
          </MenuButton>
          <MenuList mr="4">
            <MenuGroup title="リンクを共有してください">
              <Flex px="4" py="2">
                <Input
                  value={
                    eventDetail
                      ? `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/event/${eventDetail.event.id}`
                      : ''
                  }
                  isReadOnly
                />
                <IconButton
                  onClick={onCopy}
                  size="sm"
                  ml="2"
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
