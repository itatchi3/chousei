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
import { Count } from 'src/pages/event/[id]';

type Props = {
  colors: string[];
  counts: Count[];
};

export const ShareButton = ({ colors, counts }: Props) => {
  const event = useRecoilValue(eventState);
  const { liff, isInClient } = useLiff();
  const { onCopy } = useClipboard(
    event ? `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/event/${event.id}` : '',
  );

  const shareScheduleByLine = () => {
    if (!event || !liff) return;
    if (liff.isApiAvailable('shareTargetPicker')) {
      let shareText =
        '【イベント名】\n' +
        event.name +
        '\n' +
        '【補足・備考】\n' +
        event.description +
        '\n' +
        `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/event/${event.id}`;

      if (colors.includes('green.100') || colors.includes('green.200')) {
        shareText += '\n【おすすめ】';
        let recomendePossibleDate = '';
        colors.map((color, i) => {
          if (color !== 'white') {
            recomendePossibleDate += `\n${event.possibleDates[i].dateString}${event.possibleDates[i].timeWidthString}\n○${counts[i].positiveCount} △${counts[i].evenCount} ×${counts[i].negativeCount}`;
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
