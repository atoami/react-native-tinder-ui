// // @flow
//
// import React, { PureComponent } from 'react';
// import {
//   View,
//   StyleSheet,
//   Animated,
//   PanResponder,
//   TouchableOpacity,
// } from 'react-native';
// import { Navigation } from 'react-native-navigation';
// import axios from 'axios';
// import { MaterialIndicator } from 'react-native-indicators';
// import { get } from 'lodash';
//
// import { SimpleNavBar } from 'src/components';
// import { IBMPlexSansRegular } from 'src/fonts';
// import { Colors } from 'src/theme';
// import { AlertMessage } from 'src/utilities';
// import { WINDOW_WIDTH } from 'src/constants';
// import PhotoPreviewItem from './SwipeableCard';
//
// const ButtonSpacing = (WINDOW_WIDTH - 56 * 2) / 4;
//
// const SwipeDistance = WINDOW_WIDTH / 4;
//
// const styles = StyleSheet.create({
//   flex: {
//     flex: 1,
//   },
//   photoList: {
//     flex: 1,
//   },
//   countLabel: {
//     fontSize: 14,
//     color: Colors.rollingStone,
//     height: 56,
//     lineHeight: 56,
//     textAlign: 'center'
//   },
//   buttons: {
//     position: 'absolute',
//     height: 56,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     paddingHorizontal: ButtonSpacing,
//     justifyContent: 'space-between',
//     bottom: -28
//   },
//   actionButtonIcon: {
//     width: 56,
//     height: 56,
//   },
//   card: {
//     position: 'absolute',
//     left: 0,
//     top: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: 9999
//   },
// });
//
// class SwipeableCardView extends PureComponent {
//
//   constructor(props) {
//     super(props);
//
//     this.state = {
//       isLoading: true,
//       pendingPhotos: [],
//       reviewedPhotos: [],
//       xValue: new Animated.Value(0),
//       likeButtonOpacity: new Animated.Value(1),
//       unlikeButtonOpacity: new Animated.Value(1),
//       likeButtonScale: new Animated.Value(1),
//       unlikeButtonScale: new Animated.Value(1),
//     };
//
//     this.panResponder = undefined;
//     this.cardRefs = [];
//   }
//
//   componentWillMount() {
//     this.panResponder = PanResponder.create({
//       onStartShouldSetPanResponder: () => false,
//       onStartShouldSetPanResponderCapture: () => false,
//       onMoveShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponderCapture: () => true,
//       onPanResponderMove: (evt, gestureState) => {
//         this.state.xValue.setValue(gestureState.dx);
//
//         this.state.likeButtonOpacity.setValue(this.getLikeButtonOpacity(gestureState.dx));
//         this.state.unlikeButtonOpacity.setValue(this.getUnlikeButtonOpacity(gestureState.dx));
//
//         this.state.likeButtonScale.setValue(this.getLikeButtonScale(gestureState.dx));
//         this.state.unlikeButtonScale.setValue(this.getUnlikeButtonScale(gestureState.dx));
//       },
//       onPanResponderRelease: (evt, gestureState) => {
//         if (gestureState.dx > 0) {
//           if (gestureState.dx >= SwipeDistance) {
//             this.popCard(true);
//           } else {
//             this.state.xValue.setValue(0);
//           }
//         } else if (gestureState.dx < 0) {
//           if (Math.abs(gestureState.dx) >= SwipeDistance) {
//             this.popCard(false);
//           } else {
//             this.state.xValue.setValue(0);
//           }
//         }
//
//         this.state.likeButtonOpacity.setValue(1);
//         this.state.unlikeButtonOpacity.setValue(1);
//         this.state.likeButtonScale.setValue(1);
//         this.state.unlikeButtonScale.setValue(1);
//       }
//     });
//   }
//
//   componentDidMount() {
//     // eslint-disable-next-line
//     axios.get('https://api.nasa.gov/planetary/apod?api_key=d6mcDhS3ASwqIlAwiO9bPin3tLeVGDOjvZ3jFYpp&count=20')
//       .then(res => this.setState({ pendingPhotos: res.data }))
//       .catch(() => AlertMessage.fromRequest('Cannot get photos'))
//       .finally(() => this.setState({ isLoading: false }));
//   }
//
//   getUnlikeButtonOpacity = (swipeOffset) => {
//     if (swipeOffset <= 0) {
//       return 1;
//     }
//     const opacity = 1 - Math.abs(swipeOffset) / SwipeDistance / 2;
//     return opacity < 0.2 ? 0.2 : opacity;
//   };
//
//   getLikeButtonOpacity = (swipeOffset) => {
//     if (swipeOffset >= 0) {
//       return 1;
//     }
//     const opacity = 1 - Math.abs(swipeOffset) / SwipeDistance / 2;
//     return opacity < 0.2 ? 0.2 : opacity;
//   };
//
//   getUnlikeButtonScale = (swipeOffset) => {
//     if (swipeOffset >= 0) {
//       return 1;
//     }
//     const scale = 1 + Math.abs(swipeOffset) / SwipeDistance / 2;
//     return scale > 1.3 ? 1.3 : scale;
//   };
//
//   getLikeButtonScale = (swipeOffset) => {
//     if (swipeOffset <= 0) {
//       return 1;
//     }
//     const scale = 1 + Math.abs(swipeOffset) / SwipeDistance / 2;
//     return scale > 1.3 ? 1.3 : scale;
//   };
//
//   popCard = (bLike) => {
//     Animated.timing(this.state.xValue, {
//       toValue: WINDOW_WIDTH * (bLike ? 1 : -1),
//       duration: 300,
//     }).start(() => {
//       this.setState((prevState) => {
//         const popCard = prevState.pendingPhotos.shift();
//         const reviewedPhotos = [
//           ...prevState.reviewedPhotos,
//           { ...popCard, isLiked: bLike }
//         ];
//         return {
//           pendingPhotos: prevState.pendingPhotos,
//           reviewedPhotos,
//         };
//       });
//
//       // Reset swipe card position
//       this.state.xValue.setValue(0);
//     });
//   };
//
//   renderSwipableCard = (source) => {
//     return (
//       <Animated.View
//         {...this.panResponder.panHandlers}
//         style={[
//           styles.card,
//           {
//             opacity: 1,
//             transform: [{ translateX: this.state.xValue }]
//           }
//         ]}
//       >
//         <PhotoPreviewItem
//           source={source}
//           index={0}
//         />
//       </Animated.View>
//     );
//   };
//
//   renderPhotos = () => {
//     console.log('this.state.pendingPhotos = ', this.state.pendingPhotos);
//     if (this.state.isLoading) {
//       return (
//         <MaterialIndicator color={Colors.burntSienna} />
//       );
//     }
//
//     if (this.state.pendingPhotos.length === 0) {
//       return undefined;
//     }
//
//     // const tempItems = [...this.state.pendingPhotos];
//     // const firstItem = tempItems.shift();
//     // const previewItems = tempItems.slice(0, 3);
//
//     return (
//       <View style={styles.photoList}>
//         <View style={styles.flex}>
//           {this.state.pendingPhotos.map((photo, index) => {
//             return (
//               <PhotoPreviewItem
//                 ref={ref => this.cardRefs[index] = ref}
//                 key={get(photo, 'explanation', index)}
//                 source={photo}
//                 index={index}
//               />
//             );
//           })}
//           {/*{this.renderSwipableCard(firstItem)}*/}
//         </View>
//         <View style={styles.buttons}>
//           <TouchableOpacity onPress={() => this.popCard(false)}>
//             <Animated.Image
//               style={[
//                 styles.actionButtonIcon,
//                 {
//                   opacity: this.state.unlikeButtonOpacity,
//                   transform: [{ scale: this.state.unlikeButtonScale }]
//                 }
//               ]}
//               source={require('assets/icons/ic_dislike.png')}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => this.popCard(true)}>
//             <Animated.Image
//               style={[
//                 styles.actionButtonIcon,
//                 {
//                   opacity: this.state.likeButtonOpacity,
//                   transform: [{ scale: this.state.likeButtonScale }]
//                 }
//               ]}
//               source={require('assets/icons/ic_like.png')}
//             />
//           </TouchableOpacity>
//
//         </View>
//       </View>
//     );
//   };
//
//   render() {
//     const { isLoading, pendingPhotos, reviewedPhotos } = this.state;
//
//     const disabledUndoAction = isLoading || reviewedPhotos.length === 0;
//
//     return (
//       <View style={styles.flex}>
//         <SimpleNavBar
//           title={'My Mars'}
//           leftText={'Undo'}
//           leftAction={disabledUndoAction ? undefined : () => {}}
//           rightIcon={require('assets/icons/ic_heart.png')}
//           rightAction={isLoading ? undefined : () => {}}
//         />
//         <View style={[styles.flex, { zIndex: 10, paddingHorizontal: 16 }]}>
//           {this.renderPhotos()}
//         </View>
//         <IBMPlexSansRegular style={styles.countLabel}>
//           {isLoading ? 'Downloading' : `${pendingPhotos.length} cards`}
//         </IBMPlexSansRegular>
//       </View>
//     );
//   }
// }
//
// export default SwipeableCardView;
