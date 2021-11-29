import { Box, Heading } from '@chakra-ui/react';

type Props = {
  name: string | null;
  description: string | null;
};

export const EventOverView = ({ name, description }: Props) => {
  return (
    <>
      <Heading>{name}</Heading>
      <Box px="1" pt="2">
        {description}
      </Box>
    </>
  );
};
