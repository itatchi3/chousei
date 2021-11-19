import { eventState } from 'src/atoms/eventState';
import { Avatar } from '@chakra-ui/react';
import {
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  Center,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

export const CommentList = () => {
  const event = useRecoilValue(eventState);

  return (
    <>
      <Table>
        <Tbody>
          <Tr>
            <Th size="small">コメント</Th>
          </Tr>
        </Tbody>
      </Table>
      <Table>
        <Tbody>
          {event.respondentComments !== undefined &&
            event.respondentComments.map(
              (respondent, i) =>
                respondent.comment !== '' && (
                  <Tr key={i}>
                    <Td key={i} p="2" w="24">
                      <Popover placement="top">
                        <PopoverTrigger>
                          <Center>
                            <Avatar src={respondent.profileImg} size="sm" />
                          </Center>
                        </PopoverTrigger>
                        <PopoverContent
                          w="auto"
                          sx={{ _focus: { boxShadow: 'none', outline: 'none' } }}
                          fontWeight="bold"
                          color="gray.600"
                          fontSize="xs"
                        >
                          <PopoverArrow />
                          <PopoverBody>{respondent.name}</PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Td>
                    <Td align="center" pl="0">
                      {respondent.comment}
                    </Td>
                  </Tr>
                ),
            )}
        </Tbody>
      </Table>
    </>
  );
};
