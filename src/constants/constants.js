// @flow

import { Dimensions, StatusBar, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
export const isIOS = Platform.OS === 'ios';

export const WINDOW_WIDTH = width;
export const WINDOW_HEIGHT = height;
export const IS_IPHONE_X = WINDOW_HEIGHT === 812;
export const STATUSBAR_HEIGHT = isIOS
  ? IS_IPHONE_X
    ? 35
    : 20
  : StatusBar.currentHeight;
export const NAVBAR_HEIGHT = isIOS ? 54 : WINDOW_HEIGHT * 0.066;
export const NAV_TAB_BAR_HEIGHT = isIOS ? 49 : 56;
export const BOTTOM_SPACING_HEIGHT = 30;
export const STATUSBAR_PADDING = isIOS ? STATUSBAR_HEIGHT : 0;

export const NASA_API_KEY = 'd6mcDhS3ASwqIlAwiO9bPin3tLeVGDOjvZ3jFYpp';
export const SYSTEM_MESSAGES = {
  FROM_REQUEST: {
    title: 'Something went wrong',
    description: 'We are currently experiencing technical difficulties, please try again later.',
  },
  NOT_SUPPORTED_LINK: {
    title: 'Not Supported',
    description: 'Current link is not supported'
  }
};
