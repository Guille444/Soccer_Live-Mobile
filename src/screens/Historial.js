import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, FlatList, SafeAreaView } from 'react-native';
import StarRatingWidget from 'react-native-star-rating-widget';
import AwesomeAlert from 'react-native-awesome-alerts'; // Importa AwesomeAlert
import * as Constantes from '../../utils/constantes';

export default function Historial({ navigation }) {
    const [historial, setHistorial] = useState([]);
    const [comentarios, setComentarios] = useState({});
    const [rating, setRating] = useState({});
    const [submittedComments, setSubmittedComments] = useState({});
    const [isAlertVisible, setIsAlertVisible] = useState(false); // Renombrado
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const ip = Constantes.IP;

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Historial',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#0A305E',
                elevation: 0,
                shadowOpacity: 0,
            },
            headerTintColor: '#fff',
        });

        fetchHistorialPedidos();
    }, []);

    const fetchHistorialPedidos = async () => {
        try {
            const formData = new FormData();
            formData.append('valor', '%%');

            const response = await fetch(`${ip}/services/public/detalle_pedido.php?action=searchHistorial`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.status === 1) {
                setHistorial(result.dataset);
            } else {
                showAlert('Error', 'Error al obtener el historial: ' + result.error);
            }
        } catch (error) {
            showAlert('Error', 'Error en la solicitud: ' + error.message);
        }
    };

    const handleCommentChange = (id, text) => {
        setComentarios(prevComentarios => ({
            ...prevComentarios,
            [id]: text
        }));
    };

    const handleRatingChange = (id, rating) => {
        setRating(prevRating => ({
            ...prevRating,
            [id]: rating
        }));
    };

    const validateAndSubmitComment = async (id) => {
        const comentario = comentarios[id] || '';
        const ratingValue = rating[id] || 0;

        if (!comentario.trim() || ratingValue <= 0) {
            showAlert('Error', 'Por favor, completa todos los campos antes de enviar.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('idDetalle', id);
            formData.append('contenidoComentario', comentario);
            formData.append('starValue', ratingValue.toString());

            const response = await fetch(`${ip}/services/public/comentario.php?action=createRow`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.status === 1) {
                showAlert('Éxito', 'Comentario enviado correctamente');
                setSubmittedComments(prev => ({
                    ...prev,
                    [id]: true
                }));
            } else {
                showAlert('Error', 'Error al enviar el comentario: ' + result.error);
            }
        } catch (error) {
            showAlert('Error', 'Error en la solicitud: ' + error.message);
        }
    };

    const showAlert = (title, message) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setIsAlertVisible(true); // Actualizado
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Producto: {item.nombre_producto}</Text>
            <Text style={styles.itemText}>Descripción: {item.descripcion_producto}</Text>
            <Text style={styles.itemText}>Cantidad: {item.cantidad_producto}</Text>
            <Text style={styles.itemText}>Fecha: {item.fecha_registro}</Text>
            <StarRatingWidget
                rating={rating[item.id_detalle] || 0}
                onChange={(rating) => handleRatingChange(item.id_detalle, rating)}
                starSize={20}
                fullStarColor="#FFD700"
                containerStyle={styles.starContainer}
                disabled={submittedComments[item.id_detalle] || false}
            />
            <TextInput
                style={styles.input}
                placeholder="Escribe tu comentario aquí..."
                value={comentarios[item.id_detalle] || ''}
                onChangeText={(text) => handleCommentChange(item.id_detalle, text)}
                editable={!submittedComments[item.id_detalle]}
            />
            <Button
                title="Enviar Comentario"
                onPress={() => validateAndSubmitComment(item.id_detalle)}
                disabled={submittedComments[item.id_detalle]}
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
                    style={styles.list}
                />
                {historial.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.welcomeText}>No hay historial disponible</Text>
                    </View>
                )}
                <AwesomeAlert
                    show={isAlertVisible} // Actualizado
                    title={alertTitle}
                    message={alertMessage}
                    showConfirmButton={true}
                    confirmText="OK"
                    confirmButtonColor="gray"
                    onConfirmPressed={() => setIsAlertVisible(false)} // Actualizado
                    contentContainerStyle={styles.alertContentContainer}
                    titleStyle={styles.alertTitle}
                    messageStyle={styles.alertMessage}
                    confirmButtonStyle={styles.alertConfirmButton}
                    confirmButtonTextStyle={styles.alertConfirmButtonText}
                />
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
        backgroundColor: '#0A305E',
    },
    list: {
        marginTop: 25,
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    starContainer: {
        marginVertical: 10,
    },
    emptyContainer: {
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
