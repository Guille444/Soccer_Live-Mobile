import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

// Importa tus componentes de pantalla aquí
import Home from '../screens/Home';
import Carrito from '../screens/Carrito';
import Historial from '../screens/Historial';
import Perfil from '../screens/Perfil';
import Productos from '../screens/Productos'; // Importa el nuevo componente de pantalla

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#A8E910', // Color de los íconos activos
        tabBarInactiveTintColor: '#fff', // Color de los íconos inactivos
        tabBarStyle: { backgroundColor: '#081F49', height: 60, borderTopWidth: 0 }, // Estilo de la barra de pestañas
        tabBarIcon: ({ focused, color, size }) => { // Función que define el ícono de la pestaña
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Productos') {
            iconName = focused ? 'basket' : 'basket-outline';
          } else if (route.name === 'Carrito') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Historial') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} color={color} size={size} />;
        },
        tabBarLabel: () => null, // Esta línea elimina el texto debajo de los iconos
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
      />
      <Tab.Screen
        name="Productos" // Nueva pestaña de Productos
        component={Productos}
      />
      <Tab.Screen
        name="Carrito"
        component={Carrito}
      />
      <Tab.Screen
        name="Historial"
        component={Historial}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;