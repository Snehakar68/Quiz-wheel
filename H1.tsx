
import {useEffect} from "react";
import {Canvas, Circle, Group} from "@shopify/react-native-skia";
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
 


 const HelloWorld = () => {
    const size = 500;
    const r = useSharedValue(0);
    const c = useDerivedValue(() => size - r.value);
    useEffect(() => {
        console.log('running:::',r.value);
      r.value = withRepeat(withTiming(size * 0.33, { duration: 10000 }), -1);
    }, [r, size]);

    useEffect(() => {
      const timeRef = setInterval(() => {
        r.value = r.value+1;
        

      },1000)
    
      return () => {
        
      }
    }, [])
    
    return (
      <Canvas style={{ flex: 1, backgroundColor: "black" }}>
        <Group blendMode="multiply">
          <Circle cx={r} cy={r} r={r} color="cyan" />
          <Circle cx={c} cy={r} r={r} color="magenta" />
          <Circle
            cx={size/2}
            cy={c}
            r={r}
            color="yellow"
          />
        </Group>
      </Canvas>
    );
  };

  export default HelloWorld;