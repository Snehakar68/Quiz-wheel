import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React, {memo} from 'react';

const wid = Dimensions.get('screen').width;
type Props = {
  setShowQs: (value: boolean) => void;
  showQs: boolean;
  isAnswered: boolean;
  setIsAnswered: (value: boolean) => void;
  setRevealedQs: (value: any) => void;
  setAnswered: (value: any) => void;
  revealedQs: any;
  answered: any;
  fwRef: any;
};

const QuestionModal = ({
  setShowQs,
  fwRef,
  showQs,
  isAnswered,
  setIsAnswered,
  setRevealedQs,
  setAnswered,
  revealedQs,
  answered,
}: Props) => {
  function handleAnswer(option: string, index: number) {
    setIsAnswered(true);
    if (revealedQs && option === revealedQs.answer) {
      setAnswered({c: index, r: -1});
    } else {
      // console.log(
      //   'object',
      //   revealedQs?.options.findIndex(op => op === revealedQs.answer),
      // );
      setAnswered({
        c:
          revealedQs?.options.findIndex((v: any) => v === revealedQs.answer) ??
          -1,
        r: index,
      });
    }
  }

  return (
    <View style={{flex: 1}}>
      <Modal
        statusBarTranslucent
        visible={showQs}
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        transparent>
        <TouchableOpacity
          activeOpacity={0}
          onPress={() => {
            if (isAnswered) {
              // console.log('object');
              setRevealedQs(null);
              setAnswered({c: -1, r: -1});
              setIsAnswered(false);
              setShowQs(false);
            }
          }}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}>
          {/* <View */}
          <TouchableOpacity
            activeOpacity={0}
            onPress={() => {}}
            style={{
              width: wid - 20,
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              // borderWidth:0.5,
              elevation: 1,
              alignSelf: 'center',
            }}>
            <Text
              style={styles.head}>
              Solve the algebraic equation and select the correct answer
            </Text>
            <Text
              style={styles.qstxt}>
              Q{`${revealedQs?.id}.) ${revealedQs?.question}`} =
            </Text>
            {revealedQs?.options?.map((option: string, index: number) => (
              <TouchableOpacity
                disabled={isAnswered}
                onPress={() => {
                  handleAnswer(option, index);
                }}
                style={{
                  ...styles.container,
                  borderWidth: isAnswered ? 1 : 0,
                  borderColor:
                    answered.c === index
                      ? 'green'
                      : answered.r == index
                      ? 'red'
                      : 'rgba(0,0,0,0.1)',
                }}
                key={index}>
                <Text style={styles.optiontxt}>
                  {String.fromCharCode(97 + index).toLowerCase() +
                    ') ' +
                    `${option}`}
                </Text>
                {answered.c === index && (
                  <Text style={styles.crtxt}>Correct</Text>
                )}
                {answered.r === index && (
                  <Text style={{color: 'red', marginEnd: 10}}>Incorrect</Text>
                )}
              </TouchableOpacity>
            ))}

            {isAnswered && (
              <TouchableOpacity
                onPress={() => {
                  setShowQs(false);
                  setIsAnswered(false);
                  setAnswered({r: -1, c: -1});
                  setRevealedQs(null);
                  fwRef?.tryAgain();
                }}
                style={styles.tryagaintxt}>
                <Text style={styles.tryag}>Try Again</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default memo(QuestionModal);
const styles = StyleSheet.create({
  head: {
    marginStart: 20,
    color: 'black',
    fontSize: 16,
  },
  qstxt: {
    marginStart: 20,
    marginTop: 10,
    color: 'black',
    fontSize: 20,
  },
  container: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optiontxt: {
    marginStart: 20,
    color: 'black',
    fontSize: 20,
  },
  crtxt: {
    color: 'green',
    marginEnd: 10,
  },
  tryag: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  tryagaintxt: {
    backgroundColor: 'rgba(255,215,0,5)',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
    paddingVertical: 10,
  },
});
