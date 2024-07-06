//Importaciones
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import * as Constantes from '../../utils/constantes';
import CarritoCard from '../components/CarritoCard/CarritoCard';
import ModalEditarCantidad from '../components/Modales/ModalEditarCantidad';
import { FontAwesome } from '@expo/vector-icons'; // Importar FontAwesome desde expo
import AwesomeAlert from 'react-native-awesome-alerts';

//Configuracion del encabezado de la navegacion
const Carrito = ({ navigation }) => {
    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Carrito',
            headerTitleAlign: 'center',
            headerTransparent: true,
            headerStyle: {
                backgroundColor: 'transparent',
            },
            headerTintColor: '#fff',
        });
    }, [navigation]);

     // Definición de estados
    const ip = Constantes.IP;
    const [dataDetalleCarrito, setDataDetalleCarrito] = useState([]);
    const [idDetalle, setIdDetalle] = useState(null);
    const [cantidadProductoCarrito, setCantidadProductoCarrito] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showProgress, setShowProgress] = useState(false);

    //Funcion para optener los detalles del carrito
    const getDetalleCarrito = useCallback(async () => {
        try {
            const response = await fetch(`${ip}/services/public/pedido.php?action=readDetail`, {
                method: 'GET',
            });
            const data = await response.json();
            if (data.status) {
                setDataDetalleCarrito(data.dataset);
                if (data.dataset.length === 0) {
                    showAlertWithMessage('No hay detalles del carrito disponibles.');
                }
            } else {
                console.log("No hay detalles del carrito disponibles");
                showAlertWithMessage('No hay detalles del carrito disponibles.');
            }
        } catch (error) {
            console.error(error, "Error desde Catch");
            showAlertWithMessage('Ocurrió un error al obtener los detalles del carrito.');
        }
    }, [ip]);

     // UseEffect para actualizar los detalles del carrito al enfocarse en la pantalla
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getDetalleCarrito();
        });
        return unsubscribe;
    }, [navigation, getDetalleCarrito]);

    //Fumncion para finalizar el pedido
    const finalizarPedido = async () => {
        try {
            const response = await fetch(`${ip}/services/public/pedido.php?action=finishOrder`, {
                method: 'GET',
            });
            const data = await response.json();
            if (data.status) {
                showAlertWithMessage('Se finalizó la compra correctamente.');
                setDataDetalleCarrito([]);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Productos' }],
                }); // Navegar a Productos al finalizar el pedido
            } else {
                showAlertWithMessage(data.error);
            }
        } catch (error) {
            showAlertWithMessage('Ocurrió un error al finalizar el pedido.');
        }
    };

    // Función para manejar la edición de detalles del carrito
    const handleEditarDetalle = (idDetalle, cantidadDetalle) => {
        setModalVisible(true);
        setIdDetalle(idDetalle);
        setCantidadProductoCarrito(cantidadDetalle);
    };

    //render de elementos del carrito
    const renderItem = ({ item }) => (
        <CarritoCard
            item={item}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            setCantidadProductoCarrito={setCantidadProductoCarrito}
            cantidadProductoCarrito={cantidadProductoCarrito}
            idDetalle={idDetalle}
            setIdDetalle={setIdDetalle}
            accionBotonDetalle={handleEditarDetalle}
            getDetalleCarrito={getDetalleCarrito}
            updateDataDetalleCarrito={setDataDetalleCarrito}
        />
    );

    //Funcion para alerta
    const showAlertWithMessage = (message, showProgressIndicator = false) => {
        setAlertMessage(message);
        setShowProgress(showProgressIndicator);
        setShowAlert(true);
    };

    //Componente principal
    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../img/fondo.png')} style={styles.backgroundImage}>
                <View style={styles.contentContainer}>
                    <ModalEditarCantidad
                        setModalVisible={setModalVisible}
                        modalVisible={modalVisible}
                        idDetalle={idDetalle}
                        setIdDetalle={setIdDetalle}
                        setCantidadProductoCarrito={setCantidadProductoCarrito}
                        cantidadProductoCarrito={cantidadProductoCarrito}
                        getDetalleCarrito={getDetalleCarrito}
                    />
                    {dataDetalleCarrito.length > 0 ? (
                        <FlatList
                            data={dataDetalleCarrito}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id_detalle.toString()}
                        />
                    ) : (
                        <View style={styles.emptyCartContainer}>
                            <Text style={styles.titleDetalle}>No hay detalles del carrito disponibles.</Text>
                        </View>
                    )}
                    {dataDetalleCarrito.length > 0 && (
                        <TouchableOpacity style={styles.button} onPress={finalizarPedido}>
                            <FontAwesome name="check" size={20} color="white" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Finalizar Pedido</Text>
                        </TouchableOpacity>
                    )}
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
        </SafeAreaView>
    );
};

export default Carrito;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A305E',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Ajusta la imagen para que cubra el fondo
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 100,
        alignItems: 'center',
    },
    titleDetalle: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginVertical: 16,
        color: '#fff',
    },
    button: {
        backgroundColor: 'green',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 10,
        flexDirection: 'row', // Alinear ícono y texto en una fila
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonIcon: {
        marginRight: 10, // Espacio entre el ícono y el texto
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
