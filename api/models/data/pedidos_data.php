<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/pedidos_handler.php');
/*
*	Clase para manejar el encapsulamiento de los datos de las tablas PEDIDO y DETALLE_PEDIDO.
*/
class PedidoData extends PedidoHandler
{
    // Atributo genérico para manejo de errores.
    protected $data_error = null;

    /*
    *   Métodos para validar y establecer los datos.
    */

        // Método para validar y establecer el ID del pedido.
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del pedido es incorrecto';
            return false;
        }
    }

        // Método para validar y establecer el ID del pedido.
    public function setIdPedido($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_pedido = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del pedido es incorrecto';
            return false;
        }
    }

        // Método para validar y establecer el ID del detalle del pedido.
    public function setIdDetalle($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_detalle = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del detalle pedido es incorrecto';
            return false;
        }
    }

        // Método para validar y establecer el ID del cliente.
    public function setCliente($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->cliente = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del cliente es incorrecto';
            return false;
        }
    }

        // Método para validar y establecer el ID del producto.
    public function setProducto($producto)
    {
        if (is_numeric($producto) && $producto > 0) {
            $this->producto = $producto;
            return true;
        } else {
            $this->data_error = 'ID de producto inválido';
            error_log('Error en setProducto: ' . $this->data_error);
            return false;
        }
    }

        // Método para validar y establecer la cantidad del producto en el pedido.
    public function setCantidad($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->cantidad = $value;
            return true;
        } else {
            $this->data_error = 'La cantidad del producto debe ser mayor o igual a 1';
            return false;
        }
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }

        // Método para validar y establecer el estado del pedido.
    public function setEstado($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphabetic($value)) {  // Verifica que el estado sea un valor alfabético.
            $this->data_error = 'El estado debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {  // Verifica que la longitud del estado sea válida.
            $this->estado = $value;
            return true;
        } else {
            $this->data_error = 'El estado debe tener una longitud entre ' . $min . ' y ' . $max; // Mensaje de error si la longitud no es válida.
            return false;
        }
    }
}
