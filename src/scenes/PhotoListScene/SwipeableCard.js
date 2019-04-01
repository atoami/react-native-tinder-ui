// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';

import { WINDOW_WIDTH } from 'src/constants';
import { MyMarView } from 'src/components';

const CardPadding = 16;
const CardPhotoWidth = WINDOW_WIDTH - CardPadding * 2;
const SwipeDistance = WINDOW_WIDTH / 3;

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
  },
});

class SwipeableCard extends PureComponent {

  constructor(props) {
    super(props);

    const zIndex = props.index > 2 ? 2 : props.index;

    const width = CardPhotoWidth - zIndex * CardPadding * 2;
    const left = zIndex * CardPadding;
    const top = CardPadding * 3 - zIndex * CardPadding;
    const bottom = zIndex * CardPadding;

    this.state = {
      xValue: new Animated.Value(0),
      leftValue: new Animated.Value(left),
      widthValue: new Animated.Value(width),
      topValue: new Animated.Value(top),
      bottomValue: new Animated.Value(bottom),
    };

    this.panResponder = undefined;
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: (evt, gestureState) => {
        this.state.xValue.setValue(gestureState.dx);
        this.props.onSwipe(gestureState.dx);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          if (gestureState.dx >= SwipeDistance) {
            this.pop(true); // Like card!
          } else {
            // Cancel dragging
            // Reset card position to the center
            this.state.xValue.setValue(0);
            this.props.onSwipe(0);
          }
        } else if (gestureState.dx < 0) {
          if (Math.abs(gestureState.dx) >= SwipeDistance) {
            this.pop(false); // Unlike card!
          } else {
            // Cancel dragging
            // Reset card position to the center
            this.state.xValue.setValue(0);
            this.props.onSwipe(0);
          }
        }
      }
    });
  }

  /**
   * Pop card
   * @param liked: boolean - like or unlike
   */
  pop = (liked, onComplete) => {
    // Pop card
    this.props.onPop(liked, this.props.index);

    // Reset like/unlike button status
    this.props.onSwipe(0);

    // Swipe card by screen width to hide
    Animated.timing(this.state.xValue, {
      toValue: WINDOW_WIDTH * (liked ? 1 : -1),
      duration: 300,
      useNativeDriver: true
    }).start(onComplete);
  };

  /**
   * Move card to the front by one
   */
  moveForward = (onComplete) => {
    Animated.parallel(
      [
        Animated.timing(this.state.leftValue, {
          toValue: this.state.leftValue.__getValue() - CardPadding,
          duration: 300,
        }),
        Animated.timing(this.state.widthValue, {
          toValue: this.state.widthValue.__getValue() + CardPadding * 2,
          duration: 300,
        }),
        Animated.timing(this.state.bottomValue, {
          toValue: this.state.bottomValue.__getValue() - CardPadding,
          duration: 300,
        }),
        Animated.timing(this.state.topValue, {
          toValue: this.state.topValue.__getValue() + CardPadding,
          duration: 300,
        })
      ], { useNativeDriver: true }
    ).start(onComplete);
  };

  /**
   * Move card to the back by one
   */
  moveBackward = (onComplete) => {
    if (this.state.leftValue.__getValue() >= 32) {
      return;
    }

    Animated.parallel(
      [
        Animated.timing(this.state.leftValue, {
          toValue: this.state.leftValue.__getValue() + CardPadding,
          duration: 300,
        }),
        Animated.timing(this.state.widthValue, {
          toValue: this.state.widthValue.__getValue() - CardPadding * 2,
          duration: 300,
        }),
        Animated.timing(this.state.bottomValue, {
          toValue: this.state.bottomValue.__getValue() + CardPadding,
          duration: 300,
        }),
        Animated.timing(this.state.topValue, {
          toValue: this.state.topValue.__getValue() - CardPadding,
          duration: 300,
        })
      ], { useNativeDriver: true }
    ).start(onComplete);
  };

  /**
   * Reset card position to the center of the screen
   */
  reset = (onComplete) => {
    Animated.timing(this.state.xValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start(onComplete);
  };

  render() {
    const { index, source } = this.props;

    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            zIndex: 99 - index,
            transform: [{ translateX: this.state.xValue }]
          }
        ]}
      >
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[
            styles.card,
            {
              opacity: 1,
              left: this.state.leftValue,
              width: this.state.widthValue,
              top: this.state.topValue,
              bottom: this.state.bottomValue,
            }
          ]}
        >
          <MyMarView dataSource={source} />
        </Animated.View>
      </Animated.View>
    );
  }
}

SwipeableCard.propTypes = {
  index: PropTypes.number.isRequired,
  source: PropTypes.shape({}).isRequired,
  onPop: PropTypes.func.isRequired,
  onSwipe: PropTypes.func.isRequired,
};

export default SwipeableCard;
