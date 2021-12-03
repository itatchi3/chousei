import { ChakraProvider } from '@chakra-ui/react';
import { Story } from '@storybook/react';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { theme } from '../theme/theme';

const withChakra = (Story: Story) => {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Story />
      </ChakraProvider>
    </RecoilRoot>
  );
};

export const decorators = [withChakra];
