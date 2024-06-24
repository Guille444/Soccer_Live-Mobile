import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native';
import * as Constantes from '../../utils/constantes';

export default function Login({ navigation }) {
    const ip = Constantes.IP;

    const [isContra, setIsContra] = useState(true)
    const [usuario, setUsuario] = useState('')
    const [contrasenia, setContrasenia] = useState('')

    const validarSesion = async () => {
        try {
            // Validar los campos
            if (!usuario.trim() || !contrasenia.trim()) {
                Alert.alert("Debes llenar todos los campos");
                return;
            }
            const response = await fetch(`${ip}/services/public/cliente.php?action=getUser`, {
                method: 'GET'
            });

            const data = await response.json();

            if (data.status === 1) {
                cerrarSesion();
                console.log("Se eliminó la sesión")
            } else {
                console.log("No hay sesión activa")
                return
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Ocurrió un error al validar la sesión');
        }
    }

    const cerrarSesion = async () => {
        try {
            const response = await fetch(`${ip}/services/public/cliente.php?action=logOut`, {
                method: 'GET'
            });

            const data = await response.json();

            if (data.status) {
                console.log("Sesión Finalizada")
            } else {
                console.log('No se pudo eliminar la sesión')
            }
        } catch (error) {
            console.error(error, "Error desde Catch");
            Alert.alert('Error', 'Ocurrió un error al iniciar sesión con bryancito');
        }
    }
    const handlerLogin = async () => {
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
                setContrasenia('')
                setUsuario('')
                navigation.navigate('TabNavigator');
            } else {
                console.log(data);
                Alert.alert('Error sesión', data.error);
            }
        } catch (error) {
            console.error(error, "Error desde Catch");
            Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
        }
    };

    // Función para navegar hacia la pantalla de registro
    const irRegistrar = async () => {
        navigation.navigate('Registro');
    };

    useEffect(() => { validarSesion() }, [])

    return (
        <ImageBackground source={require('../img/fondo.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../img/logo-no-background.png')} // Asegúrate de que esta ruta es correcta
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
});