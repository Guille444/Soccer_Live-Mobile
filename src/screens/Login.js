//Importaciones
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Constantes from '../../utils/constantes';
import { useFocusEffect } from '@react-navigation/native';

//Componente principal
export default function Login({ navigation }) {
    const ip = Constantes.IP;

    //Estados 
    const [isContra, setIsContra] = useState(true);  // Estado para mostrar/ocultar la contraseña
    const [usuario, setUsuario] = useState(''); // Estado para el campo del usuario
    const [contrasenia, setContrasenia] = useState(''); // Estado para el campo de la contraseña
    const [showAlert, setShowAlert] = useState(false); // Estado para mostrar/ocultar la alerta
    const [alertMessage, setAlertMessage] = useState(''); // Estado para el mensaje de la alerta
    const [showProgress, setShowProgress] = useState(false); // Estado para mostrar/ocultar el indicador de progreso


    // Efecto para cargar los detalles del carrito al cargar la pantalla o al enfocarse en ella
    useFocusEffect(
        // La función useFocusEffect ejecuta un efecto cada vez que la pantalla se enfoca.
        React.useCallback(() => {
            validarSesion(); // Llama a la función getDetalleCarrito.
        }, [])
    );


    // Función para validar si hay una sesión activa
    const validarSesion = async () => {
        try {
            const response = await fetch(`${ip}/services/public/cliente.php?action=getUser`, {
                method: 'GET'
            });

            const data = await response.json();

            if (data.status === 1) {
                navigation.navigate('TabNavigator'); // Navega a la siguiente pantalla
            } else {
                console.log("No hay sesión activa");
            }
        } catch (error) {
            console.error(error);
            showAlertWithMessage('Ocurrió un error al validar la sesión'); // Muestra un mensaje de error
        }
    };

    // Función para cerrar la sesión activa
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
            showAlertWithMessage('Ocurrió un error al cerrar sesión'); // Muestra un mensaje de error
        }
    };

    // Función para mostrar una alerta con un mensaje específico
    const showAlertWithMessage = (message, showProgressIndicator = false) => {
        setAlertMessage(message);
        setShowProgress(showProgressIndicator);
        setShowAlert(true);
    };

    // Función para manejar el proceso de inicio de sesión
    const handlerLogin = async () => {
        if (!usuario.trim() || !contrasenia.trim()) {
            showAlertWithMessage('Por favor completa todos los campos'); // Verifica que los campos no estén vacíos
            return;
        }

        showAlertWithMessage('Iniciando sesión...', true); // Muestra un mensaje de progreso

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
                showAlertWithMessage('¡Bienvenido!'); // Muestra un mensaje de bienvenida
                setTimeout(() => {
                    navigation.navigate('TabNavigator'); // Navega a la siguiente pantalla
                    setShowAlert(false);
                }, 2000);
            } else {
                console.log(data);
                showAlertWithMessage(data.error); // Muestra un mensaje de error
            }
        } catch (error) {
            console.error(error, "Error desde Catch");
            showAlertWithMessage('Ocurrió un error al iniciar sesión');  // Muestra un mensaje de error
        } finally {
            setShowProgress(false); // Oculta el indicador de progreso
        }
    };

    // Función para navegar a la pantalla de registro
    const irRegistrar = async () => {
        navigation.navigate('Registro');
    };

    // Función para navegar hacia la pantalla de recuperación de contraseña
    const Recuperar = async () => {
        navigation.navigate('EnviarCorreo');
    };


    // Efecto para validar la sesión al montar el componente
    useEffect(() => {
        validarSesion();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            // Restablecer los estados de usuario y contrasenia cuando la pantalla se enfoca
            setUsuario('');
            setContrasenia('');
        }, [])
    );

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
                <TouchableOpacity>
                    <Text style={styles.welcomeText} onPress={cerrarSesion}>Bienvenido</Text>
                </TouchableOpacity>
                <TextInput
                    value={usuario}
                    onChangeText={setUsuario}
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#ddd"
                    keyboardType="email-address"
                />
                <TextInput
                    value={contrasenia}
                    onChangeText={setContrasenia}
                    style={styles.input}
                    placeholder="Contraseña"
                    secureTextEntry={true}
                    placeholderTextColor="#ddd"
                    contra={isContra}
                />
                <TouchableOpacity onPress={Recuperar}>
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
        padding: 8,
        borderColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#0A305E', // Fondo claro para los campos de entrada
        height: 50,
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 16,
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
        width: '100%',
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