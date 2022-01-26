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
  colors: {
    circle: {
      100: '#9AE6B4',
      200: '#9AE6B4',
      300: '#9AE6B4',
      400: '#9AE6B4',
      500: '#9AE6B4',
      600: '#9AE6B4',
      700: '#9AE6B4',
      800: '#9AE6B4',
      900: '#9AE6B4',
    },
    triangle: {
      100: '#FEF0B3',
      200: '#FEF0B3',
      300: '#FEF0B3',
      400: '#FEF0B3',
      500: '#FEF0B3',
      600: '#FEF0B3',
      700: '#FEF0B3',
      800: '#FEF0B3',
      900: '#FEF0B3',
    },
    x: {
      100: '#FBDFDF',
      200: '#FBDFDF',
      300: '#FBDFDF',
      400: '#FBDFDF',
      500: '#FBDFDF',
      600: '#FBDFDF',
      700: '#FBDFDF',
      800: '#FBDFDF',
      900: '#FBDFDF',
    },
  },
});
