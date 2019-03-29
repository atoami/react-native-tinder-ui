// @flow

import React from 'react';
import { Navigation } from 'react-native-navigation';

import {
  PhotoListScene,
  FavoriteListScene,
} from 'src/scenes';

import {
  PHOTO_LIST_SCENE,
  FAVORITE_LIST_SCENE,
} from './constants';

export default function () {
  Navigation.registerComponent(PHOTO_LIST_SCENE, () => PhotoListScene);
  Navigation.registerComponent(FAVORITE_LIST_SCENE, () => FavoriteListScene);
  console.info('All screens have been registered...');
}
