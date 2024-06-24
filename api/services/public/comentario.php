<?php
// Se incluye la clase del modelo.
require_once('../../models/data/comentarios_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $pedido = new ComentarioData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'error' => null, 'exception' => null, 'dataset' => null);
    // Se verifica si existe una sesión iniciada como cliente para realizar las acciones correspondientes.
    // Se compara la acción a realizar cuando un cliente ha iniciado sesión.
    switch ($_GET['action']) {
            // Acción para agregar un producto al carrito de compras.
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$pedido->setIdDetalle($_POST['idDetalle'])or
                    !$pedido->setMensaje($_POST['contenidoComentario'])or
                    !$pedido->setPuntuacion($_POST['starValue'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($pedido->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Comentario enviado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    
                } else {
                    $result['error'] = 'Ocurrió un problema al registrar';
                }
                break;
            // Acción para obtener los productos agregados en el carrito de compras.
        case 'readAllActive':
            if (
                !$pedido->setIdProducto($_POST['idModelo'])
            ) {
                $result['error'] = $pedido->getDataError();
            } elseif ($result['dataset'] = $pedido->readAllActive()) {
                $result['status'] = 1;
                $result['message'] = count($result['dataset']);
            } else {
                $result['error'] = 'No hay comentarios de este modelo';
            }
            break;
            case 'readByIdDetalle':
                if (
                    !$pedido->setIdDetalle($_POST['idDetalle'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($result['dataset'] = $pedido->readByIdDetalle()) {
                    $result['status'] = 1;
                } else {
                    $result['status'] = 0;
                    $result['error'] = 'No hay comentarios de este modelo';
                }
                break;
            case 'readByIdComentario':
                    if (
                        !$pedido->setId($_POST['idComentario'])
                    ) {
                        $result['error'] = $pedido->getDataError();
                    } elseif ($result['dataset'] = $pedido->readByIdComentario()) {
                        $result['status'] = 1;
                    } else {
                        $result['error'] = 'No hay comentarios de este modelo';
                    }
                    break;
            // Acción para actualizar la cantidad de un producto en el carrito de compras.
            /*case 'updateDetail':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$pedido->setIdDetalle($_POST['idDetalle']) or
                    !$pedido->setCantidad($_POST['cantidadModelo'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($pedido->updateDetail()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cantidad modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la cantidad';
                }
                break;
            // Acción para remover un producto del carrito de compras.
            case 'deleteDetail':
                if (!$pedido->setIdDetalle($_POST['idDetalle'])) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($pedido->deleteDetail()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto removido correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al remover el producto';
                }
                break;
            // Acción para finalizar el carrito de compras.
            case 'finishOrder':
                if ($pedido->finishOrder()) {
                    $result['status'] = 1;
                    $result['message'] = 'Pedido finalizado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al finalizar el pedido';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';*/
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