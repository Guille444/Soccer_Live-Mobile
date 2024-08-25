<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de las tablas PEDIDO y DETALLE_PEDIDO.
*/
class PedidoHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $id_pedido = null;
    protected $id_detalle = null;
    protected $cliente = null;
    protected $producto = null;
    protected $cantidad = null;
    protected $estado = null;
    // Agregar a la clase PedidoHandler
    protected $data_error = null;

    /*
    *   ESTADOS DEL PEDIDO
    *   Pendiente (valor por defecto en la base de datos). Pedido en proceso y se puede modificar el detalle.
    *   Finalizado. Pedido terminado por el cliente y ya no es posible modificar el detalle.
    *   Entregado. Pedido enviado al cliente.
    *   Anulado. Pedido cancelado por el cliente después de ser finalizado.
    */

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    // Método para verificar si existe un pedido en proceso con el fin de iniciar o continuar una compra.
    public function getOrder()
    {
        $this->estado = 'Pendiente';
        $sql = 'SELECT id_pedido
                FROM pedidos
                WHERE estado_pedido = ? AND id_cliente = ?';
        $params = array($this->estado, $_SESSION['idCliente']);
        if ($data = Database::getRow($sql, $params)) {
            $_SESSION['idPedido'] = $data['id_pedido'];
            return true;
        } else {
            return false;
        }
    }

    // Método para obtener el error
    public function getDataError()
    {
        return $this->data_error;
    }

    // Método para iniciar un pedido en proceso.
    public function startOrder()
    {
        if ($this->getOrder()) {
            return true;
        } else {
            $sql = 'INSERT INTO pedidos(direccion_pedido, id_cliente)
                    VALUES((SELECT direccion_cliente FROM clientes WHERE id_cliente = ?), ?)';
            $params = array($_SESSION['idCliente'], $_SESSION['idCliente']);
            // Se obtiene el ultimo valor insertado de la llave primaria en la tabla pedido.
            if ($_SESSION['idPedido'] = Database::getLastRow($sql, $params)) {
                return true;
            } else {
                return false;
            }
        }
    }

    // Método para agregar un producto al carrito de compras.

    public function createDetail()
    {
        // Inicia la transacción
        Database::executeRow('START TRANSACTION', []);

        try {
            // Inserta en detalle_pedidos
            $sql = 'INSERT INTO detalle_pedidos (id_producto, precio_producto, cantidad_producto, id_pedido)
                VALUES (?, (SELECT precio_producto FROM productos WHERE id_producto = ?), ?, ?)';
            $params = array($this->producto, $this->producto, $this->cantidad, $_SESSION['idPedido']);
            if (!Database::executeRow($sql, $params)) {
                throw new Exception('Error al agregar detalle del pedido');
            }

            // Actualiza el stock de productos
            $sqlUpdate = 'UPDATE productos SET existencias_producto = existencias_producto - ? WHERE id_producto = ?';
            $paramsUpdate = array($this->cantidad, $this->producto);
            if (!Database::executeRow($sqlUpdate, $paramsUpdate)) {
                throw new Exception('Error al actualizar stock del producto');
            }

            // Confirma la transacción
            Database::executeRow('COMMIT', []);
            return true;
        } catch (Exception $e) {
            // Revertir la transacción en caso de error
            Database::executeRow('ROLLBACK', []);
            $this->data_error = $e->getMessage();
            return false;
        }
    }


    // Método para obtener los productos que se encuentran en el carrito de compras.
    public function readDetail()
    {
        $sql = 'SELECT detalle_pedidos.id_detalle, productos.id_producto, productos.nombre_producto, detalle_pedidos.precio_producto, detalle_pedidos.cantidad_producto
            FROM detalle_pedidos
            INNER JOIN pedidos ON detalle_pedidos.id_pedido = pedidos.id_pedido
            INNER JOIN productos ON detalle_pedidos.id_producto = productos.id_producto
            WHERE detalle_pedidos.id_pedido = ?';
        $params = array($_SESSION['idPedido']);
        return Database::getRows($sql, $params);
    }

    // Método para finalizar un pedido por parte del cliente.
    public function finishOrder()
    {
        $this->estado = 'Finalizado';
        $sql = 'UPDATE pedidos
                SET estado_pedido = ?
                WHERE id_pedido = ?';
        $params = array($this->estado, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }

    // Método para actualizar la cantidad de un producto agregado al carrito de compras.
    public function updateDetail()
    {
        // Paso 1: Obtener el id_producto asociado al id_detalle
        $sqlGetProductId = 'SELECT id_producto, cantidad_producto FROM detalle_pedidos WHERE id_detalle = ? AND id_pedido = ?';
        $paramsGetProductId = array($this->id_detalle, $_SESSION['idPedido']);
        $row = Database::getRow($sqlGetProductId, $paramsGetProductId);

        if (!$row) {
            $this->data_error = 'Detalle de pedido no encontrado';
            return false;
        }

        $id_producto = $row['id_producto'];
        $cantidad_anterior = $row['cantidad_producto'];

        // Paso 3: Verificar el stock disponible del producto
        $sqlStock = 'SELECT existencias_producto FROM productos WHERE id_producto = ?';
        $paramsStock = array($id_producto);
        $stockRow = Database::getRow($sqlStock, $paramsStock);

        if (!$stockRow) {
            $this->data_error = 'Producto no encontrado';
            return false;
        }

        $stock = $stockRow['existencias_producto'];

        // Calcular la diferencia entre la cantidad nueva y la anterior
        $diferencia_cantidad = $this->cantidad - $cantidad_anterior;

        if ($diferencia_cantidad > $stock) {
            $this->data_error = 'Cantidad excede el stock disponible';
            return false;
        }

        // Paso 4: Actualizar la cantidad en el detalle del pedido
        $sql = 'UPDATE detalle_pedidos
        SET cantidad_producto = ?
        WHERE id_detalle = ? AND id_pedido = ?';
        $params = array($this->cantidad, $this->id_detalle, $_SESSION['idPedido']);

        $resultado = Database::executeRow($sql, $params);

        if ($resultado) {
            // Actualizar el stock disponible
            $sqlUpdateStock = 'UPDATE productos SET existencias_producto = existencias_producto - ? WHERE id_producto = ?';
            $paramsUpdateStock = array($diferencia_cantidad, $id_producto);
            Database::executeRow($sqlUpdateStock, $paramsUpdateStock);
        }

        return $resultado;
    }


    public function deleteDetail()
    {
        // Paso 1: Obtener la cantidad del producto asociado al detalle
        $sqlGetQuantity = 'SELECT cantidad_producto FROM detalle_pedidos WHERE id_detalle = ? AND id_pedido = ?';
        $paramsGetQuantity = array($this->id_detalle, $_SESSION['idPedido']);
        $row = Database::getRow($sqlGetQuantity, $paramsGetQuantity);

        if (!$row) {
            $this->data_error = 'Detalle de pedido no encontrado';
            return false;
        }

        $cantidad = $row['cantidad_producto'];

        // Paso 2: Obtener el id_producto asociado al id_detalle
        $sqlGetProductId = 'SELECT id_producto FROM detalle_pedidos WHERE id_detalle = ? AND id_pedido = ?';
        $paramsGetProductId = array($this->id_detalle, $_SESSION['idPedido']);
        $rowProduct = Database::getRow($sqlGetProductId, $paramsGetProductId);

        if (!$rowProduct) {
            $this->data_error = 'Producto no encontrado en el detalle';
            return false;
        }

        $idProducto = $rowProduct['id_producto'];

        // Paso 3: Devolver la cantidad al stock
        $sqlUpdateStock = 'UPDATE productos SET existencias_producto = existencias_producto + ? WHERE id_producto = ?';
        $paramsUpdateStock = array($cantidad, $idProducto);
        if (!Database::executeRow($sqlUpdateStock, $paramsUpdateStock)) {
            $this->data_error = 'No se pudo actualizar el stock del producto';
            return false;
        }

        // Paso 4: Eliminar el detalle del pedido
        $sqlDelete = 'DELETE FROM detalle_pedidos WHERE id_detalle = ? AND id_pedido = ?';
        $paramsDelete = array($this->id_detalle, $_SESSION['idPedido']);
        return Database::executeRow($sqlDelete, $paramsDelete);
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT p.id_pedido,CONCAT(c.nombre_cliente," ",c.apellido_cliente) as cliente,
                DATE_FORMAT(p.fecha_registro, "%d-%m-%Y") AS fecha, p.estado_pedido, p.direccion_pedido
                FROM pedidos p
                INNER JOIN clientes c USING(id_cliente)
                WHERE nombre_cliente LIKE ?
                ORDER BY direccion_pedido';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE pedidos 
                SET estado_pedido = ?
                WHERE id_pedido = ?';
        $params = array($this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT p.id_pedido,CONCAT(c.nombre_cliente," ",c.apellido_cliente) as cliente,
        DATE_FORMAT(p.fecha_registro, "%d-%m-%Y") AS fecha, p.estado_pedido, p.direccion_pedido
        FROM pedidos p
        INNER JOIN clientes c USING(id_cliente)
        ORDER BY p.fecha_registro DESC, p.estado_pedido DESC';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT p.id_pedido,CONCAT(c.nombre_cliente," ",c.apellido_cliente) as cliente,
        DATE_FORMAT(p.fecha_registro, "%d-%m-%Y") AS fecha,p.estado_pedido, p.direccion_pedido
        from pedidos p
        inner join clientes c USING(id_cliente)
        WHERE p.id_pedido = ?';
        $params = array($this->id);
        $data = Database::getRow($sql, $params);
        //$_SESSION['idmod'] = $data['id_modelo'];

        return $data;
    }

    // Método para cancelar un pedido y reponer el stock
    public function cancelOrder()
    {
        // Obtener los detalles del pedido
        $sql = 'SELECT id_producto, cantidad_producto FROM detalle_pedidos WHERE id_pedido = ?';
        $params = array($_SESSION['idPedido']);
        $details = Database::getRows($sql, $params);

        // Inicia la transacción
        Database::executeRow('START TRANSACTION', []);

        try {
            // Reponer el stock de productos
            foreach ($details as $detail) {
                $sqlUpdate = 'UPDATE productos SET existencias_producto = existencias_producto + ? WHERE id_producto = ?';
                $paramsUpdate = array($detail['cantidad_producto'], $detail['id_producto']);
                if (!Database::executeRow($sqlUpdate, $paramsUpdate)) {
                    throw new Exception('Error al reponer stock del producto');
                }
            }

            // Eliminar el pedido
            $sqlDelete = 'DELETE FROM pedidos WHERE id_pedido = ?';
            $paramsDelete = array($_SESSION['idPedido']);
            if (!Database::executeRow($sqlDelete, $paramsDelete)) {
                throw new Exception('Error al eliminar el pedido');
            }

            // Eliminar los detalles del pedido
            $sqlDeleteDetails = 'DELETE FROM detalle_pedidos WHERE id_pedido = ?';
            if (!Database::executeRow($sqlDeleteDetails, $paramsDelete)) {
                throw new Exception('Error al eliminar detalles del pedido');
            }

            // Confirmar la transacción
            Database::executeRow('COMMIT', []);
            return true;
        } catch (Exception $e) {
            // Revertir la transacción en caso de error
            Database::executeRow('ROLLBACK', []);
            $this->data_error = $e->getMessage();
            return false;
        }
    }

    public function readStock()
    {
        $sql = 'SELECT existencias_producto FROM productos WHERE id_producto = ?';
        $params = array($this->producto);
        $result = Database::getRow($sql, $params);
        error_log('Resultado de readStock: ' . print_r($result, true));
        return $result;
    }
}
