import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Button,
  Text,
  Modal,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback,
  Touchable,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import WheelOfFortune from './src/components/WheelComp';
import QuestionModal from './src/components/QuestionModal';

type QsType = {
  id: number;
  question: string;
  options: string[];
  answer: string;
};
const questions: QsType[] = [
  {id: 1, question: '2+5', options: ['7', '8', '10', '5'], answer: '7'},
  {id: 2, question: '5+5', options: ['7', '8', '10', '5'], answer: '10'},
  {id: 3, question: '5+8', options: ['7', '8', '13', '5'], answer: '13'},
  {id: 4, question: '8+6', options: ['7', '8', '10', '14'], answer: '14'},
  {
    id: 5,
    question: '36*5',
    options: ['147', '218', '180', '500'],
    answer: '180',
  },
  {id: 6, question: '20-1', options: ['7', '8', '19', '18'], answer: '19'},
  {id: 7, question: '15/5', options: ['7', '3', '15', '7'], answer: '3'},
  {id: 8, question: '2+5*2/5', options: ['4', '6', '10', '5'], answer: '4'},
];
const wid = Dimensions.get('window').width;
const rad = wid / 2;
const App: React.FC = () => {
  const wheelRef = useRef<any>(null);
  const [showQs, setShowQs] = useState(false);
  const [revealedQs, setRevealedQs] = useState<QsType | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answered, setAnswered] = useState({r: -1, c: -1});

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={'#ff3'} />

      <View style={{flex:1,backgroundColor:'red',justifyContent:'center'}}>
        <Text
          style={styles.header}>
          Quiz
        </Text>
        <View style={{alignSelf:'center'}}>

        <WheelOfFortune
          options={{
            playButton: () => (
              <Text
                onPress={() => wheelRef.current?.tryAgain()}
                style={styles.btn}>
                Play
              </Text>
            ),
            getWinner: (value: any, index: number) => {
              // console.log(value, index);
              setRevealedQs(value);
              setShowQs(true);
            },
            rewards: questions,
            renderKey: 'question',
            innerRadius: 50,
            onRef: ref => (wheelRef.current = ref),
          }}
        />
        </View>
        <QuestionModal
          answered={answered}
          fwRef={wheelRef?.current}
          isAnswered={isAnswered}
          revealedQs={revealedQs}
          setIsAnswered={setIsAnswered}
          setShowQs={setShowQs}
          setRevealedQs={setRevealedQs}
          setAnswered={setAnswered}
          showQs={showQs}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  header: {
    color: 'black',
    top: 20,
    fontWeight: 'bold',
    fontSize: 24,
    position: 'absolute',
    zIndex: 5,
  },
  btn: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 24,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffff45',
  },
});

export default App;
