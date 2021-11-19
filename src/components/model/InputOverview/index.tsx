import { Box, Circle, Flex, Text } from '@chakra-ui/react';
import { InputEventName } from 'src/components/model/InputEventName';
import { InputEventDiscription } from 'src/components/model/InputEventDiscription';

export const InputEventOverview = () => {
  return (
    <>
      <Flex align="center">
        <Circle size="30px" bg="green.500" color="white" fontWeight="bold">
          1
        </Circle>
        <Text fontSize="lg" fontWeight="bold" pl="4">
          イベント概要を入力
        </Text>
      </Flex>
      <Box p="3">
        <Box>
          <InputEventName />
        </Box>
        <Box pt="2">
          <InputEventDiscription />
        </Box>
      </Box>
    </>
  );
};
