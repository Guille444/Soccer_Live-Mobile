import React from 'react';
import { View, Text, Modal, StyleSheet, Button, FlatList } from 'react-native';

const ModalComentarios = ({ visible, cerrarModal, comentarios }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={cerrarModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Comentarios del Producto</Text>
          <FlatList
            data={comentarios}
            keyExtractor={(item) => item.id_comentario.toString()}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <Text style={styles.commentText}>Cliente: {item.cliente}</Text>
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Text
                      key={rating}
                      style={[
                        styles.star,
                        rating <= item.puntuacion_comentario ? styles.filledStar : styles.emptyStar
                      ]}
                    >
                      ★
                    </Text>
                  ))}
                </View>
                <Text style={styles.commentText}>Comentario: {item.contenido_comentario}</Text>
                <Text style={styles.commentDate}>{item.fecha_comentario}</Text>
              </View>
            )}
          />
          <Button title="Cerrar" onPress={cerrarModal} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    height: '50%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentContainer: {
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  commentText: {
    fontSize: 16,
  },
  commentDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 24, // Ajusta el tamaño si es necesario
    marginHorizontal: 2, // Espaciado entre estrellas
  },
  filledStar: {
    color: '#f0c14b', // Color dorado para estrellas llenas
  },
  emptyStar: {
    color: '#ddd', // Color gris para estrellas vacías
  },
});

export default ModalComentarios;
