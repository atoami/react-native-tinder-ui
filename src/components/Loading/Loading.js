// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Colors } from 'src/theme';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  }
});

export function Loading(props) {
  const { showOverlay } = props;

  return (
    <View
      style={[styles.container,
        {
          backgroundColor: showOverlay
            ? 'rgba(0, 0, 0, 0.5)'
            : 'transparent'
        }
      ]}
    >
      <ActivityIndicator
        color={Colors.cerulean}
        {...props}
      />
    </View>
  );
}

Loading.propTypes = {
  ...ActivityIndicator.PropTypes,
  size: PropTypes.string,
  animating: PropTypes.bool,
  showOverlay: PropTypes.bool,
};

Loading.defaultProps = {
  size: 'large',
  animating: true,
  showOverlay: false
};
