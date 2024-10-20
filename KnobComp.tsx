import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import Svg, { G, Text, TSpan, Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';

type KnobCompProps = {
    
        knobSize?: number;
        angle?: any;
        angleOffset?: number;
        oneTurn?: number;
        angleBySegment?: number;
        knobSource?: any;
    
};

const renderKnob = (options:KnobCompProps) => {
  const knobSize = options?.knobSize || 20;

  const angleSharedValue = useSharedValue(options?.angle || 0);
  const angleOffset = options?.angleOffset || 0;
  const oneTurn = options?.oneTurn || 360;
  const angleBySegment = options?.angleBySegment || 30;
  const rotation = useSharedValue(0);

  const knobStyle = useAnimatedStyle(() => {
    const calculatedAngle = (angleSharedValue.value - angleOffset) % oneTurn / angleBySegment % 1;

    const rotation = interpolate(calculatedAngle, [-1, -0.5, -0.0001, 0.0001, 0.5, 1], [0, 0, 35, -35, 0, 0], Extrapolation.CLAMP);

    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  
  });

  return (
    <Animated.View
      style={[styles.knobContainer, { width: knobSize, height: knobSize * 2 }, knobStyle]}
    >
      <Svg
        width={knobSize}
        height={(knobSize * 100) / 57}
        viewBox="0 0 57 100"
        style={{ transform: [{ translateY: 8 }] }}
      >
        <Image
          source={options?.knobSource || require('./knob.png')}
          style={{ width: knobSize, height: (knobSize * 100) / 57 }}
        />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  knobContainer: {
    justifyContent: 'flex-end',
    zIndex: 1,
    opacity: 1, // Replace with options?.wheelOpacity if needed
  },
});

export default renderKnob;
