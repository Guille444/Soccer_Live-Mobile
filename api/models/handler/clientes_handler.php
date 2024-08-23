<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla CLIENTE.
*/
class ClienteHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $nombre = null;
    protected $apellido = null;
    protected $direccion = null;
    protected $telefono = null;
    protected $correo = null;
    protected $clave = null;
    protected $pin = null;
    protected $estado = null;

    /*
    *   Métodos para gestionar la cuenta del cliente.
    */

    public function checkUser($username, $password)
    {
        $sql = 'SELECT id_cliente, correo_cliente, clave_cliente, estado_cliente
                FROM clientes
                WHERE correo_cliente = ?';
        $params = array($username);
        if (!($data = Database::getRow($sql, $params))) {
            return false;
        } else if (password_verify($password, $data['clave_cliente'])) {
            $this->id = $data['id_cliente'];
            $this->correo = $data['correo_cliente'];
            $this->estado = $data['estado_cliente'];
            return true;
        } else {
            return false;
        }
    }

    public function checkStatus()
    {
        if ($this->estado) {
            $_SESSION['idCliente'] = $this->id;
            $_SESSION['correoCliente'] = $this->correo;
            return true;
        } else {
            return false;
        }
    }

    public function checkPassword($password)
    {
        $sql = 'SELECT clave_cliente
                FROM clientes
                WHERE id_cliente = ?';
        $params = array($_SESSION['idCliente']);
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if (password_verify($password, $data['clave_cliente'])) {
            return true;
        } else {
            return false;
        }
    }

    public function changePassword()
    {
        $sql = 'UPDATE clientes
                SET clave_cliente = ?
                WHERE id_cliente = ?';
        $params = array($this->clave, $_SESSION['idCliente']);
        return Database::executeRow($sql, $params);
    }

    public function readProfile()
    {
        $sql = 'SELECT id_cliente, nombre_cliente, apellido_cliente, direccion_cliente, telefono_cliente, correo_cliente, clave_cliente
                FROM clientes
                WHERE id_cliente = ?';
        $params = array($_SESSION['idCliente']);
        return Database::getRow($sql, $params);
    }
    public function editProfile()
    {
        $sql = 'UPDATE clientes
                SET nombre_cliente = ?, apellido_cliente = ?, direccion_cliente = ?, telefono_cliente = ?, correo_cliente = ?   
                WHERE id_cliente = ?';
        $params = array($this->nombre, $this->apellido, $this->direccion, $this->telefono, $this->correo, $_SESSION['idCliente']);
        return Database::executeRow($sql, $params);
    }

    public function changeStatus()
    {
        $sql = 'UPDATE clientes
                SET estado_cliente = ?
                WHERE id_cliente = ?';
        $params = array($this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_cliente, nombre_cliente, apellido_cliente, direccion_cliente, telefono_cliente, correo_cliente
                FROM clientes
                WHERE apellido_cliente LIKE ? OR nombre_cliente LIKE ? OR correo_cliente LIKE ?
                ORDER BY apellido_cliente';
        $params = array($value, $value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO clientes(nombre_cliente, apellido_cliente, direccion_cliente, telefono_cliente, correo_cliente, clave_cliente)
                VALUES(?, ?, ?, ?, ?, ?)';
        $params = array($this->nombre, $this->apellido, $this->direccion, $this->telefono, $this->correo, $this->clave);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT id_cliente, nombre_cliente, apellido_cliente, direccion_cliente, telefono_cliente, correo_cliente, estado_cliente
                FROM clientes
                ORDER BY apellido_cliente';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT id_cliente, nombre_cliente, apellido_cliente, direccion_cliente, telefono_cliente, correo_cliente, estado_cliente
                FROM clientes
                WHERE id_cliente = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE clientes
                SET nombre_cliente = ?, apellido_cliente = ?, telefono_cliente = ?, direccion_cliente = ?, correo_cliente = ?
                WHERE id_cliente = ?';
        $params = array($this->nombre, $this->apellido, $this->telefono, $this->direccion, $this->correo, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM clientes
                WHERE id_cliente = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    public function checkDuplicate($value, $idCliente = null)
    {
        if ($idCliente) {
            $sql = 'SELECT id_cliente
                FROM clientes
                WHERE correo_cliente = ? AND id_cliente != ?';
            $params = array($value, $idCliente);
        } else {
            $sql = 'SELECT id_cliente
                FROM clientes
                WHERE correo_cliente = ?';
            $params = array($value);
        }
        return Database::getRow($sql, $params);
    }

    public function readOneCorreo($correo)
    {
        $sql = 'SELECT id_cliente, nombre_cliente, apellido_cliente, direccion_cliente, telefono_cliente, correo_cliente, estado_cliente
            FROM clientes
            WHERE correo_cliente = ?';
        $params = array($correo);
        return Database::getRow($sql, $params);
    }

    //Recuperacion de contraseña 

    public function verifUs()
    {
        $sql = 'SELECT * FROM clientes 
                WHERE correo_cliente = ?';
        $params = array($this->correo);
        return Database::getRow($sql, $params);
    }


    public function verifPin()
    {
        $sql = 'SELECT * FROM clientes 
                WHERE codigo_recuperacion = ? AND id_cliente = ?';
        $params = array($this->pin, $_SESSION['clienteRecup']);
        return Database::getRow($sql, $params);
    }

    // Guardar el PIN en la base de datos
    public function guardarCodigoRecuperacion($codigo)
    {
        error_log('Correo en guardarCodigoRecuperacion: ' . $this->correo); // Registro de depuración
        error_log('Código en guardarCodigoRecuperacion: ' . $codigo); // Registro de depuración

        $sql = 'UPDATE clientes 
            SET codigo_recuperacion = ? 
            WHERE correo_cliente = ?';
        $params = array($codigo, $this->correo);
        return Database::executeRow($sql, $params);
    }

    // Verificar el PIN en la base de datos
    public function verificarCodigoRecuperacion($codigo)
    {
        $sql = 'SELECT id_cliente 
            FROM clientes 
            WHERE id_cliente = ? 
            AND codigo_recuperacion = ?';
        $params = array($_SESSION['clienteRecup'], $codigo);

        // Agregar logs para depurar
        error_log("SQL: " . $sql);
        error_log("Params: " . print_r($params, true));

        $result = Database::getRow($sql, $params);

        // Log del resultado
        error_log("Resultado: " . print_r($result, true));

        return $result !== false;
    }

    public function changePasswordRecu()
    {
        $sql = 'UPDATE clientes
                SET clave_cliente = ?
                WHERE id_cliente = ?';
        $params = array($this->clave, $this->id);
        return Database::executeRow($sql, $params);
    }
}
