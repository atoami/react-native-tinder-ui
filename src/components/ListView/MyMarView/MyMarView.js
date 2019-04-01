// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
} from 'react-native';
import { get } from 'lodash';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';

import { IBMPlexSansMedium, IBMPlexSansRegular } from '../../../fonts';
import { Colors } from '../../../theme';
import { CachedImageBackground } from '../..';

const styles = StyleSheet.create({
  title: {
    color: Colors.white,
    fontSize: 20,
    marginHorizontal: 32,
    marginTop: 32
  },
  explanation: {
    color: Colors.white,
    marginHorizontal: 32,
    fontSize: 14
  },
});

export class MyMarView extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      finishedLoading: false,
    };
  }

  render() {
    const { dataSource } = this.props;

    return (
      <CachedImageBackground
        source={{ uri: get(dataSource, 'url') }}
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
            <IBMPlexSansMedium style={styles.title} numberOfLines={2}>
              {get(dataSource, 'title', 'No title')}
            </IBMPlexSansMedium>
            <IBMPlexSansRegular numberOfLines={2} style={styles.explanation}>
              {get(dataSource, 'explanation')}
            </IBMPlexSansRegular>
            <IBMPlexSansRegular style={styles.explanation}>
              {moment(get(dataSource, 'date'), 'YYYY-MM-DD').format('MMM DD, YYYY')}
            </IBMPlexSansRegular>
          </View>
        }
      </CachedImageBackground>
    );
  }
}

MyMarView.propTypes = {
  dataSource: PropTypes.shape({}).isRequired,
};
