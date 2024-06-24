<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla empleado.
 */
class EmpleadoHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $apellido = null;
    protected $telefono = null;
    protected $dui = null;
    protected $clave = null;
    protected $correo = null;

    /*
     *  Métodos para gestionar la cuenta del empleado.
     */
    public function checkUser($username, $password)
{
    $sql = 'SELECT id_empleado, correo_empleado, clave_empleado
            FROM empleados
            WHERE  correo_empleado = ?';
    $params = array($username);
    $data = Database::getRow($sql, $params);
    if ($data && password_verify($password, $data['clave_empleado'])) {
        $_SESSION['idEmpleado'] = $data['id_empleado'];
        $_SESSION['correoEmpleado'] = $data['correo_empleado'];
        return true;
    } else {
        return false;
    }
}


    public function checkPassword($password)
    {
        $sql = 'SELECT clave_empleado
                FROM empleados
                WHERE id_empleado = ?';
        $params = array($_SESSION['idEmpleado']);
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if (password_verify($password, $data['clave_empleado'])) {
            return true;
        } else {
            return false;
        }
    }


    public function changePassword()
    {
        $sql = 'UPDATE empleados
                SET clave_empleado = ?
                WHERE id_empleado = ?';
        $params = array($this->clave, $_SESSION['idEmpleado']);
        return Database::executeRow($sql, $params);
    }

    public function readProfile()
    {
        $sql = 'SELECT id_empleado, nombre_empleado, apellido_empleado, telefono_empleado, dui_empleado, correo_empleado, clave_empleado
                FROM empleados
                WHERE id_empleado = ?';
        $params = array($_SESSION['idEmpleado']);
        return Database::getRow($sql, $params);
    }



    public function editProfile()
    {
        $sql = 'UPDATE empleados
                SET nombre_empleado = ?, apellido_empleado = ?, telefono_empleado = ?, correo_empleado = ?
                WHERE id_empleado = ?';
        $params = array($this->nombre, $this->apellido, $this->telefono, $this->correo, $_SESSION['idEmpleado']);
        return Database::executeRow($sql, $params);
    }

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_empleado, nombre_empleado, apellido_empleado, telefono_empleado, dui_empleado, correo_empleado, clave_empleado
                FROM empleados
                WHERE apellido_empleado LIKE ? OR nombre_empleado LIKE ?
                ORDER BY apellido_empleado';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO empleados(nombre_empleado, apellido_empleado, telefono_empleado, dui_empleado, correo_empleado, clave_empleado)
                VALUES(?, ?, ?, ?, ?, ?)';
        $params = array($this->nombre, $this->apellido, $this->telefono, $this->dui, $this->correo, $this->clave);
        return Database::executeRow($sql, $params);
    }
    

    public function readAll()
    {
        $sql = 'SELECT id_empleado, nombre_empleado, apellido_empleado, telefono_empleado, dui_empleado, correo_empleado, clave_empleado
                FROM empleados
                ORDER BY apellido_empleado';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT id_empleado, nombre_empleado, apellido_empleado, telefono_empleado, dui_empleado, correo_empleado, clave_empleado
                FROM empleados
                WHERE id_empleado = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE empleados
                SET nombre_empleado = ?, apellido_empleado = ?, telefono_empleado = ?
                WHERE id_empleado = ?';
        $params = array($this->nombre, $this->apellido, $this->telefono, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM empleados
                WHERE id_empleado = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    public function checkDuplicate($value)
    {
        $sql = 'SELECT id_empleado
                FROM empleados
                WHERE dui_empleado = ?';
        $params = array($value);
        return Database::getRow($sql, $params);
    }

    public function checkDuplicate2($value)
    {
        $sql = 'SELECT id_empleado
                FROM empleados
                WHERE correo_empleado = ?';
        $params = array($value);
        return Database::getRow($sql, $params);
    }

    public function checkDuplicate3($value)
    {
        $sql = 'SELECT id_empleado
                FROM empleados
                WHERE telefono_empleado = ?';
        $params = array($value);
        return Database::getRow($sql, $params);
    }
}