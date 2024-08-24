import React, { useEffect } from 'react';
import { StyleSheet, View, Image, ImageBackground } from 'react-native';

// Función del componente SplashScreen2
export default function SplashScreen2() {
  // useEffect es un hook que se ejecuta después de que el componente ha sido montado
  useEffect(() => {
    // Aquí puedes agregar lógica que quieras que se ejecute al cargar el componente,
    // como navegación a otra pantalla después de un retraso.
  }, []);

  // Renderizado del componente
  return (
    <ImageBackground source={require('../img/fondo.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image
          source={require('../img/logo-no-background.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </ImageBackground>

  );
}

// Estilos para el componente
const styles = StyleSheet.create({
  container: {
    flex: 1, // El contenedor ocupa todo el espacio disponible
    justifyContent: 'center', // Centra verticalmente el contenido
    alignItems: 'center', // Centra horizontalmente el contenido
  },
  image: {
    width: '50%', // La imagen ocupa el 50% del ancho del contenedor
    height: '50%', // La imagen ocupa el 50% de la altura del contenedor
  },
  backgroundImage: {
    flex: 1, // La imagen de fondo ocupa todo el espacio disponible
    width: '100%', // Ancho completo de la pantalla
    height: '100%', // Altura completa de la pantalla
    backgroundColor: '#0A305E', // Color de fondo en caso de que la imagen no cargue de manera correcta
  },
});