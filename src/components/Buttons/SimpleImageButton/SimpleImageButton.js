// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewPropTypes,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  text: {
    fontFamily: 'ProximaNova-Regular',
    fontSize: 12,
    color: 'white',
    marginLeft: 3
  }
});

export function SimpleImageButton({
  style,
  textStyle,
  onPress,
  title,
  icon
}) {
  return (
    <TouchableOpacity
      disabled={!onPress}
      style={[styles.container, style]}
      onPress={onPress}
      hitSlop={{
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }}
    >
      {icon}
      {title &&
        <Text
          allowFontScaling={false}
          style={[styles.text, textStyle, { paddingRight: icon ? 3 : 0 }]}
        >
          {title}
        </Text>
      }
    </TouchableOpacity>
  );
}

SimpleImageButton.propTypes = {
  style: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  onPress: PropTypes.func,
  title: PropTypes.string,
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({}),
    PropTypes.number
  ]),
};

SimpleImageButton.defaultProps = {
  onPress: undefined,
  style: {},
  textStyle: {},
  title: undefined,
  icon: undefined,
};
