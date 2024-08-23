import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, FlatList, SafeAreaView } from 'react-native';
import * as Constantes from '../../utils/constantes';

export default function Historial({ navigation }) {
    const [historial, setHistorial] = useState([]);
    const [comentarios, setComentarios] = useState({});
    const ip = Constantes.IP;

    useEffect(() => {
        // Configuración del encabezado
        navigation.setOptions({
            headerTitle: 'Historial',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#0A305E', // Color de fondo sólido para el encabezado
                elevation: 0, // Para Android, quita la sombra del encabezado
                shadowOpacity: 0, // Para iOS, quita la sombra del encabezado
            },
            headerTintColor: '#fff',
        });

        // Llamada a la función para obtener el historial de pedidos
        fetchHistorialPedidos();
    }, []);

    const fetchHistorialPedidos = async () => {
        try {
            const formData = new FormData();
            formData.append('valor', '%%'); // Puedes cambiar esto si necesitas un criterio específico

            const response = await fetch(`${ip}/services/public/detalle_pedido.php?action=searchHistorial`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.status === 1) {
                setHistorial(result.dataset);
            } else {
                console.error('Error al obtener el historial:', result.error);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    const handleCommentChange = (id, text) => {
        setComentarios(prevComentarios => ({
            ...prevComentarios,
            [id]: text
        }));
    };

    const handleSubmitComment = async (id) => {
        try {
            const formData = new FormData();
            formData.append('idDetalle', id);
            formData.append('contenidoComentario', comentarios[id]);
            formData.append('starValue', '5'); // Puedes cambiar esto si necesitas una puntuación específica

            const response = await fetch(`${ip}/services/public/comentario.php?action=createRow`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.status === 1) {
                alert('Comentario enviado correctamente');
            } else {
                console.error('Error al enviar el comentario:', result.error);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Producto: {item.nombre_producto}</Text>
            <Text style={styles.itemText}>Descripción: {item.descripcion_producto}</Text>
            <Text style={styles.itemText}>Cantidad: {item.cantidad_producto}</Text>
            <Text style={styles.itemText}>Fecha: {item.fecha_registro}</Text>
            <TextInput
                style={styles.input}
                placeholder="Escribe tu comentario aquí..."
                value={comentarios[item.id_detalle] || ''}
                onChangeText={(text) => handleCommentChange(item.id_detalle, text)}
            />
            <Button
                title="Enviar Comentario"
                onPress={() => handleSubmitComment(item.id_detalle)}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../img/fondo.png')} style={styles.backgroundImage}>
                <FlatList
                    data={historial}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id_detalle.toString()}
                    contentContainerStyle={styles.listContainer}
                    style={styles.list} // Añadir estilo para asegurar que FlatList se ajuste
                />
                {historial.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.welcomeText}>No hay historial disponible</Text>
                    </View>
                )}
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        backgroundColor: '#0A305E',
    },
    list: {
        marginTop: 10, // Ajusta este valor según la altura del encabezado
    },
    listContainer: {
        padding: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
    },
    itemContainer: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro para resaltar el texto
        borderRadius: 5,
        width: '100%',
    },
    itemText: {
        fontSize: 16,
        color: '#fff',
        marginVertical: 2,
    },
    input: {
        height: 40,
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
        color: '#fff',
        backgroundColor: '#333',
        width: '100%',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
