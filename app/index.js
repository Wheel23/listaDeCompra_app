import React, { useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

function HoverButton({ href, children }) {
  const scale = useRef(new Animated.Value(1)).current;
  const bgColor = useRef(new Animated.Value(0)).current; // vai controlar a interpolação da cor

  function onMouseEnter() {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bgColor, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false, // cor não usa native driver
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
    ]).start();
  }

  // Interpolação da cor do background entre duas cores hex
  const backgroundColor = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#379683', '#4CAF50'], // cores do seu botão normal e hover
  });

  return (
    <Link href={href} style={{ textDecorationLine: 'none' }}>
      <Animated.View
        style={[
          styles.button,
          {
            transform: [{ scale }],
            backgroundColor,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 25 }}
        >
          <Text style={styles.buttonText}>{children}</Text>
        </TouchableOpacity>
      </Animated.View>
    </Link>
  );
}

export default function App() {
  return (
    <LinearGradient colors={['#A8E6CF', '#56C596', '#379683']} style={styles.container}>
        <View className="flex-1 justify-center items-center">
            <Text>
            Lista de Compras
            </Text>
      <View style={styles.container}>
        <HoverButton href={'/cadastroLC'}>Cadastrar</HoverButton>
        <HoverButton href={'/consultaLC'}>Consultar</HoverButton>
      </View>
      </View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    borderWidth: 2,
    borderColor: '#2C6B58',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
});
