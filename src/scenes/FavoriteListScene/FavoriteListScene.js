// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

class FavoriteListScene extends PureComponent {

  render() {
    return (
      <View style={styles.container}>
      </View>
    );
  }
}

export default FavoriteListScene;
