// @flow

import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import * as Progress from 'react-native-progress';

import { Colors } from 'src/theme';
import { MSImageView } from '../MSImageView';

export function CachedImageBackground({
  children,
  style,
  imageStyle,
  ...props
}) {
  return (
    <View style={style}>
      <MSImageView
        style={[
          StyleSheet.absoluteFill,
          {
            width: style.width,
            height: style.height,
          },
          imageStyle,
        ]}
        indicator={Progress.Circle}
        indicatorProps={{
          size: 35,
          thickness: 1,
          borderWidth: 0,
          color: Colors.burntSienna,
        }}
        {...props}
        threshold={50}
      />
      {children}
    </View>
  );
}
