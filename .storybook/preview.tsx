import { ChakraProvider } from '@chakra-ui/react';
import { Story } from '@storybook/react';
import React from 'react';

import { theme } from '../theme/theme';

const withChakra = (Story: Story) => {
  return (
    <ChakraProvider theme={theme}>
      <Story />
    </ChakraProvider>
  );
};

export const decorators = [withChakra];
