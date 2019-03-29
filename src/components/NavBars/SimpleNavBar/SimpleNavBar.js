// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image
} from 'react-native';
import { Colors } from 'src/theme';
import { STATUSBAR_HEIGHT, NAVBAR_HEIGHT } from 'src/constants';
import { IBMPlexSansBold } from 'src/fonts';

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        paddingTop: STATUSBAR_HEIGHT,
        height: NAVBAR_HEIGHT + STATUSBAR_HEIGHT
      },
      android: {
        height: NAVBAR_HEIGHT
      }
    }),
    overflow: 'visible',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 31,
    backgroundColor: Colors.white
  },
  title: {
    color: Colors.gableGreen,
    fontSize: 18
  },
  gap: {
    width: 20
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: Colors.burntSienna
  },
  buttonText: {
    fontSize: 16,
    color: Colors.burntSienna
  },
  titleView: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    ...Platform.select({
      ios: {
        top: STATUSBAR_HEIGHT,
      },
    }),
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const renderLeftText = (leftAction, leftText) => {
  if (!leftAction && !leftText) {
    return (
      <View style={styles.gap} />
    );
  }

  return (
    <TouchableOpacity
      disabled={!leftAction}
      onPress={leftAction}
      hitSlop={{
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }}
    >
      <IBMPlexSansBold
        style={[
          styles.buttonText,
          {
            color: leftAction ? Colors.burntSienna : Colors.geyser
          }
        ]}
      >
        {leftText}
      </IBMPlexSansBold>
    </TouchableOpacity>
  );
};

const renderLeftButton = (leftAction, leftIcon) => {
  if (!leftAction && !leftIcon) {
    return (
      <View style={styles.gap} />
    );
  }

  return (
    <TouchableOpacity
      disabled={!leftAction}
      onPress={leftAction}
      hitSlop={{
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }}
    >
      <Image
        source={leftIcon}
        style={[styles.icon, { tintColor: leftAction ? Colors.burntSienna : Colors.geyser }]}
      />
    </TouchableOpacity>
  );
};

const renderRightButton = (rightAction, rightIcon) => {
  if (!rightAction && !rightIcon) {
    return (
      <View style={styles.gap} />
    );
  }

  return (
    <TouchableOpacity
      disabled={!rightAction}
      onPress={rightAction}
      hitSlop={{
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }}
    >
      <Image
        source={rightIcon}
        style={[styles.icon, { tintColor: rightAction ? Colors.burntSienna : Colors.geyser }]}
      />
    </TouchableOpacity>
  );
};

const renderRightText = (rightAction, rightText) => {
  if (!rightAction && !rightText) {
    return (
      <View style={styles.gap} />
    );
  }

  return (
    <TouchableOpacity
      disabled={!rightAction}
      onPress={rightAction}
      hitSlop={{
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }}
    >
      <IBMPlexSansBold
        style={[
          styles.buttonText,
          {
            color: rightAction ? Colors.burntSienna : Colors.geyser
          }
        ]}
      >
        {rightText}
      </IBMPlexSansBold>
    </TouchableOpacity>
  );
};

export function SimpleNavBar({
  title,
  leftAction,
  leftText,
  leftIcon,
  rightAction,
  rightIcon,
  rightText,
  backgroundColor
}) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.titleView}>
        <IBMPlexSansBold style={styles.title}>
          {title}
        </IBMPlexSansBold>
      </View>
      {leftText && renderLeftText(leftAction, leftText)}
      {!leftText && renderLeftButton(leftAction, leftIcon)}
      {rightText && renderRightText(rightAction, rightText)}
      {!rightText && renderRightButton(rightAction, rightIcon)}
    </View>
  );
}

SimpleNavBar.propTypes = {
  title: PropTypes.string,
  leftAction: PropTypes.func,
  leftText: PropTypes.string,
  leftIcon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({}),
    PropTypes.number
  ]),
  rightAction: PropTypes.func,
  rightIcon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({}),
    PropTypes.number
  ]),
  rightText: PropTypes.string,
  backgroundColor: PropTypes.string,
};

SimpleNavBar.defaultProps = {
  title: undefined,
  leftText: undefined,
  leftAction: undefined,
  leftIcon: undefined,
  rightAction: undefined,
  rightIcon: undefined,
  rightText: undefined,
  backgroundColor: Colors.white
};
