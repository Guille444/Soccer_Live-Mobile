<?php
// Se incluye la clase del modelo.
require_once('../../models/data/productos_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se instancia la clase correspondiente.
    $producto = new ProductoData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null);
    // Se compara la acción a realizar según la petición del controlador.
    switch ($_GET['action']) {
        case 'readProductosCategoria':
            if (!$producto->setCategoria($_POST['idCategoria'])) {
                $result['error'] = $producto->getDataError();
            } elseif ($result['dataset'] = $producto->readProductosCategoria()) {
                $result['status'] = 1;
            } else {
                $result['error'] = 'No existen productos para mostrar';
            }
            break;
        case 'readOne':
            if (!$producto->setId($_POST['idProducto'])) {
                $result['error'] = $producto->getDataError();
            } elseif ($result['dataset'] = $producto->readOne()) {
                $result['status'] = 1;
            } else {
                $result['error'] = 'Producto inexistente';
            }
            break;
        case 'readStock':
            error_log('ID del producto recibido: ' . print_r($_POST['idProducto'], true)); // Imprime el valor recibido en el log del servidor
            if (!$producto->setId($_POST['idProducto'])) {
                $result['error'] = $producto->getDataError();
                error_log("Error en setId: " . $producto->getDataError()); // Imprime el error en el log del servidor
            } elseif ($result['dataset'] = $producto->readStock()) {
                $result['status'] = 1;
                $result['stockDisponible'] = $result['dataset']['existencias_producto']; // Ajusta según el nombre del campo en la base de datos
            } else {
                $result['error'] = 'Identificador del producto incorrecto';
                error_log("Error: Identificador del producto incorrecto"); // Imprime el mensaje de error en el log del servidor
            }
            break;
        default:
            $result['error'] = 'Acción no disponible';
    }
    // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
    $result['exception'] = Database::getException();
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('Content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}
