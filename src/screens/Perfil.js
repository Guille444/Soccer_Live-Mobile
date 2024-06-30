import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Constantes from '../../utils/constantes';

export default function Perfil({ navigation }) {
    const ip = Constantes.IP;

    useEffect(() => {
        // Configurar opciones de navegación
        navigation.setOptions({
            headerTitle: 'Perfil',
            headerTitleAlign: 'center',
            headerTransparent: true,
            headerStyle: {
                backgroundColor: 'transparent',
            },
            headerTintColor: '#fff',
            headerRight: () => (
                <TouchableOpacity onPress={handleLogout}>
                    <Image source={require('../img/logout.png')} style={styles.logoutImage} />
                </TouchableOpacity>
            ),
        });
    }, []);

    const [refreshing, setRefreshing] = useState(false);
    const [profileData, setProfileData] = useState({
        nombre_cliente: '',
        apellido_cliente: '',
        direccion_cliente: '',
        telefono_cliente: '',
        correo_cliente: ''
    });

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');

    const fetchProfileData = async () => {
        try {
            const response = await fetch(`${ip}/services/public/cliente.php?action=readProfile`, {
                method: 'POST'
            });
            const data = await response.json();
            if (data.status) {
                setProfileData(data.dataset);
            } else {
                showAlert('Error', 'Failed to fetch profile data', 'error');
            }
        } catch (error) {
            console.error(error, "Error desde Catch");
            showAlert('Error', 'Ocurrió un error al obtener los datos del perfil', 'error');
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(`${ip}/services/public/cliente.php?action=logOut`, {
                method: 'GET'
            });
            const data = await response.json();
            if (data.status) {
                showAlert('Éxito', "Has cerrado sesión exitosamente.", 'success');
                setTimeout(() => {
                    setAlertVisible(false);
                    navigation.navigate('Login');
                }, 2000);
            } else {
                showAlert('Error', "Error al cerrar sesión.", 'error');
            }
        } catch (error) {
            showAlert('Error de red', "Ocurrió un error de red.", 'error');
        }
    };

    const editProfile = async () => {
        try {
            const formData = new FormData();
            formData.append('nombreCliente', profileData.nombre_cliente);
            formData.append('apellidoCliente', profileData.apellido_cliente);
            formData.append('direccionCliente', profileData.direccion_cliente);
            formData.append('telefonoCliente', profileData.telefono_cliente);
            formData.append('correoCliente', profileData.correo_cliente);

            const response = await fetch(`${ip}/services/public/cliente.php?action=editProfile`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.status) {
                showAlert('Success', data.message, 'success');
            } else {
                showAlert('Error', data.error, 'error');
            }
        } catch (error) {
            console.error('Error :', error);
            showAlert('Error', 'Error al registrar', 'error');
        }
    };

    const showAlert = (title, message, type) => {
        setAlertMessage(message);
        setAlertType(type);
        setAlertVisible(true);
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProfileData().then(() => setRefreshing(false));
    }, []);

    return (
        <ImageBackground source={require('../img/fondo.png')} style={styles.backgroundImage}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.form}>
                    <Text style={styles.sectionTitle}>Mi información</Text>
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.nombre_cliente}
                        onChangeText={(text) => setProfileData((prevData) => ({ ...prevData, nombre_cliente: text }))}
                        placeholder="Nombre"
                        placeholderTextColor="#fff"
                    />
                    <Text style={styles.label}>Apellido</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.apellido_cliente}
                        onChangeText={(text) => setProfileData((prevData) => ({ ...prevData, apellido_cliente: text }))}
                        placeholder="Apellido"
                        placeholderTextColor="#fff"
                    />
                    <Text style={styles.label}>Dirección</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.direccion_cliente}
                        onChangeText={(text) => setProfileData((prevData) => ({ ...prevData, direccion_cliente: text }))}
                        placeholder="Dirección"
                        placeholderTextColor="#fff"
                    />
                    <Text style={styles.label}>Teléfono</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.telefono_cliente}
                        onChangeText={(text) => setProfileData((prevData) => ({ ...prevData, telefono_cliente: text }))}
                        placeholder="Teléfono"
                        placeholderTextColor="#fff"
                        keyboardType="phone-pad"
                    />
                    <Text style={styles.label}>Correo</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.correo_cliente}
                        onChangeText={(text) => setProfileData((prevData) => ({ ...prevData, correo_cliente: text }))}
                        placeholder="Correo"
                        placeholderTextColor="#fff"
                        keyboardType="email-address"
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={editProfile}>
                    <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
            </ScrollView>
            <AwesomeAlert
                show={alertVisible}
                showProgress={false}
                title={alertType === 'success' ? 'Éxito' : 'Error'}
                message={alertMessage}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor={alertType === 'success' ? '#0A305E' : '#DD6B55'}
                confirmButtonStyle={styles.alertConfirmButton}
                confirmButtonTextStyle={styles.alertConfirmButtonText}
                onConfirmPressed={() => setAlertVisible(false)}
                contentContainerStyle={styles.alertContentContainer}
                titleStyle={styles.alertTitle}
                messageStyle={styles.alertMessage}
            />
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
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        paddingTop: 50,
    },
    form: {
        marginBottom: 30,
        width: '100%',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 5,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 20,
        fontSize: 18, // Ajuste el tamaño de fuente a 18
        color: '#fff',
    },
    button: {
        width: '50%',
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
    logoutImage: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    confirmButton: {
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    confirmButtonText: {
        fontSize: 18,
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