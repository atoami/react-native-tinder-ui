/** @format */

import { Navigation } from 'react-native-navigation';
import { startApp } from 'src/navigator';

Navigation.events().registerAppLaunchedListener(() => startApp());
