// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { get } from 'lodash';
import FastImage from 'react-native-fast-image';

import { WINDOW_WIDTH } from 'src/constants';
import SwipeableCard from './SwipeableCard';

const ButtonSpacing = (WINDOW_WIDTH - 56 * 2) / 4;

const SwipeDistance = WINDOW_WIDTH / 3;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  photoList: {
    flex: 1,
  },
  buttons: {
    position: 'absolute',
    height: 56,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: ButtonSpacing,
    justifyContent: 'space-between',
    bottom: -28
  },
  actionButtonIcon: {
    width: 56,
    height: 56,
  },
});

class SwipeableCardView extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      cards: props.cards,
      reviewedCards: [],
      likeButtonOpacity: new Animated.Value(1),
      unlikeButtonOpacity: new Animated.Value(1),
      likeButtonScale: new Animated.Value(1),
      unlikeButtonScale: new Animated.Value(1),
      renderedCardIndexes: props.cards.map((k, i) => i).slice(0, 4)
    };

    this.cardRefs = [];
  }

  componentDidMount() {
    if (this.props.cards.length <= 4) {
      return;
    }

    // Preload images for next cards
    // This makes rendering next cards faster
    const uris = this.props.cards.map(c => ({ uri: c.url })).slice(4);
    FastImage.preload(uris);
  }

  getUnlikeButtonOpacity = (swipeOffset) => {
    if (swipeOffset <= 0) {
      return 1;
    }
    const opacity = 1 - Math.abs(swipeOffset) / SwipeDistance / 2;
    return opacity < 0.2 ? 0.2 : opacity;
  };

  getLikeButtonOpacity = (swipeOffset) => {
    if (swipeOffset >= 0) {
      return 1;
    }
    const opacity = 1 - Math.abs(swipeOffset) / SwipeDistance / 2;
    return opacity < 0.2 ? 0.2 : opacity;
  };

  getUnlikeButtonScale = (swipeOffset) => {
    if (swipeOffset >= 0) {
      return 1;
    }
    const scale = 1 + Math.abs(swipeOffset) / SwipeDistance / 2;
    return scale > 1.3 ? 1.3 : scale;
  };

  getLikeButtonScale = (swipeOffset) => {
    if (swipeOffset <= 0) {
      return 1;
    }
    const scale = 1 + Math.abs(swipeOffset) / SwipeDistance / 2;
    return scale > 1.3 ? 1.3 : scale;
  };

  /**
   * Receive swipe offset while swiping a card to update the like/dislike button status
   * @param dx
   */
  onSwipe = (dx) => {
    this.state.likeButtonOpacity.setValue(this.getLikeButtonOpacity(dx));
    this.state.unlikeButtonOpacity.setValue(this.getUnlikeButtonOpacity(dx));

    this.state.likeButtonScale.setValue(this.getLikeButtonScale(dx));
    this.state.unlikeButtonScale.setValue(this.getUnlikeButtonScale(dx));
  };

  /**
   * Pop a card from the list
   * @param bLike: boolean - like or unlike
   * @param cardIndex - card component index
   */
  popCard = (bLike, cardIndex) => {
    // Save reviewed card with card index and like/unlike status
    const poppedCard = {
      ...this.state.cards[cardIndex],
      liked: bLike,
      cardIndex
    };

    // Zoom in and move the cards behind the reviewed card
    if (cardIndex < this.cardRefs.length - 1) {
      for (let i = cardIndex + 1; i < cardIndex + 3; i += 1) {
        if (this.cardRefs.length > i && !!this.cardRefs[i]) {
          this.cardRefs[i].moveForward();
        }
      }
    }

    this.setState(prevState => ({
      reviewedCards: [...prevState.reviewedCards, poppedCard],
    }), () => {
      // Pre-render new card behind 3rd card
      if (this.cardRefs.length <= (cardIndex + 4) && this.state.cards.length > (cardIndex + 4)) {
        this.setState(prevState => ({
          renderedCardIndexes: [
            ...prevState.renderedCardIndexes,
            cardIndex + 4
          ]
        }));
      }

      // Notify parent view to update remaining card amount
      this.props.onPop(this.state.reviewedCards);
    });

    // Preload images for next cards
    // This makes rendering next cards faster
    if (this.props.cards.length <= cardIndex + 1) {
      return;
    }

    const uris = this.props.cards.map(c => ({ uri: c.url })).slice(cardIndex + 1);
    FastImage.preload(uris);
  };

  /**
   * Undo action
   */
  undo = () => {
    // Get the last reviewed card from the reviewed card list
    // If non-reviewed card exists, do nothing
    const { reviewedCards } = this.state;
    if (reviewedCards.length === 0) { return; }

    const tempCards = [...reviewedCards];
    const cardWillUndo = tempCards.pop();

    // Return the last reviewed card to original position
    this.cardRefs[cardWillUndo.cardIndex].reset();

    // Zoom out and move the current visible cards
    for (let i = cardWillUndo.cardIndex + 1; i < this.cardRefs.length; i += 1) {
      if (this.cardRefs[i]) {
        this.cardRefs[i].moveBackward();
      }
    }

    // Notify parent view to update remaining card amount
    // this.cardRefs.pop();
    this.setState({ reviewedCards: tempCards }, () => {
      // Notify parent to update remaining card amount number
      this.props.onPop(this.state.reviewedCards);
    });
  };

  render() {
    // Disable like/unlike buttons in the following cases
    // 1. Card source is empty
    // 2. Reviewed all cards
    const sourceLength = this.state.cards.length;
    const reviewedLength = this.state.reviewedCards.length;
    const noCards = sourceLength === 0 || (sourceLength > 0 && reviewedLength === sourceLength);

    return (
      <View style={styles.photoList}>
        <View style={styles.flex}>
          {this.state.renderedCardIndexes.map((index) => {
            return (
              <SwipeableCard
                ref={ref => this.cardRefs[index] = ref}
                key={get(this.state.cards[index], 'explanation', index)}
                source={this.state.cards[index]}
                index={index}
                onPop={this.popCard}
                onSwipe={this.onSwipe}
              />
            );
          })}
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity
            disabled={noCards}
            onPress={() => this.cardRefs[this.state.reviewedCards.length].pop(false)}
          >
            <Animated.Image
              style={[
                styles.actionButtonIcon,
                {
                  opacity: this.state.unlikeButtonOpacity,
                  transform: [{ scale: this.state.unlikeButtonScale }]
                }
              ]}
              source={require('assets/icons/ic_dislike.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={noCards}
            onPress={() => this.cardRefs[this.state.reviewedCards.length].pop(true)}
          >
            <Animated.Image
              style={[
                styles.actionButtonIcon,
                {
                  opacity: this.state.likeButtonOpacity,
                  transform: [{ scale: this.state.likeButtonScale }]
                }
              ]}
              source={require('assets/icons/ic_like.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

SwipeableCardView.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape()),
  onPop: PropTypes.func.isRequired,
};

SwipeableCardView.defaultProps = {
  cards: []
};

export default SwipeableCardView;
