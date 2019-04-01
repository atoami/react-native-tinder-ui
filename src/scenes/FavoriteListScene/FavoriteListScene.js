// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Carousel from 'react-native-snap-carousel';

import { SimpleNavBar, MyMarView } from 'src/components';
import { WINDOW_WIDTH } from 'src/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class FavoriteListScene extends PureComponent {

  renderItem = ({ item }) => {
    return (
      <MyMarView dataSource={item} />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <SimpleNavBar
          title={'Favorites'}
          leftText={'Back'}
          leftAction={() => Navigation.pop(this.props.componentId)}
        />
        <Carousel
          data={this.props.favoriteCards}
          containerCustomStyle={{ paddingBottom: 48, paddingTop: 36 }}
          renderItem={this.renderItem}
          sliderWidth={WINDOW_WIDTH}
          itemWidth={WINDOW_WIDTH * 0.8}
        />
      </View>
    );
  }
}

FavoriteListScene.propTypes = {
  favoriteCards: PropTypes.arrayOf(PropTypes.shape({}))
};

FavoriteListScene.defaultProps = {
  favoriteCards: []
};

export default FavoriteListScene;
