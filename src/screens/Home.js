//Importaciones
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Constantes from '../../utils/constantes';

//Funcion principal
export default function Home({ navigation }) {
    const [nombre, setNombre] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const ip = Constantes.IP;

    //Obtener el nombre dek usuario
    const getUser = async () => {
        try {
            const response = await fetch(`${ip}/services/public/cliente.php?action=getUser`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Server response:', data);

            if (data.status) {
                if (data.cliente && data.cliente.nombre_cliente) {
                    setNombre(data.cliente.nombre_cliente);
                } else {
                    setAlertTitle('Error');
                    setAlertMessage('La respuesta del servidor no contiene el nombre del cliente.');
                    setShowAlert(true);
                }
            } else {
                setAlertTitle('Error');
                setAlertMessage(data.error || 'Error desconocido del servidor.');
                setShowAlert(true);
            }
        } catch (error) {
            setAlertTitle('Error');
            setAlertMessage(`Ocurrió un error al obtener los datos del usuario: ${error.message}`);
            setShowAlert(true);
        }
    };

        //Configuracion del encabezado 
    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Inicio',
            headerTitleAlign: 'center',
            headerTransparent: true,
            headerStyle: {
                backgroundColor: 'transparent',
            },
            headerTintColor: '#fff',
        });
    }, []);

    //Muestra de la intefaz
    return (
        <ImageBackground source={require('../img/fondo.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <Image source={require('../img/football.png')} style={styles.image} />
                <Text style={styles.welcomeText}>Bienvenido a Soccer Live</Text>
                <Text style={styles.subtitle}>
                    {nombre ? nombre : 'No hay Nombre para mostrar'}
                </Text>
            </View>
            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title={alertTitle}
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
        resizeMode: 'cover',
        justifyContent: 'center',
        backgroundColor: '#0A305E'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    image: {
        width: 150,  // Ajusta el ancho según sea necesario
        height: 150,  // Ajusta la altura según sea necesario
        marginBottom: 20,
        resizeMode: 'contain',  // Esto ayudará a que la imagen no se recorte
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 25,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20,
        color: '#fff',
        fontStyle: 'italic',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 100,
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
        color: '#DD6B55',
    },
    alertMessage: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
    },
    alertConfirmButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    alertConfirmButtonText: {
        fontSize: 16,
        color: '#fff',
    },
});