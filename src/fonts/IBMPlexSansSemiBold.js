import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'IBMPlexSans-SemiBold',
  }
});

export function IBMPlexSansSemiBold({ style, ...props }) {
  return (
    <Text allowFontScaling={false} {...props} style={[styles.text, style]} />
  );
}

IBMPlexSansSemiBold.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.any,
  ]),
  style: Text.propTypes.style,
};

IBMPlexSansSemiBold.defaultProps = {
  children: undefined,
  style: {}
};
