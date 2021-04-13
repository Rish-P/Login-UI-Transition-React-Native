import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  StyleSheet, Text, View, Dimensions,
  TouchableOpacity, TextInput
} from 'react-native';
import Svg, { Image, Circle, ClipPath } from 'react-native-svg'
const { width, height } = Dimensions.get('window');
import Buttons from './components/Buttons'
import Animated, { Easing } from 'react-native-reanimated'
import { TapGestureHandler, State } from 'react-native-gesture-handler'

const { Value,
  block,
  cond,
  eq,
  set,
  Extrapolate,
  Clock, startClock,
  concat, stopClock, debug, timing, clockRunning, interpolate } = Animated;
const buttonOpacity = new Value(1)
function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    timing(clock, state, config),
    cond(state.finished, debug('stop clock', stopClock(clock))),
    state.position
  ]);
}
export default function App() {
  const onStateChange = Animated.event([
    {
      nativeEvent: ({ state }) => block([
        cond(eq(state, State.END), set(buttonOpacity, runTiming(new Clock(), 1, 0)))
      ])
    }
  ])
  const onCloseState = Animated.event([
    {
      nativeEvent: ({ state }) => block([
        cond(eq(state, State.END), set(buttonOpacity, runTiming(new Clock(), 0, 1)))
      ])
    }
  ])
  const rotateCross = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [180, 360],
    extrapolate: Extrapolate.CLAMP
  })
  const buttonY = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [100, 0],
    extrapolate: Extrapolate.CLAMP
  })
  const bgY = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [-height / 3, 0],
    extrapolate: Extrapolate.CLAMP
  })
  const textInputIndex = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [1, -1],
    extrapolate: Extrapolate.CLAMP
  })
  const textInputY = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [0, 100],
    extrapolate: Extrapolate.CLAMP
  })
  const textInputOpacity = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP
  })
  return (
    <View style={styles.container}>
      <Animated.View style={{ ...StyleSheet.absoluteFill, transform: [{ translateY: bgY }] }}>
        <Svg height={height} width={width}>
          <Image
            href={require('./assets/bg.jpg')}
            height={height}
            width={width}
            preserveAspectRatio='xMidYMid slice'
          />
        </Svg>
      </Animated.View>
      <View style={{ height: height / 3 }}>
        <View style={{
          flex: 1, justifyContent: 'center', alignItems: 'center',
          borderTopLeftRadius: 40, borderTopRightRadius: 40
        }}>
          <TapGestureHandler onHandlerStateChange={onStateChange}>
            <Animated.View style={{
              ...styles.signinContainer, opacity: buttonOpacity,
              transform: [{ translateY: buttonY }]
            }}>
              <Text style={styles.signin}>sign in</Text>
            </Animated.View>
          </TapGestureHandler>
          <TapGestureHandler onHandlerStateChange={onStateChange}>
            <Animated.View style={{
              ...styles.registerContainer, opacity: buttonOpacity,
              transform: [{ translateY: buttonY }]
            }}>
              <Text style={styles.register}>register</Text>
            </Animated.View>
          </TapGestureHandler>
          <Animated.View style={{
            height: height / 3, ...StyleSheet.absoluteFill, top: null,
            alignItems: 'center',
            justifyContent: 'center', zIndex: textInputIndex,
            opacity: textInputOpacity, transform: [{ translateY: textInputY }]
          }}>
            <TapGestureHandler onHandlerStateChange={onCloseState}>
              <Animated.View style={{
                ...styles.closeButton,
                shadowOffset: { width: 2, height: 2 }, shadowColor: 'black', shadowOpacity: 0.2
              }}>
                <Animated.Text
                  style={{
                    fontSize: 15,
                    transform: [{ rotate: concat(rotateCross, 'deg') }]
                  }}>
                  X
                </Animated.Text>
              </Animated.View>
            </TapGestureHandler>
            <TextInput
              placeholder="EMAIL"
              style={styles.textInput}
              textContentType="emailAddress"
              placeholderTextColor="black"
            />
            <TextInput
              placeholder="PASSWORD"
              style={styles.textInput}
              textContentType="password"
              placeholderTextColor="black"
              secureTextEntry={true}
            />
            <TouchableOpacity style={{
              ...styles.signinContainer,
              backgroundColor: '#b38f00'
            }}>
              <Text style={{ ...styles.signin, color: 'white' }}>SIGN IN</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end'
  },
  imageStyle: {
    flex: 1,
    resizeMode: 'cover',
    width: null,
    height: null
  },
  signin: {
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: 'bold'
  },
  signinContainer: {
    height: 60,
    width: '70%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  register: {
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  registerContainer: {
    height: 60,
    borderRadius: 30,
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '4%',
    backgroundColor: '#996600'
  },
  closeButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -20,
    left: width / 2 - 20,
    borderWidth: 1,
    borderColor: 'black'
  },
  textInput: {
    height: 60,
    width: '70%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'black',
    paddingLeft: '10%',
    marginBottom: 10,
  }
});
