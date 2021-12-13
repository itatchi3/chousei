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
import { Comment, User } from '.prisma/client';

type Props = {
  comments:
    | (Comment & {
        user: User;
      })[]
    | null;
};
export const CommentList = ({ comments }: Props) => {
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
          {comments &&
            comments.map(
              (_comment, i) =>
                _comment.comment !== '' && (
                  <Tr key={i}>
                    <Td key={i} p="2" w="24">
                      <Popover placement="top" flip={false}>
                        <PopoverTrigger>
                          <Center>
                            <Avatar src={_comment.user.profileImg} size="sm" />
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
                          <PopoverBody>{_comment.user.name}</PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Td>
                    <Td align="center" pl="0">
                      {_comment.comment}
                    </Td>
                  </Tr>
                ),
            )}
        </Tbody>
      </Table>
    </>
  );
};
