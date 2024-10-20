// import React, {useState, useRef, useEffect} from 'react';
// import {View, StyleSheet, Dimensions} from 'react-native';
// import {Canvas, Path, Skia} from '@shopify/react-native-skia';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
// } from 'react-native-reanimated';
// import {PanGestureHandler, State} from 'react-native-gesture-handler';

// const sc = Dimensions.get('screen');
// const wid = sc.width;
// const rad = wid / 2;
// const colors = [
//   'red',
//   'blue',
//   'green',
//   'yellow',
//   'orange',
//   'purple',
//   'brown',
//   'pink',
// ];
// type props = {
//   Questions: string[];
// };
// const FortuneWheel = ({Questions}: props) => {
//   const wheelRadius = 150;
//   const segments = Questions.length;
//   const segmentAngle = (Math.PI * 2) / segments;
//   const rotation = useSharedValue(0);
//   const isSpinning = useSharedValue(false);
//   const panGestureRef = useRef<PanGestureHandler>(null);

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{rotateZ: `${rotation.value}rad`}],
//     };
//   });

//   const handlePanGesture = ({nativeEvent}: any) => {
//     if (nativeEvent.state === State.ACTIVE) {
//       isSpinning.value = true;
//       rotation.value += (nativeEvent.translationX / wheelRadius) * 0.01;
//     } else if (nativeEvent.state === State.END) {
//       isSpinning.value = false;
//       rotation.value = withTiming(
//         Math.round(rotation.value / (Math.PI * 2)) * (Math.PI * 2),
//         {duration: 500},
//       );
//     }
//   };

//   const createPiePath = (radius: number, centerX: number, centerY: number) => {
//     for (let i = 0; i < segments; i++) {
//       const startAngle = i * segmentAngle;
//       const endAngle = (i + 1) * segmentAngle;
//       const start = {
//         x: centerX + radius * Math.cos((startAngle - 90) * (Math.PI / 180)),
//         y: centerY + radius * Math.sin((startAngle - 90) * (Math.PI / 180)),
//       };
//       const end = {
//         x: centerX + radius * Math.cos((endAngle - 90) * (Math.PI / 180)),
//         y: centerY + radius * Math.sin((endAngle - 90) * (Math.PI / 180)),
//       };
//       const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
//       return `M ${centerX} ${centerY} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
//     }
//   };
//   return (
//     <View style={styles.container}>
//       <PanGestureHandler ref={panGestureRef} onGestureEvent={handlePanGesture}>
//         <Animated.View style={[styles.wheel, animatedStyle]}>
//           <Canvas style={{width: '100%', height: '100%',backgroundColor:'rgba(0,0,0,0.5)'}}>
//             {Questions.map((angle, index) => {
//               const path = createPiePath(rad, rad, rad);
//               return (
//                 <Path
//                   key={index}
//                   path={Skia.Path.MakeFromSVGString(path ?? '')}
//                   color={colors[index]}
//                 />
//               );
//             })}
//           </Canvas>
//         </Animated.View>
//       </PanGestureHandler>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   wheel: {
//     width: wid,
//     height: wid,
//     borderRadius: wid / 2,
//     overflow: 'hidden',
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   canvas: {
//     flex: 1,
//   },
// });

// export default FortuneWheel;












import React, {useState, useEffect, useRef, ReactNode} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as d3Shape from 'd3-shape';
import Svg, {G, Text, TSpan, Path} from 'react-native-svg';

const {width, height} = Dimensions.get('screen');

interface WheelOfFortuneProps {
  options: {
    rewards: any[];
    winner?: number;
    duration?: number;
    colors?: string[];
    innerRadius?: number;
    borderWidth?: number;
    borderColor?: string;
    textColor?: string;
    textAngle?: 'horizontal' | 'vertical';
    backgroundColor?: string;
    knobSize?: number;
    knobSource?: any;
    renderKey:string;
    playButton: ReactNode;
    getWinner?: (value: string, index: number) => void;
    onRef?: (ref: any) => void;
  };
}

const WheelOfFortune: React.FC<WheelOfFortuneProps> = ({options}) => {
  const [enabled, setEnabled] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const angle = useRef(new Animated.Value(0)).current;
  const gameScreen = useRef(new Animated.Value(width - 40)).current;
  const wheelOpacity = useRef(new Animated.Value(1)).current;
  const imageLeft = useRef(new Animated.Value(width / 2 - 30)).current;
  const imageTop = useRef(new Animated.Value(height / 2 - 70)).current;

  const rewards = options.rewards;
  const numberOfSegments = rewards.length;
  const fontSize = 20;
  const oneTurn = 360;
  const angleBySegment = oneTurn / numberOfSegments;
  const angleOffset = angleBySegment / 2;
  const winnerIndex =
    options.winner ?? Math.floor(Math.random() * numberOfSegments);
  const makeWheel = () => {
    const data: any = Array.from({length: numberOfSegments}).fill(1);
    const arcs = d3Shape.pie()(data);
    const colors = options.colors || [
      '#E07026',
      '#E8C22E',
      '#ABC937',
      '#4F991D',
      '#22AFD3',
      '#5858D0',
      '#7B48C8',
      '#D843B9',
      '#E23B80',
      '#D82B2B',
    ];
    return arcs.map((arc, index) => {
      const instance = d3Shape
        .arc()
        .padAngle(0.01)
        .outerRadius(width / 2)
        .innerRadius(options.innerRadius || 100);
      return {
        path: instance(arc),
        color: colors[index % colors.length],
        value: rewards[index][options.renderKey],
        centroid: instance.centroid(arc),
      };
    });
  };
  const [wheelPaths, setWheelPaths] = useState(makeWheel());

  useEffect(() => {
    if (options.onRef) {
      options.onRef(ref);
    }
    angle.addListener(event => {
      if (enabled) {
        setEnabled(false);
        setFinished(false);
      }
    });
    return () => {
      if (options.onRef) {
        options.onRef(undefined);
      }
    };
  }, []);

  const ref = {
    tryAgain: () => {
      // prepareWheel();
      resetWheelState();
      setWheelPaths(makeWheel());
      setTimeout(() => {
        _onPress();
        
      }, 1000);
    },
  };

  const resetWheelState = () => {
    setEnabled(false);
    setStarted(false);
    setFinished(false);
    setWinner(null);
    Animated.timing(gameScreen, {
      toValue: width - 40,
      duration: 0,
      useNativeDriver: true,
    }).start();
    Animated.timing(wheelOpacity, {
      toValue: 1,
      duration: 0,
      useNativeDriver: true,
    }).start();
    Animated.timing(imageLeft, {
      toValue: width / 2 - 30,
      duration: 0,
      useNativeDriver: true,
    }).start();
    Animated.timing(imageTop, {
      toValue: height / 2 - 70,
      duration: 0,
      useNativeDriver: true,
    }).start();
  };

  const getWinnerIndex = () => {
    const deg = Math.abs(Math.round(angle._value % oneTurn));
    if (angle._value < 0) {
      return Math.floor(deg / angleBySegment);
    }
    return (
      (numberOfSegments - Math.floor(deg / angleBySegment)) % numberOfSegments
    );
  };

  const _onPress = () => {
    const duration = options.duration || 10000;
    setStarted(true);
    Animated.timing(angle, {
      toValue:
        365 -
        winnerIndex * (oneTurn / numberOfSegments) +
        360 * (duration / 1000),
      duration: duration,
      useNativeDriver: true,
    }).start(() => {
      const winnerIndex = getWinnerIndex();
      setFinished(true);
      setWinner(wheelPaths[winnerIndex].value);
      if (options.getWinner) {
        console.log(winnerIndex, wheelPaths[winnerIndex].value);
        options.getWinner(options.rewards[winnerIndex], winnerIndex);
      }
    });
  };

  const textRender = (x: number, y: number, number: string, i: number) => (
    <Text
      x={x - number.length * 5}
      y={y - 80}
      fill={options.textColor || '#fff'}
      textAnchor="middle"
      fontSize={fontSize}>
      {Array.from({length: number.length}).map((_, j) =>
        options.textAngle === 'vertical' ? (
          <TSpan x={x} dy={fontSize} key={arc-${i}-slice-${j}}>
            {number.charAt(j)}
          </TSpan>
        ) : (
          <TSpan y={y - 40} dx={fontSize * 0.07} key={arc-${i}-slice-${j}}>
            {number.charAt(j)}
          </TSpan>
        ),
      )}
    </Text>
  );

  const renderSvgWheel = () => (
    <View style={styles.container}>
      {renderKnob()}
      <Animated.View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: [
            {
              rotate: angle.interpolate({
                inputRange: [-oneTurn, 0, oneTurn],
                outputRange: [-${oneTurn}deg, 0deg, ${oneTurn}deg],
              }),
            },
          ],
          backgroundColor: options.backgroundColor || '#fff',
          width: width - 20,
          height: width - 20,
          borderRadius: (width - 20) / 2,
          borderWidth: options.borderWidth || 2,
          borderColor: options.borderColor || '#fff',
          opacity: wheelOpacity,
        }}>
        <Svg
          width={width}
          height={width}
          viewBox={0 0 ${width} ${width}}
          style={{
            transform: [{rotate: -${angleOffset}deg}],
            margin: 10,
          }}>
          <G y={width / 2} x={width / 2}>
            {wheelPaths.map((arc, i) => {
              const [x, y] = arc.centroid;
              const number = arc.value.toString();
              return (
                <G key={arc-${i}}>
                  <Path d={arc.path} strokeWidth={2} fill={arc.color} />
                  <G
                    rotation={(i * oneTurn) / numberOfSegments + angleOffset}
                    origin={${x}, ${y-10}}>
                    {textRender(x, y, number, i)}
                  </G>
                </G>
              );
            })}
          </G>
        </Svg>
      </Animated.View>
    </View>
  );

  const renderKnob = () => {
    const knobSize = options.knobSize || 20;
    const YOLO = Animated.modulo(
      Animated.divide(
        Animated.modulo(Animated.subtract(angle, angleOffset), oneTurn),
        new Animated.Value(angleBySegment),
      ),
      1,
    );

    return (
      <Animated.View
        style={{
          width: knobSize,
          height: knobSize * 2,
          justifyContent: 'flex-end',
          zIndex: 1,
          opacity: wheelOpacity,
          transform: [
            {
              rotate: YOLO.interpolate({
                inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
                outputRange: [
                  '0deg',
                  '0deg',
                  '35deg',
                  '-35deg',
                  '0deg',
                  '0deg',
                ],
              }),
            },
          ],
        }}>
        <Svg
          width={knobSize}
          height={(knobSize * 100) / 57}
          viewBox={0 0 57 100}
          style={{transform: [{translateY: 8}]}}>
          <Image
            source={options.knobSource || require('./knob.png')}
            style={{width: knobSize, height: (knobSize * 100) / 57}}
          />
        </Svg>
      </Animated.View>
    );
  };

  const renderTopToPlay = () => {
    if (!started) {
      return (
        <TouchableOpacity style={{alignSelf:'center',marginTop:35}} onPress={_onPress}>
          {options.playButton}
          
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.absoluteCenter}>
        <Animated.View style={[styles.content, {padding: 1}]}>
          {renderSvgWheel()}
        </Animated.View>
      </View>
      { renderTopToPlay()}
    </View>
  );
};

export default WheelOfFortune;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  absoluteCenter: {
    position: 'absolute',
    width: width,
    height: height / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor:'green'
  },
});