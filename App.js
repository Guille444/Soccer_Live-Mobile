import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa tus componentes de pantalla aquí
import Login from './src/screens/Login';
import Registro from './src/screens/Registro';
import SplashScreen from './src/screens/SplashScreen';
import TabNavigator from './src/tabNavigator/tabNavigator';

export default function App() {
  const Stack = createNativeStackNavigator();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function inicia() {
      try {
        // Simula una carga inicial
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 segundos
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    inicia();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}>
        {appIsReady ? (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Registro" component={Registro} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
          </>
        ) : (
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}