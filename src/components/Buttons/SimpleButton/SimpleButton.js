// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewPropTypes,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: 'black',
    backgroundColor: 'transparent'
  }
});

export function SimpleButton({
  style,
  text,
  onPress,
  textStyle
}) {
  return (
    <TouchableOpacity
      disabled={!onPress}
      style={[styles.container, style]}
      onPress={onPress}
      hitSlop={{
        left: 20,
        right: 20,
        top: 20,
        bottom: 20
      }}
    >
      <Text
        allowFontScaling={false}
        style={[styles.text, textStyle, { opacity: onPress ? 1 : 0.5 }]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

SimpleButton.propTypes = {
  style: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  onPress: PropTypes.func,
  text: PropTypes.string
};

SimpleButton.defaultProps = {
  onPress: undefined,
  style: {},
  textStyle: {},
  text: '',
};
