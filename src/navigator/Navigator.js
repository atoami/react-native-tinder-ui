// @flow

import { Navigation } from 'react-native-navigation';
import { NativeModules } from 'react-native';

import {
  PHOTO_LIST_SCENE,
} from './constants';

import registerScreens from './registerScreens';

const { UIManager } = NativeModules;

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

registerScreens();

export function startApp() {
  Navigation.setDefaultOptions({
    topBar: {
      visible: false,
      drawBehind: true
    },
    statusBar: {
      style: 'dark'
    },
    layout: {
      orientation: ['portrait']
    },
  });

  Navigation.setRoot({
    root: {
      stack: {
        children: [{
          component: {
            name: PHOTO_LIST_SCENE,
          }
        }]
      }
    }
  });
}
