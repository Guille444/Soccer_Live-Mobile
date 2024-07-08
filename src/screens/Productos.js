// Importación de React y otros módulos necesarios para la aplicación.
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Alert, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import * as Constantes from '../../utils/constantes';
import ProductoCard from '../components/Productos/ProductoCard';
import ModalCompra from '../components/Modales/ModalCompra';
import RNPickerSelect from 'react-native-picker-select';
import { FontAwesome } from '@expo/vector-icons';
import AwesomeAlert from 'react-native-awesome-alerts';

export default function Productos({ navigation }) {
    const ip = Constantes.IP;// Obtención de la IP desde las constantes.
    const [dataProductos, setDataProductos] = useState([]);
    const [dataCategorias, setDataCategorias] = useState([]);
    const [selectedValue, setSelectedValue] = useState(null);
    const [cantidad, setCantidad] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [idProductoModal, setIdProductoModal] = useState('');
    const [nombreProductoModal, setNombreProductoModal] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

    // useEffect para configurar la barra de navegación y cargar productos y categorías.
    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Productos',
            headerTitleAlign: 'center',
            headerTransparent: true,
            headerStyle: {
                backgroundColor: 'transparent',
            },
            headerTintColor: '#fff',
        });
        getProductos(); // Carga inicial de productos.
        getCategorias(); // Carga de categorías.
    }, []);
    // Función para manejar la compra de un producto.
    const handleCompra = (nombre, id) => {
        setModalVisible(true);
        setIdProductoModal(id);
        setNombreProductoModal(nombre);
    };

    const getProductos = async (idCategoriaSelect = 1) => {
        try {
            if (idCategoriaSelect <= 0) return; // Validación de categoría seleccionada.
            const formData = new FormData();
            formData.append('idCategoria', idCategoriaSelect); // Se envía la categoría seleccionada.
            const response = await fetch(`${ip}/services/public/producto.php?action=readProductosCategoria`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.status) {
                console.log(data.dataset)
                setDataProductos(data.dataset);
            } else {
                setAlertConfig({
                    title: 'Error productos',
                    message: data.error,
                    showConfirmButton: true,
                    confirmText: 'OK',
                    confirmButtonColor: '#DD6B55',
                    onConfirmPressed: () => setShowAlert(false)
                });
                setShowAlert(true);  // Mostrar alerta en caso de error.
            }
        } catch (error) {
            setAlertConfig({
                title: 'Error',
                message: 'Ocurrió un error al listar los productos',
                showConfirmButton: true,
                confirmText: 'OK',
                confirmButtonColor: '#DD6B55',
                onConfirmPressed: () => setShowAlert(false)
            });
            setShowAlert(true); // Mostrar alerta en caso de error de red.
        }
    };

    // Función asíncrona para obtener las categorías.
    const getCategorias = async () => {
        try {
            const response = await fetch(`${ip}/services/public/categoria.php?action=readAll`, {
                method: 'GET',
            });
            const data = await response.json();
            if (data.status) {
                setDataCategorias(data.dataset);  // Se actualiza la lista de categorías.
            } else {
                setAlertConfig({
                    title: 'Error categorias',
                    message: data.error,
                    showConfirmButton: true,
                    confirmText: 'OK',
                    confirmButtonColor: '#DD6B55',
                    onConfirmPressed: () => setShowAlert(false)
                });
                setShowAlert(true);
            }
        } catch (error) {
            setAlertConfig({
                title: 'Error',
                message: 'Ocurrió un error al listar las categorias',
                showConfirmButton: true,
                confirmText: 'OK',
                confirmButtonColor: '#DD6B55',
                onConfirmPressed: () => setShowAlert(false)
            });
            setShowAlert(true);
        }
    };

    // Función para navegar al carrito de compras.
    const irCarrito = () => {
        navigation.navigate('Carrito');
    };

    // Renderizado de la interfaz de usuario.
    return (
        <ImageBackground source={require('../img/fondo.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <Text style={styles.title}>Catálogo de Productos</Text>
                <View style={styles.pickerContainer}>
                    <RNPickerSelect
                        style={{ inputAndroid: styles.picker }}
                        onValueChange={(value) => getProductos(value)}
                        placeholder={{ label: 'Selecciona una categoría...', value: null }}
                        items={dataCategorias.map(categoria => ({
                            label: categoria.nombre_categoria,
                            value: categoria.id_categoria,
                        }))}
                    />
                </View>
                <SafeAreaView style={styles.containerFlat}>
                    <FlatList
                        data={dataProductos}
                        keyExtractor={(item) => item.id_producto.toString()}
                        renderItem={({ item }) => (
                            <ProductoCard
                                ip={ip}
                                imagenProducto={item.imagen_producto}
                                idProducto={item.id_producto}
                                nombreProducto={item.nombre_producto}
                                descripcionProducto={item.descripcion_producto}
                                precioProducto={item.precio_producto}
                                existenciasProducto={item.existencias_producto}
                                accionBotonProducto={() => handleCompra(item.nombre_producto, item.id_producto)}
                            />
                        )}
                    />
                </SafeAreaView>
                <TouchableOpacity style={styles.cartButton} onPress={irCarrito}>
                    <FontAwesome name="shopping-cart" size={24} color="white" />
                    <Text style={styles.cartButtonText}>Ir al carrito</Text>
                </TouchableOpacity>
            </View>
            <ModalCompra
                visible={modalVisible}
                cerrarModal={setModalVisible}
                nombreProductoModal={nombreProductoModal}
                idProductoModal={idProductoModal}
                cantidad={cantidad}
                setCantidad={setCantidad}
            />
            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title={alertConfig.title}
                message={alertConfig.message}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={alertConfig.showConfirmButton}
                confirmText={alertConfig.confirmText}
                confirmButtonColor={alertConfig.confirmButtonColor}
                onConfirmPressed={alertConfig.onConfirmPressed}
            />
        </ImageBackground>
    );
}


// Estilos para el componente
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
        padding: 16,
        paddingTop: 75,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    pickerContainer: {
        width: '90%',
        borderWidth: 1,
        color: '#fff',
        borderColor: '#458CC6',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 20,
        backgroundColor: '#458CC6',
    },
    picker: {
        color: '#fff',
    },
    containerFlat: {
        flex: 1,
        width: '100%',
    },
    cartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#458CC6',
        borderRadius: 100,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    cartButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
        borderRadius: 100,
    },
});