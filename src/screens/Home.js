import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Constantes from '../../utils/constantes';

export default function Home({ navigation }) {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const ip = Constantes.IP;

    const handleLogout = async () => {
        try {
            const response = await fetch(`${ip}/services/public/cliente.php?action=logOut`, {
                method: 'GET'
            });
            const data = await response.json();
            if (data.status) {
                setAlertMessage("Has cerrado sesión exitosamente.");
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                    navigation.navigate('Login');
                }, 2000); // Ajusta el tiempo según sea necesario
            } else {
                setAlertMessage("Error al cerrar sesión.");
                setShowAlert(true);
            }
        } catch (error) {
            setAlertMessage("Error de red.");
            setShowAlert(true);
        }
    };

    useEffect(() => {
        // Configurar opciones de navegación
        navigation.setOptions({
            headerTitle: 'Inicio', // Título del header
            headerTitleAlign: 'center', // Centrar el título en el header
            headerStyle: {
                backgroundColor: '#081F49', // Color de fondo del header
            },
            headerTintColor: '#A8E910', // Color del texto del header
        });
    }, []);

    return (
        <ImageBackground source={require('../img/fondo.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <Text style={styles.welcomeText}>¡Bienvenido a la pantalla de Inicio!</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.button}>
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title="Alerta"
                message={alertMessage}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor="#DD6B55"
                onConfirmPressed={() => {
                    setShowAlert(false);
                }}
                contentContainerStyle={styles.alertContentContainer}
                titleStyle={styles.alertTitle}
                messageStyle={styles.alertMessage}
                confirmButtonStyle={styles.alertConfirmButton}
                confirmButtonTextStyle={styles.alertConfirmButtonText}
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Ajusta el tamaño de la imagen según la pantalla
        justifyContent: 'center',
        backgroundColor: '#0A305E'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    headerTitleContainer: {
        flexDirection: 'row',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff', // Ajusta el color del texto según el fondo de la imagen
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: '#0A305E',
        fontSize: 18,
        fontWeight: 'bold',
    },
    alertContentContainer: {
        borderRadius: 10,
        padding: 20,
    },
    alertTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    alertMessage: {
        fontSize: 18,
        marginBottom: 10,
    },
    alertConfirmButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    alertConfirmButtonText: {
        fontSize: 16,
    },
});