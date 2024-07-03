import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import Constants from 'expo-constants';
import * as Constantes from '../../../utils/constantes';

const CarritoCard = ({
    item,
    modalVisible,
    setModalVisible,
    cantidadProductoCarrito,
    setCantidadProductoCarrito,
    accionBotonDetalle,
    idDetalle,
    setIdDetalle,
    getDetalleCarrito,
    updateDataDetalleCarrito
}) => {
    const ip = Constantes.IP;

    const handleDeleteDetalleCarrito = async (idDetalle) => {
        try {
            Alert.alert(
                'Confirmación',
                '¿Estás seguro de que deseas eliminar este elemento del carrito?',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel'
                    },
                    {
                        text: 'Eliminar',
                        onPress: async () => {
                            console.log('Iniciando la eliminación del detalle del carrito:', idDetalle);
                            const formData = new FormData();
                            formData.append('idDetalle', idDetalle);

                            try {
                                const response = await fetch(`${ip}/services/public/pedido.php?action=deleteDetail`, {
                                    method: 'POST',
                                    body: formData
                                });

                                console.log('Respuesta recibida del servidor:', response);

                                const data = await response.json();
                                console.log('Datos recibidos del servidor:', data);

                                if (data.status) {
                                    Alert.alert('Datos eliminados correctamente del carrito');
                                    updateDataDetalleCarrito(prevData => prevData.filter(item => item.id_detalle !== idDetalle));
                                } else {
                                    Alert.alert('Error al eliminar del carrito', data.error);
                                }
                            } catch (error) {
                                console.error('Error durante la solicitud fetch:', error);
                                Alert.alert('Error al eliminar del carrito');
                            }
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Error en handleDeleteDetalleCarrito:', error);
            Alert.alert('Error al eliminar del carrito');
        }
    };


    return (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>ID: {item.id_detalle}</Text>
            <Text style={styles.itemText}>Nombre: {item.nombre_producto}</Text>
            <Text style={styles.itemText}>Precio: ${item.precio_producto}</Text>
            <Text style={styles.itemText}>Cantidad: {item.cantidad_producto}</Text>
            <Text style={styles.itemText}>SubTotal: ${(parseFloat(item.cantidad_producto) * parseFloat(item.precio_producto)).toFixed(2)}</Text>

            <TouchableOpacity style={styles.modifyButton} onPress={() => accionBotonDetalle(item.id_detalle, item.cantidad_producto)}>
                <Text style={styles.buttonText}>Modificar Cantidad</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteDetalleCarrito(item.id_detalle)}>
                <Text style={styles.buttonText}>Eliminar del carrito</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CarritoCard;

const styles = StyleSheet.create({
    itemContainer: {
        padding: 16,
        marginBottom: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        zIndex: 1, // Asegura que esté por encima de otros elementos
    },
    itemText: {
        fontSize: 16,
        marginBottom: 4,
        color: '#333',
    },
    modifyButton: {
        borderWidth: 1,
        borderColor: '#458CC6',
        borderRadius: 100,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#458CC6',
        marginVertical: 4,
    },
    deleteButton: {
        borderWidth: 1,
        borderRadius: 100,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: 'red',
        borderColor: 'red',
        marginVertical: 4,
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
    },
});
