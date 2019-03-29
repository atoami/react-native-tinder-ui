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

import { IBMPlexSansMedium, IBMPlexSansRegular } from 'src/fonts';
import { Colors } from 'src/theme';
import { WINDOW_WIDTH } from 'src/constants';
import { CachedImageBackground } from 'src/components';

const PHOTO_WIDTH = WINDOW_WIDTH - 32;

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
  }
});

class PhotoPreviewItem extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      finishedLoading: false
    };
  }

  render() {
    const { index, source } = this.props;

    const zIndex = index > 2 ? 2 : index;

    const width = PHOTO_WIDTH - zIndex * 32;
    const left = zIndex * 16;
    const top = 48 - zIndex * 16;
    const bottom = zIndex * 16;

    return (
      <CachedImageBackground
        source={{ uri: get(source, 'url') }}
        style={{
          position: 'absolute',
          width,
          left,
          top,
          bottom,
          zIndex: 99 - index,
          backgroundColor: Colors.white,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 0
          },
          shadowOpacity: 0.6,
          shadowRadius: 6,
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
    );
  }
}

PhotoPreviewItem.propTypes = {
  index: PropTypes.number.isRequired,
  source: PropTypes.shape({}).isRequired,
};

export default PhotoPreviewItem;
