import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

function HoverButton({ href, children }) {
  const scale = useRef(new Animated.Value(1)).current;
  const bgColor = useRef(new Animated.Value(0)).current;
  const rotateX = useRef(new Animated.Value(0)).current;
  const rotateY = useRef(new Animated.Value(0)).current;

  function onMouseEnter() {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1.08,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bgColor, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }

  function onMouseLeave() {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bgColor, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.spring(rotateX, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.spring(rotateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function onMouseMove(e) {
    const { locationX, locationY, target } = e.nativeEvent;
    const { width, height } = target;
    const x = (locationX / width - 0.5) * 2; // de -1 a 1
    const y = (locationY / height - 0.5) * 2;

    Animated.spring(rotateY, {
      toValue: x * 10, // gira em torno do eixo Y
      useNativeDriver: true,
      speed: 10,
      bounciness: 8,
    }).start();

    Animated.spring(rotateX, {
      toValue: -y * 10, // gira em torno do eixo X
      useNativeDriver: true,
      speed: 10,
      bounciness: 8,
    }).start();
  }

  const backgroundColor = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#379683', '#4CAF50'],
  });

  const borderColor = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#2C6B58', '#C0FFC8'],
  });

  const rotateXDeg = rotateX.interpolate({
    inputRange: [-15, 15],
    outputRange: ['-15deg', '15deg'],
  });

  const rotateYDeg = rotateY.interpolate({
    inputRange: [-15, 15],
    outputRange: ['-15deg', '15deg'],
  });

  return (
    <Link href={href} style={{ textDecorationLine: 'none' }}>
      <Animated.View
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        style={[
          styles.button,
          {
            transform: [
              { scale },
              { perspective: 1000 },
              { rotateX: rotateXDeg },
              { rotateY: rotateYDeg },
            ],
            backgroundColor,
            borderColor,
          },
        ]}
      >
        <Text style={styles.buttonText}>{children}</Text>
      </Animated.View>
    </Link>
  );
}

export default function App() {
  return (
    <LinearGradient colors={['#A8E6CF', '#56C596', '#379683']} style={styles.mainContainer}>
      <View style={styles.centerContent}>
        <Text style={styles.listaDeCompras}>Lista de Compras</Text>

        <View style={styles.buttonRow}>
          <HoverButton href={'/cadastroLC'}>Cadastrar</HoverButton>
          <HoverButton href={'/consultaLC'}>Consultar</HoverButton>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60, // sobe o conteúdo
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 100,
    marginTop: 60,
  },
  button: {
    borderWidth: 3,
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 3, height: 2 },
    textShadowRadius: 3,
  },
  listaDeCompras: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 10, height: 4 },
    textShadowRadius: 6,
  },
});
