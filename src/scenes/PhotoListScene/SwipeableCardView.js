import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  PanResponder,
  Animated,
  Dimensions
} from 'react-native';
import PhotoPreviewItem from "./PhotoListScene";

const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create(
  {
    container:
      {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0
      },

    card:
      {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      },

    cardTitle:
      {
        color: 'white',
        fontSize: 25
      },

    leftText:
      {
        position: 'absolute',
        top: 20,
        right: 30,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30,
        backgroundColor: 'transparent'
      },

    rightText:
      {
        position: 'absolute',
        top: 20,
        left: 30,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30,
        backgroundColor: 'transparent'
      }
  });

class SwipeableCardView extends React.PureComponent {

  constructor(props) {
    super(props);

    this.panResponder;

    this.state = { xValue: new Animated.Value(0) }

    this.cardOpacity = new Animated.Value(1);
  }

  componentWillMount()
  {
    this.panResponder = PanResponder.create(
      {
        onStartShouldSetPanResponder: (evt, gestureState) => false,

        onStartShouldSetPanResponderCapture: (evt, gestureState) => false,

        onMoveShouldSetPanResponder: (evt, gestureState) => true,

        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

        onPanResponderMove: (evt, gestureState) =>
        {
          this.state.xValue.setValue(gestureState.dx);

          if( gestureState.dx > DEVICE_WIDTH - 250 )
          {
            this.setState({ showRightSwipeText: true, showLeftSwipeText: false });
          }
          else if( gestureState.dx < -DEVICE_WIDTH + 250 )
          {
            this.setState({ showLeftSwipeText: true, showRightSwipeText: false });
          }
        },

        onPanResponderRelease: (evt, gestureState) =>
        {
          if( gestureState.dx < DEVICE_WIDTH - 150 && gestureState.dx > -DEVICE_WIDTH + 150 )
          {
            this.setState({ showLeftSwipeText: false, showRightSwipeText: false });

            Animated.spring( this.state.xValue,
              {
                toValue: 0,
                speed: 5,
                bounciness: 10,
              }, { useNativeDriver: true }).start();
          }
          else if( gestureState.dx > DEVICE_WIDTH - 150 )
          {
            Animated.parallel(
              [
                Animated.timing( this.state.xValue,
                  {
                    toValue: DEVICE_WIDTH,
                    duration: 200
                  }),

                Animated.timing( this.cardOpacity,
                  {
                    toValue: 0,
                    duration: 200
                  })
              ], { useNativeDriver: true }).start(() =>
            {
              this.setState({ showLeftSwipeText: false, showRightSwipeText: false }, () =>
              {
                this.props.removeCard();
              });
            });
          }
          else if( gestureState.dx < -DEVICE_WIDTH + 150 )
          {
            Animated.parallel(
              [
                Animated.timing( this.state.xValue,
                  {
                    toValue: -DEVICE_WIDTH,
                    duration: 200
                  }),

                Animated.timing( this.cardOpacity,
                  {
                    toValue: 0,
                    duration: 200
                  })
              ], { useNativeDriver: true }).start(() =>
            {
              this.setState({ showLeftSwipeText: false, showRightSwipeText: false }, () =>
              {
                this.props.removeCard();
              });
            });
          }
        }
      });
  }

  render()
  {
    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={[
          styles.card,
          {
            opacity: 1,
            transform: [{ translateX: this.state.xValue }]
          }
        ]}
      >
        <PhotoPreviewItem
          source={this.props.source}
          index={this.props.index}
        />
      </Animated.View>
    );
  }
}

SwipeableCardView.propTypes = {
  source: PropTypes.shape({}).isRequired,
  index: PropTypes.number.isRequired
};

export default SwipeableCardView;
