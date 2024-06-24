import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Image, ImageBackground, Alert } from 'react-native';
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

    // Expresión regular para validar el formato de teléfono
    const telefonoRegex = /^\d{4}-\d{4}$/;

    const handleTextChange = (text) => {
        // Eliminar todos los caracteres no numéricos
        let formatted = text.replace(/[^\d]/g, '');

        // Limitar la longitud a 8 caracteres
        if (formatted.length > 8) {
            formatted = formatted.slice(0, 8);
        }

        // Agregar el guion después del cuarto dígito
        if (formatted.length > 4) {
            formatted = formatted.slice(0, 4) + '-' + formatted.slice(4);
        }

        setTelefono(formatted);
    };

    const handleCreate = async () => {
        try {
            // Validar los campos
            if (!nombre.trim() || !apellido.trim() || !direccion.trim() || !telefono.trim() ||
                !email.trim() || !clave.trim() || !confirmarClave.trim()) {
                Alert.alert("Debes llenar todos los campos");
                return;
            } else if (!telefonoRegex.test(telefono)) {
                Alert.alert("El teléfono debe tener el formato correcto (####-####)");
                return;
            }

            // Si todos los campos son válidos, proceder con la creación del usuario
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
                Alert.alert('Cuenta registrada correctamente');
                navigation.navigate('Login');
            } else {
                Alert.alert('Error', data.error);
            }
        } catch (error) {
            Alert.alert('Ocurrió un problema al registrar la cuenta');
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
    subtitle: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 24,
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
});