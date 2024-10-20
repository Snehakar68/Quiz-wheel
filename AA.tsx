import {View, Text, Dimensions} from 'react-native';
import React from 'react';
import {Canvas, Rect} from '@shopify/react-native-skia';

type Props = {};

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const HORIZONTAL_BOXES = 10;
const VERTICAL_BOXES = 10;
const PADDING = 10;
const BOX_CONTAINER_SIZE = SCREEN_WIDTH / HORIZONTAL_BOXES;
const BOX_SIZE = BOX_CONTAINER_SIZE - PADDING;
const BOX_VERTICLE_AMT = Math.floor(SCREEN_HEIGHT / BOX_CONTAINER_SIZE);

const App = (props: Props) => {
  return (
    <View style={{flex: 1}}>
      <Canvas
        style={{
          flex: 1,
          backgroundColor: 'red',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {new Array(BOX_VERTICLE_AMT).fill(0).map((_, i) => {
          return new Array(HORIZONTAL_BOXES).fill(0).map((_, j) => {
            return (
              <Rect
                key={i.toString() + j.toString()}
                x={j * BOX_CONTAINER_SIZE}
                y={i * BOX_CONTAINER_SIZE}
                width={BOX_SIZE}
                height={BOX_SIZE}
                // color="blue"
              />
            );
          });
        })}
      </Canvas>
    </View>
  );
};

export default App;
