import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Constantes from '../../utils/constantes';

export default function Registro({ navigation }) {

    const ip = Constantes.IP;

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [clave, setClave] = useState('');
    const [confirmarClave, setConfirmarClave] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const telefonoRegex = /^\d{4}-\d{4}$/;

    const handleTextChange = (text) => {
        let formatted = text.replace(/[^\d]/g, '');
        if (formatted.length > 8) {
            formatted = formatted.slice(0, 8);
        }
        if (formatted.length > 4) {
            formatted = formatted.slice(0, 4) + '-' + formatted.slice(4);
        }
        setTelefono(formatted);
    };

    const showAlertWithMessage = (message) => {
        setAlertMessage(message);
        setShowAlert(true);
    };

    const handleCreate = async () => {
        if (!nombre.trim() || !apellido.trim() || !direccion.trim() || !telefono.trim() ||
            !email.trim() || !clave.trim() || !confirmarClave.trim()) {
            showAlertWithMessage("Debes llenar todos los campos");
            return;
        } else if (!telefonoRegex.test(telefono)) {
            showAlertWithMessage("El teléfono debe tener el formato correcto (####-####)");
            return;
        }

        setIsRegistering(true);

        try {
            const formData = new FormData();
            formData.append('nombreCliente', nombre);
            formData.append('apellidoCliente', apellido);
            formData.append('direccionCliente', direccion);
            formData.append('telefonoCliente', telefono);
            formData.append('correoCliente', email);
            formData.append('claveCliente', clave);
            formData.append('confirmarClave', confirmarClave);

            const response = await fetch(`${ip}/services/public/cliente.php?action=signUp`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.status) {
                showAlertWithMessage('Cuenta registrada correctamente');
                setTimeout(() => {
                    setShowAlert(false);
                    navigation.navigate('Login');
                }, 2000);
            } else {
                showAlertWithMessage(data.error);
            }
        } catch (error) {
            showAlertWithMessage('Ocurrió un problema al registrar la cuenta');
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <ImageBackground source={require('../img/fondo.png')} style={styles.backgroundImage}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../img/atras.png')} style={styles.backIcon} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Registrarse</Text>
                </View>
                <TextInput
                    value={nombre}
                    onChangeText={setNombre}
                    style={styles.input}
                    placeholder="Nombre"
                    placeholderTextColor="#fff"
                />
                <TextInput
                    value={apellido}
                    onChangeText={setApellido}
                    style={styles.input}
                    placeholder="Apellido"
                    placeholderTextColor="#fff"
                />
                <TextInput
                    value={direccion}
                    onChangeText={setDireccion}
                    style={styles.input}
                    placeholder="Dirección"
                    placeholderTextColor="#fff"
                />
                <TextInput
                    value={telefono}
                    onChangeText={handleTextChange}
                    style={styles.input}
                    placeholder="Teléfono"
                    placeholderTextColor="#fff"
                    keyboardType="phone-pad"
                />
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#fff"
                    keyboardType="email-address"
                />
                <TextInput
                    value={clave}
                    onChangeText={setClave}
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#fff"
                    secureTextEntry={true}
                />
                <TextInput
                    value={confirmarClave}
                    onChangeText={setConfirmarClave}
                    style={styles.input}
                    placeholder="Confirmar contraseña"
                    placeholderTextColor="#fff"
                    secureTextEntry={true}
                />
                <TouchableOpacity onPress={handleCreate} style={styles.button}>
                    <Text style={styles.buttonText}>REGISTRARSE</Text>
                </TouchableOpacity>
                <AwesomeAlert
                    show={showAlert}
                    showProgress={isRegistering}
                    title={isRegistering ? "Registrando" : "Mensaje"}
                    message={alertMessage}
                    closeOnTouchOutside={!isRegistering}
                    closeOnHardwareBackPress={!isRegistering}
                    showCancelButton={false}
                    showConfirmButton={!isRegistering}
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
};

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
        color: '#fff',
        justifyContent: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 12,
        fontSize: 16,
        color: '#fff',
    },
    button: {
        width: '50%',
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