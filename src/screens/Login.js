import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Constantes from '../../utils/constantes';

export default function Login({ navigation }) {
    const ip = Constantes.IP;

    const [isContra, setIsContra] = useState(true);
    const [usuario, setUsuario] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showProgress, setShowProgress] = useState(false);

    const validarSesion = async () => {
        try {
            const response = await fetch(`${ip}/services/public/cliente.php?action=getUser`, {
                method: 'GET'
            });

            const data = await response.json();

            if (data.status === 1) {
                cerrarSesion();
                console.log("Se eliminó la sesión");
            } else {
                console.log("No hay sesión activa");
            }
        } catch (error) {
            console.error(error);
            showAlertWithMessage('Ocurrió un error al validar la sesión');
        }
    };

    const cerrarSesion = async () => {
        try {
            const response = await fetch(`${ip}/services/public/cliente.php?action=logOut`, {
                method: 'GET'
            });

            const data = await response.json();

            if (data.status) {
                console.log("Sesión Finalizada");
            } else {
                console.log('No se pudo eliminar la sesión');
            }
        } catch (error) {
            console.error(error, "Error desde Catch");
            showAlertWithMessage('Ocurrió un error al cerrar sesión');
        }
    };

    const showAlertWithMessage = (message, showProgressIndicator = false) => {
        setAlertMessage(message);
        setShowProgress(showProgressIndicator);
        setShowAlert(true);
    };

    const handlerLogin = async () => {
        if (!usuario.trim() || !contrasenia.trim()) {
            showAlertWithMessage('Por favor completa todos los campos');
            return;
        }

        showAlertWithMessage('Iniciando sesión...', true);

        try {
            const formData = new FormData();
            formData.append('correo', usuario);
            formData.append('clave', contrasenia);

            const response = await fetch(`${ip}/services/public/cliente.php?action=logIn`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.status) {
                setContrasenia('');
                setUsuario('');
                showAlertWithMessage('¡Bienvenido!');
                setTimeout(() => {
                    navigation.navigate('TabNavigator');
                    setShowAlert(false);
                }, 2000);
            } else {
                console.log(data);
                showAlertWithMessage(data.error);
            }
        } catch (error) {
            console.error(error, "Error desde Catch");
            showAlertWithMessage('Ocurrió un error al iniciar sesión');
        } finally {
            setShowProgress(false);
        }
    };

    const irRegistrar = async () => {
        navigation.navigate('Registro');
    };

    useEffect(() => {
        validarSesion();
    }, []);

    return (
        <ImageBackground source={require('../img/fondo.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../img/logo-no-background.png')}
                        style={styles.logo}
                        resizeMode='contain'
                    />
                </View>
                <Text style={styles.welcomeText}>Bienvenido</Text>
                <TextInput
                    value={usuario}
                    onChangeText={setUsuario}
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#fff"
                />
                <TextInput
                    value={contrasenia}
                    onChangeText={setContrasenia}
                    style={styles.input}
                    placeholder="Contraseña"
                    secureTextEntry={true}
                    placeholderTextColor="#fff"
                    contra={isContra}
                />
                <TouchableOpacity>
                    <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={irRegistrar}>
                    <Text style={styles.registerText}>¿No tienes una cuenta? Regístrate</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlerLogin} style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
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
            </View>
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
        padding: 20,
    },
    welcomeText: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#fff',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 18,
        color: '#fff',
    },
    forgotPasswordText: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 15,
        alignSelf: 'flex-start',
        textDecorationLine: 'underline'
    },
    registerText: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 20,
        alignSelf: 'flex-start',
        textDecorationLine: 'underline'
    },
    loginButton: {
        width: '50%',
        height: 50,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    loginButtonText: {
        color: '#0A305E',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 150,
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