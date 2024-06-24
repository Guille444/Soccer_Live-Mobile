<?php
// Se incluye la clase del modelo.
require_once('../../models/data/empleados_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $empleado = new EmpleadoData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como empleado, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idEmpleado'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un empleado ha iniciado sesión.
        switch ($_GET['action']) {
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $empleado->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$empleado->setNombre($_POST['nombreEmpleado']) or
                    !$empleado->setApellido($_POST['apellidoEmpleado']) or
                    !$empleado->setTelefono($_POST['telefonoEmpleado']) or
                    !$empleado->setDui($_POST['duiEmpleado']) or
                    !$empleado->setCorreo($_POST['correoEmpleado']) or
                    !$empleado->setClave($_POST['claveEmpleado']) 
                ) {
                        $result['error'] = $empleado->getDataError();
                    } elseif ($_POST['claveEmpleado'] != $_POST['confirmarClave']) {
                        $result['error'] = 'Contraseñas diferentes';
                    } elseif ($empleado->createRow()) {
                        $result['status'] = 1;
                        $result['message'] = 'Empleado creado correctamente';
                    } else {
                        $result['error'] = 'Ocurrió un problema al crear el administrador';
                    }
                break;
            case 'readAll':
                if ($result['dataset'] = $empleado->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen empleadoes registrados';
                }
                break;
            case 'readOne':
                if (!$empleado->setId($_POST['idEmpleado'])) {
                    $result['error'] = 'Empleado incorrecto';
                } elseif ($result['dataset'] = $empleado->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Empleado inexistente';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$empleado->setId($_POST['idEmpleado']) or
                    !$empleado->setNombre($_POST['nombreEmpleado']) or
                    !$empleado->setApellido($_POST['apellidoEmpleado']) or
                    !$empleado->setTelefono($_POST['telefonoEmpleado'])
                ) {
                    $result['error'] = $empleado->getDataError();
                } elseif ($empleado->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Empleado modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el empleado';
                }

                break;
            case 'deleteRow':
                if ($_POST['idEmpleado'] == $_SESSION['idEmpleado']) {
                    $result['error'] = 'No se puede eliminar a sí mismo';
                } elseif (!$empleado->setId($_POST['idEmpleado'])) {
                    $result['error'] = $empleado->getDataError();
                } elseif ($empleado->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Empleado eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el empleado';
                }
                break;
            case 'getUser':
                if (isset($_SESSION['correoEmpleado'])) {
                    $result['status'] = 1;
                    $result['username'] = $_SESSION['correoEmpleado'];
                } else {
                    $result['error'] = 'Correo de empleado indefinido';
                }
                break;
            case 'logOut':
                if (session_destroy()) {
                    $result['status'] = 1;
                    $result['message'] = 'Sesión eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cerrar la sesión';
                }
                break;
            case 'readProfile':
                if ($result['dataset'] = $empleado->readProfile()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrió un problema al leer el perfil';
                }
                break;
            case 'editProfile':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$empleado->setNombre($_POST['nombreEmpleado']) or
                    !$empleado->setApellido($_POST['apellidoEmpleado']) or
                    !$empleado->setTelefono($_POST['telefonoEmpleado']) or
                    !$empleado->setCorreo($_POST['correoEmpleado'])
                ) {
                    $result['error'] = $empleado->getDataError();
                } elseif ($empleado->editProfile()) {
                    $result['status'] = 1;
                    $result['message'] = 'Perfil modificado correctamente';
                    $_SESSION['correoEmpleado'] = $_POST['correoEmpleado'];
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el perfil';
                }
                break;
            case 'changePassword':
                $_POST = Validator::validateForm($_POST);
                if (!$empleado->checkPassword($_POST['claveActual'])) {
                    $result['error'] = 'Contraseña actual incorrecta';
                } elseif ($_POST['claveNueva'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Confirmación de contraseña diferente';
                } elseif (!$empleado->setClave($_POST['claveNueva'])) {
                    $result['error'] = $empleado->getDataError();
                } elseif ($empleado->changePassword()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contraseña cambiada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cambiar la contraseña';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando el empleado no ha iniciado sesión.
        switch ($_GET['action']) {
            case 'readUsers':
                if ($empleado->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Debe autenticarse para ingresar';
                } else {
                    $result['error'] = 'Debe crear un empleado para comenzar';
                }
                break;
            case 'signUp':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$empleado->setNombre($_POST['nombreEmpleado']) or
                    !$empleado->setApellido($_POST['apellidoEmpleado']) or
                    !$empleado->setTelefono($_POST['telefonoEmpleado']) or
                    !$empleado->setDui($_POST['duiEmpleado']) or
                    !$empleado->setCorreo($_POST['correoEmpleado']) or
                    !$empleado->setClave($_POST['claveEmpleado'])
                ) {
                    $result['error'] = $empleado->getDataError();
                } elseif ($_POST['claveEmpleado'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($empleado->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Empleado registrado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al registrar el empleado';
                }
                break;
            case 'logIn':
                $_POST = Validator::validateForm($_POST);
                if ($empleado->checkUser($_POST['correo'], $_POST['clave'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Autenticación correcta';
                } else {
                    $result['error'] = 'Credenciales incorrectas';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible fuera de la sesión';
        }
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
