import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Constantes from '../../utils/constantes';

export default function NuevaClave({ navigation }) {
    const ip = Constantes.IP; // Obtiene la IP del servidor desde las constantes
    // Función para cargar la lista de vehículos
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    // Funcion para cambiar la contraseña
    const changePassword = async () => {
        if (newPassword === '' || confirmPassword === '') {
            setAlertMessage('Por favor, complete ambos campos.');
            setShowAlert(true);
            return;
        }

        if (newPassword !== confirmPassword) {
            setAlertMessage('Las contraseñas no coinciden.');
            setShowAlert(true);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('claveNueva', newPassword);
            formData.append('confirmarClave', confirmPassword);

            const response = await fetch(`${ip}/services/public/cliente.php?action=changePassword`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.status) {
                setAlertMessage('Contraseña actualizada correctamente.');
                setShowAlert(true);
                // Redirige después de 2 segundos
                setTimeout(() => {
                    setShowAlert(false);
                    navigation.navigate('Login');
                }, 2000);
            } else {
                setAlertMessage(data.error);
                setShowAlert(true);
            }
        } catch (error) {
            console.error('Error:', error);
            setAlertMessage('Ocurrió un problema al actualizar la contraseña.');
            setShowAlert(true);
        }
    };

    return (
        <ImageBackground source={require('../img/fondo.png')} style={styles.backgroundImage}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Actualizar contraseña</Text>
                </View>
                <Text style={styles.instructions}>Ingresa tu nueva contraseña y confírmala</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nueva contraseña"
                    secureTextEntry
                    placeholderTextColor="#ddd"
                    value={newPassword}
                    onChangeText={setNewPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirmar contraseña"
                    secureTextEntry
                    placeholderTextColor="#ddd"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={changePassword} style={styles.button}>
                    <Text style={styles.buttonText}>GUARDAR</Text>
                </TouchableOpacity>

                <AwesomeAlert
                    show={showAlert}
                    showProgress={false}
                    title="Alerta"
                    message={alertMessage}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showCancelButton={false}
                    showConfirmButton={true}
                    confirmText="OK"
                    confirmButtonColor="gray"
                    onConfirmPressed={() => setShowAlert(false)}
                    contentContainerStyle={styles.alertContentContainer}
                    titleStyle={styles.alertTitle}
                    messageStyle={styles.alertMessage}
                    confirmButtonTextStyle={styles.alertConfirmButtonText}
                    confirmButtonStyle={styles.alertConfirmButton}
                />
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        paddingTop: 50,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#0A305E',
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',

    },
    instructions: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#fff',
    },
    input: {
        width: '100%',
        padding: 8,
        borderColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#0A305E', // Fondo claro para los campos de entrada
        height: 50,
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 15,
        fontSize: 16,
        color: '#fff',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        borderRadius: 8,
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