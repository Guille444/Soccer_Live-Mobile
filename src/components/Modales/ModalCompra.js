import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import * as Constantes from '../../../utils/constantes';
import { useFocusEffect } from '@react-navigation/native';

const ModalCompra = ({ visible, cerrarModal, nombreProductoModal, idProductoModal, cantidad, setCantidad }) => {
    const ip = Constantes.IP;
    const [stockDisponible, setStockDisponible] = useState(0);

    useEffect(() => {
        const fetchStock = async () => {
            console.log('ID del producto en useEffect:', idProductoModal); // Verifica el valor de idProductoModal

            if (!idProductoModal) {
                console.log('El ID del producto es nulo o vacío');
                return;
            }

            try {
                const formData = new FormData();
                formData.append('idProducto', idProductoModal);

                console.log('Datos enviados:', {
                    idProducto: idProductoModal
                });

                const response = await fetch(`${ip}/services/public/producto.php?action=readStock`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                console.log('Respuesta del servidor:', data);
                if (data.status) {
                    setStockDisponible(data.stockDisponible);
                } else {
                    Alert.alert('Error', data.error);
                }
            } catch (error) {
                console.log('Error en fetchStock:', error);
                Alert.alert('Error', 'Ocurrió un error al obtener el stock del producto');
            }
        };

        fetchStock();
    }, [idProductoModal]);

    const handleCreateDetail = async () => {
        try {
            if (cantidad < 1 || cantidad > stockDisponible) {
                Alert.alert("Cantidad no válida", `Solo hay ${stockDisponible} unidades disponibles.`);
                return;
            }

            const formData = new FormData();
            formData.append('idProducto', idProductoModal);
            formData.append('cantidadProducto', cantidad);

            console.log('Datos enviados a createDetail:', {
                idProducto: idProductoModal,
                cantidadProducto: cantidad
            });

            const response = await fetch(`${ip}/services/public/pedido.php?action=createDetail`, {
                method: 'POST',
                body: formData,
            });

            const text = await response.text(); // Obtener la respuesta como texto
            console.log('Respuesta cruda del servidor a createDetail:', text);

            try {
                const data = JSON.parse(text); // Intentar analizar el texto como JSON
                console.log('Respuesta del servidor a createDetail:', data);

                if (data.status) {
                    Alert.alert('Datos Guardados correctamente');
                    cerrarModal(false);
                } else {
                    Alert.alert('Error', data.error);
                }
            } catch (jsonError) {
                console.error('Error al analizar JSON:', jsonError);
                Alert.alert('Error', 'Respuesta del servidor no es un JSON válido');
            }
        } catch (error) {
            console.log('Error en handleCreateDetail:', error);
            Alert.alert('Ocurrió un error al crear detalle');
        }
    };

    const handleCancelCarrito = () => {
        setCantidad(''); // Resetea el estado de cantidad
        cerrarModal(false);
    };

    useFocusEffect(
        React.useCallback(() => {
            setCantidad('');
        }, [])
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
                cerrarModal(!visible);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Cantidad:</Text>
                    <TextInput
                        style={styles.input}
                        value={cantidad}
                        onChangeText={text => setCantidad(text)}
                        keyboardType="numeric"
                        placeholder="Ingrese la cantidad"
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleCreateDetail}
                    >
                        <Text style={styles.buttonText}>Agregar al carrito</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleCancelCarrito}
                    >
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        width: 200,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#458CC6',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ModalCompra;
