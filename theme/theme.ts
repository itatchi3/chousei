import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      button: {
        WebkitTapHighlightColor: 'rgba(0,0,0,0) !important',
        _focus: { boxShadow: 'none !important' },
      },
    },
  },
});
