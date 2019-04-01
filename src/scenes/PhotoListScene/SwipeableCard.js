// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet, Animated, PanResponder,
} from 'react-native';
import { get } from 'lodash';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';

import { IBMPlexSansMedium, IBMPlexSansRegular } from 'src/fonts';
import { Colors } from 'src/theme';
import { WINDOW_WIDTH } from 'src/constants';
import { CachedImageBackground } from 'src/components';

const CardPhotoWidth = WINDOW_WIDTH - 32;
const SwipeDistance = WINDOW_WIDTH / 3;

const styles = StyleSheet.create({
  title: {
    color: Colors.white,
    fontSize: 20,
    lineHeight: 28,
    height: 28,
    marginHorizontal: 32,
    marginTop: 32
  },
  explanation: {
    color: Colors.white,
    marginHorizontal: 32,
    fontSize: 14
  },
  card: {
    position: 'absolute',
  },
});

class SwipeableCard extends PureComponent {

  constructor(props) {
    super(props);

    const zIndex = props.index > 2 ? 2 : props.index;

    const width = CardPhotoWidth - zIndex * 32;
    const left = zIndex * 16;
    const top = 48 - zIndex * 16;
    const bottom = zIndex * 16;

    this.state = {
      finishedLoading: false,
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
          toValue: this.state.leftValue.__getValue() - 16,
          duration: 300,
        }),
        Animated.timing(this.state.widthValue, {
          toValue: this.state.widthValue.__getValue() + 32,
          duration: 300,
        }),
        Animated.timing(this.state.bottomValue, {
          toValue: this.state.bottomValue.__getValue() - 16,
          duration: 300,
        }),
        Animated.timing(this.state.topValue, {
          toValue: this.state.topValue.__getValue() + 16,
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
          toValue: this.state.leftValue.__getValue() + 16,
          duration: 300,
        }),
        Animated.timing(this.state.widthValue, {
          toValue: this.state.widthValue.__getValue() - 32,
          duration: 300,
        }),
        Animated.timing(this.state.bottomValue, {
          toValue: this.state.bottomValue.__getValue() + 16,
          duration: 300,
        }),
        Animated.timing(this.state.topValue, {
          toValue: this.state.topValue.__getValue() - 16,
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
          <CachedImageBackground
            source={{ uri: get(source, 'url') }}
            style={{
              ...StyleSheet.absoluteFill,
              backgroundColor: Colors.white,
              shadowColor: '#000',
              shadowOffset: {
                width: 2,
                height: 2
              },
              shadowOpacity: 0.6,
              shadowRadius: 2,
              elevation: 10,
              borderRadius: 8,
            }}
            resizeMode={'cover'}
            borderRadius={8}
            onLoadEnd={() => this.setState({ finishedLoading: true })}
          >
            {this.state.finishedLoading &&
              <LinearGradient
                style={[StyleSheet.absoluteFill, { borderRadius: 8 }]}
                locations={[0, 0.3, 0.7, 1]}
                colors={[
                  'rgba(0, 0, 0, 0.8)',
                  'rgba(0, 0, 0, 0)',
                  'rgba(0, 0, 0, 0)',
                  'rgba(0, 0, 0, 0.3)'
                ]}
              />
            }
            {this.state.finishedLoading &&
              <View>
                <IBMPlexSansMedium style={styles.title} numberOfLines={1}>
                  {get(source, 'title', 'No title')}
                </IBMPlexSansMedium>
                <IBMPlexSansRegular numberOfLines={1} style={styles.explanation}>
                  {get(source, 'explanation')}
                </IBMPlexSansRegular>
                <IBMPlexSansRegular style={styles.explanation}>
                  {moment(get(source, 'date'), 'YYYY-MM-DD').format('MMM DD, YYYY')}
                </IBMPlexSansRegular>
              </View>
            }
          </CachedImageBackground>
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
