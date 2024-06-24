<?php
// Se incluye la clase del modelo.
require_once('../../models/data/comentarios_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $comentario = new ComentarioData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idEmpleado'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'searchRows':
                if (
                    !$comentario->setSearch($_POST['valor']) 
                ) {
                    $result['error'] = $comentario->getDataError();
                } 
                elseif ($result['dataset'] = $comentario->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$comentario->setNombre($_POST['nombreModelo']) or
                    //!$comentario->setDescripcion($_POST['descripcionModelo']) or
                    !$comentario->setCategoria($_POST['marcaModelo']) or
                    !$comentario->setEstado(isset($_POST['estadoModelo']) ? "A" : "I") or
                    !$comentario->setImagen($_FILES['imagenModelo'])
                ) {
                    $result['error'] = $comentario->getDataError();
                } elseif ($comentario->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Comentario creado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::saveFile($_FILES['imagencomentario'], $comentario::RUTA_IMAGEN);
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el comentario';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $comentario->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = ' No se encontraron registros';
                }
                break;
            case 'readOne':
                if (!$comentario->setId($_POST['idComentario'])) {
                    $result['error'] = $comentario->getDataError();
                } elseif ($result['dataset'] = $comentario->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Comentario inexistente';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$comentario->setId($_POST['idComentario']) or
                    !$comentario->setEstado(isset($_POST['estadoComentario']) ? 1 : 0) 
                ) {
                    $result['error'] = $comentario->getDataError();
                } elseif ($comentario->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Registro modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el comentario';
                }
                break;
            case 'deleteRow':
                if (
                    !$comentario->setId($_POST['idcomentario']) or
                    !$comentario->setFilename()
                ) {
                    $result['error'] = $comentario->getDataError();
                } elseif ($comentario->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Comentario eliminado correctamente';
                    // Se asigna el estado del archivo después de eliminar.
                    $result['fileStatus'] = Validator::deleteFile($comentario::RUTA_IMAGEN, $comentario->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el comentario';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
        // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
        $result['exception'] = Database::getException();
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('Content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al controlador.
        print(json_encode($result));
    } else {
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}