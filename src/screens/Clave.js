import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Constantes from '../../utils/constantes';

export default function Clave({ navigation }) {

    const ip = Constantes.IP; // Obtiene la IP del servidor desde las constantes

    // Estados para las contraseñas y la alerta
    const [currentPassword, setCurrentPassword] = useState(''); // Estado para la contraseña actual
    const [newPassword, setNewPassword] = useState(''); // Estado para la nueva contraseña
    const [confirmPassword, setConfirmPassword] = useState(''); // Estado para la confirmación de la nueva contraseña
    const [showAlert, setShowAlert] = useState(false); // Estado para mostrar/ocultar la alerta
    const [alertMessage, setAlertMessage] = useState(''); // Estado para el mensaje de la alerta
    const [showProgress, setShowProgress] = useState(false); // Estado para mostrar/ocultar el indicador de progreso

    // Función para mostrar una alerta con un mensaje específico
    const showAlertWithMessage = (message, showProgressIndicator = false) => {
        setAlertMessage(message);
        setShowProgress(showProgressIndicator);
        setShowAlert(true);
    };

    // Función para manejar el cambio de contraseña
    const changePassword = async () => {
        // Verifica que los campos no estén vacíos
        if (!currentPassword || !newPassword || !confirmPassword) {
            showAlertWithMessage('Por favor completa todos los campos');
            return;
        }

        // Verifica que la nueva contraseña y la confirmación coincidan
        if (newPassword !== confirmPassword) {
            showAlertWithMessage('La nueva contraseña y la confirmación no coinciden');
            return;
        }

        showAlertWithMessage('Cambiando contraseña...', true); // Muestra un mensaje de progreso

        try {
            const formData = new FormData();
            formData.append('claveActual', currentPassword); // Añade la contraseña actual al formData
            formData.append('claveNueva', newPassword); // Añade la nueva contraseña al formData
            formData.append('confirmarClave', confirmPassword); // Añade la confirmación de la nueva contraseña al formData

            // Realiza la petición al servidor
            const response = await fetch(`${ip}/services/public/cliente.php?action=changePassword`, {
                method: 'POST',
                body: formData
            });

            const text = await response.text(); // Obtiene la respuesta como texto
            console.log('Response text:', text); // Muestra el texto de la respuesta en la consola

            const data = JSON.parse(text); // Parsea el texto de la respuesta a JSON

            if (data.status) {
                showAlertWithMessage('Contraseña cambiada correctamente'); // Muestra un mensaje de éxito
                setTimeout(() => {
                    navigation.navigate('Perfil'); // Navega a la pantalla de perfil
                    setShowAlert(false);
                }, 2000);
            } else {
                showAlertWithMessage(data.error); // Muestra un mensaje de error
            }
        } catch (error) {
            console.error('Error desde Catch:', error.message);
            showAlertWithMessage('Ocurrió un error al cambiar la contraseña'); // Muestra un mensaje de error
        } finally {
            setShowProgress(false); // Oculta el indicador de progreso
        }
    };

    // Función para navegar hacia la pantalla de Perfil
    const irPerfil = async () => {
        navigation.navigate('Perfil');
    };

    return (
        <ImageBackground source={require('../img/fondo.png')} style={styles.backgroundImage}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../img/atras.png')} style={styles.backIcon} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Cambiar contraseña</Text>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña actual"
                    secureTextEntry
                    placeholderTextColor="#ddd"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nueva contraseña"
                    secureTextEntry
                    value={newPassword}
                    placeholderTextColor="#ddd"
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
                    showProgress={showProgress}
                    title="Alerta"
                    message={alertMessage}
                    closeOnTouchOutside={!showProgress}
                    closeOnHardwareBackPress={!showProgress}
                    showCancelButton={false}
                    showConfirmButton={!showProgress}
                    confirmText="OK"
                    confirmButtonColor="gray"
                    onConfirmPressed={() => {
                        setShowAlert(false);
                    }}
                    contentContainerStyle={styles.alertContentContainer}
                    titleStyle={styles.alertTitle}
                    messageStyle={styles.alertMessage}
                    confirmButtonStyle={styles.alertConfirmButton}
                    confirmButtonTextStyle={styles.alertConfirmButtonText}
                />
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#0A305E',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 24,
    },
    backIcon: {
        width: 24,
        height: 24,
        marginRight: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff'
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
        backgroundColor: 'gray',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    alertConfirmButtonText: {
        fontSize: 16,
        color: 'white',
    },
});