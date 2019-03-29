// @flow

import React from 'react';
import { Image } from 'react-native';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';
import { isEqual } from 'lodash';

const RNFastImage = createImageProgress(FastImage);

export class MSImageView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      placeholder: props.placeholder,
      isLoadingFailed: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.source, nextProps.source)) {
      this.setState({ isLoadingFailed: false });
    }
  }

  render() {
    const { source } = this.props;
    const { placeholder, isLoadingFailed } = this.state;

    if (isLoadingFailed) {
      return (
        <Image
          {...this.props}
          source={placeholder}
        />
      );
    }

    if (!source || !source.uri) {
      return (
        <Image
          {...this.props}
          source={placeholder}
        />
      );
    }

    if (source.uri.indexOf('http') < 0 && source.uri.indexOf('https') < 0) {
      return (
        <Image
          {...this.props}
        />
      );
    }

    return (
      <RNFastImage
        {...this.props}
        onLoadEnd={this.props.onLoadEnd}
        onError={() => this.setState({ isLoadingFailed: true })}
      />
    );
  }
}
