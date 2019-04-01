// @flow

import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import axios from 'axios';
import { MaterialIndicator } from 'react-native-indicators';

import { SimpleNavBar } from 'src/components';
import {IBMPlexSansMedium, IBMPlexSansRegular} from 'src/fonts';
import { Colors } from 'src/theme';
import { AlertMessage } from 'src/utilities';
import SwipeableCardView from './SwipeableCardView';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  countLabel: {
    fontSize: 14,
    color: Colors.rollingStone,
    height: 56,
    lineHeight: 56,
    textAlign: 'center'
  },
  noCardView: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noCardLabel: {
    fontSize: 16,
    color: Colors.rollingStone
  }
});

class PhotoListScene extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      cardSource: [],
      reviewedCards: [],
    };

    this.cardView = undefined;
  }

  componentDidMount() {
    // eslint-disable-next-line
    axios.get('https://api.nasa.gov/planetary/apod?api_key=d6mcDhS3ASwqIlAwiO9bPin3tLeVGDOjvZ3jFYpp&count=10')
      .then(res => this.setState({ cardSource: res.data }))
      .catch(() => AlertMessage.fromRequest('Cannot get photos'))
      .finally(() => this.setState({ isLoading: false }));
  }

  onPop = (reviewedCards) => {
    this.setState({ reviewedCards });
  };

  renderCardView = () => {
    // Calling api...
    if (this.state.isLoading) {
      return (
        <MaterialIndicator color={Colors.burntSienna} />
      );
    }

    // Return 'No available cards' label in the following cases
    // 1. Card source is empty
    // 2. Reviewed all cards
    const sourceLength = this.state.cardSource.length;
    const reviewedLength = this.state.reviewedCards.length;
    const noCards = sourceLength === 0 || (sourceLength > 0 && reviewedLength === sourceLength);

    return (
      <View style={styles.flex}>
        <SwipeableCardView
          ref={ref => this.cardView = ref}
          cards={this.state.cardSource}
          onPop={this.onPop}
        />
        {noCards &&
          <View style={styles.noCardView}>
            <IBMPlexSansMedium style={styles.noCardLabel}>
              {'No available cards'}
            </IBMPlexSansMedium>
          </View>
        }
      </View>
    );
  };

  render() {
    const { isLoading, cardSource, reviewedCards } = this.state;

    const disabledUndoAction = isLoading || reviewedCards.length === 0;

    return (
      <View style={styles.flex}>
        <SimpleNavBar
          title={'My Mars'}
          leftText={'Undo'}
          leftAction={disabledUndoAction ? undefined : () => this.cardView.undo()}
          rightIcon={require('assets/icons/ic_heart.png')}
          rightAction={isLoading ? undefined : () => {}}
        />
        <View style={[styles.flex, { zIndex: 10, paddingHorizontal: 16 }]}>
          {this.renderCardView()}
        </View>
        <IBMPlexSansRegular style={styles.countLabel}>
          {isLoading ? 'Downloading' : `${cardSource.length - reviewedCards.length} cards`}
        </IBMPlexSansRegular>
      </View>
    );
  }
}

export default PhotoListScene;
