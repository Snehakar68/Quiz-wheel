import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as d3Shape from 'd3-shape';
import Svg, { G, Text, TSpan, Path } from 'react-native-svg';
import { knob } from '../asset/AssetIndex';

const { width, height } = Dimensions.get('screen');

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
    playButton: () => JSX.Element;
    getWinner?: (value: string, index: number) => void;
    onRef?: (ref: any) => void;
  };
}

const WheelOfFortune: React.FC<WheelOfFortuneProps> = ({ options }) => {
  const [enabled, setEnabled] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const angle :any= useRef(new Animated.Value(0)).current;
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
  const winnerIndex = options.winner ?? Math.floor(Math.random() * numberOfSegments);
  
  const makeWheel = () => {
    const data :any= Array.from({ length: numberOfSegments }).fill(1);
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
    return arcs.map((arc:any, index:number) => {
      const instance = d3Shape.arc().padAngle(0.01).outerRadius(width / 2).innerRadius(options.innerRadius || 100);
      return {
        path: instance(arc),
        color: colors[index % colors.length],
        value: rewards[index],
        centroid: instance.centroid(arc),
      };
    });
  };

  const [wheelPaths, setWheelPaths] = useState(makeWheel());

  useEffect(() => {
    console.log(angle._value,'angle value:+++++');
    if (options.onRef) {
      options.onRef(ref);
    }
    angle.addListener((event:any) => {
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
      console.log('try again called');
      // resetWheelState();
      // setWheelPaths(makeWheel());
      _onPress();
    }
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
    Animated.timing(angle, {
      toValue: 0,
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
    console.log('winner angel deg', deg, angle._value);
    if (angle._value < 0) {
      return Math.floor(deg / angleBySegment);
    }
    return (numberOfSegments - Math.floor(deg / angleBySegment)) % numberOfSegments;
  };

  console.log(angle._value,'valllll');
  const _onPress = () => {
    const duration = options.duration || 5000; // Shorter duration for testing
    setStarted(true);
  
    // Generate a random winner index
    const randomWinnerIndex = Math.floor(Math.random() * numberOfSegments);
  
    console.log('angle before', angle._value);
    // Calculate the final angle for three full rotations plus the desired stopping point
    const finalAngle = angle._value + 360 * 6  + randomWinnerIndex * 45;
    console.log(randomWinnerIndex, oneTurn, numberOfSegments, finalAngle,angle._value,'values::::::::::::');
  
    Animated.timing(angle, {
      toValue: finalAngle,
      duration: duration,
      useNativeDriver: true,
    }).start(() => {
      setFinished(true);
      const winnerIndex = getWinnerIndex();
      console.log(winnerIndex,'iiiiii');
      setWinner(wheelPaths[winnerIndex].value);
      if (options.getWinner) {
        options.getWinner(wheelPaths[winnerIndex].value, winnerIndex);
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
      {Array.from({ length: number.length }).map((_, j) => (
        options.textAngle === 'vertical' ?
          <TSpan x={x} dy={fontSize} key={`arc-${i}-slice-${j}`}>
            {number.charAt(j)}
          </TSpan> :
          <TSpan y={y - 40} dx={fontSize * 0.07} key={`arc-${i}-slice-${j}`}>
            {number.charAt(j)}
          </TSpan>
      ))}
    </Text>
  );

  const renderSvgWheel = () => (
    <View style={styles.container}>
      {renderKnob()}
      <Animated.View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{
            rotate: angle.interpolate({
              inputRange: [-oneTurn, 0, oneTurn],
              outputRange: [`-${oneTurn}deg`, `0deg`, `${oneTurn}deg`],
            }),
          }],
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
          height={height}
          viewBox={`0 0 ${width} ${width}`}
          style={{
            transform: [{ rotate: `-${angleOffset}deg` }],
            margin: 10,
          }}>
          <G y={width / 2} x={width / 2}>
            {wheelPaths.map((arc, i) => {
              const [x, y] = arc.centroid;
              const number = rewards[i][options.renderKey];
              return (
                <G key={`arc-${i}`}>
                  <Path d={arc?.path ?? undefined} strokeWidth={2} fill={arc.color} />
                  <G
                    rotation={(i * oneTurn) / numberOfSegments + angleOffset}
                    origin={`${x}, ${y}`}>
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
        Animated.modulo(
          Animated.subtract(angle, angleOffset),
          oneTurn,
        ),
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
          transform: [{
            rotate: YOLO.interpolate({
              inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
              outputRange: ['0deg', '0deg', '35deg', '-35deg', '0deg', '0deg'],
            }),
          }],
        }}>
        <Svg
          width={knobSize}
          height={(knobSize * 100) / 57}
          viewBox={`0 0 57 100`}
          style={{ transform: [{ translateY: 8 }] }}>
          <Image
            source={options.knobSource || knob}
            style={{ width: knobSize, height: (knobSize * 100) / 57 }}
          />
        </Svg>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.absoluteCenter}>
      <Animated.View style={[styles.content, {padding: 1}]}>
      {renderSvgWheel()}
      </Animated.View>
      </View>
      <TouchableOpacity style={styles.btn} onPress={_onPress}>
        {options.playButton()}
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={ref.tryAgain}>
        <Text style={styles.tryAgainButton}>Try Again</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#ff3',
  },
  tryAgainButton: {
    fontSize: 20,
    color: '#000',
    marginTop: 20,
  },
  
  absoluteCenter: {
    position: 'absolute',
    width: width,
    height: height / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    // backgroundColor:'green'
  },
  btn:{
    marginTop:35
  }
});

export default WheelOfFortune;
