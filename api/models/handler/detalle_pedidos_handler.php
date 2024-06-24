<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class DetallePedidoHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $search = null;
    protected $idPedido = null;
    protected $idTalla = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $precio = null;
    protected $existencias = null;
    protected $imagen = null;
    protected $categoria = null;
    protected $estado = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/productos/';

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    public function searchRows()
    {
        $this->search = $this->search === '' ? '%%' : '%' . $this->search . '%';

        $sql = 'SELECT id_detalle,id_pedido,descripcion_producto,nombre_marca,
        precio_producto_talla,descripcion_talla,cantidad_detalle_pedido
        from prc_detalle_pedidos
        INNER JOIN prc_pedidos USING (id_pedido)
        INNER JOIN prc_producto_tallas USING (id_producto_talla)
        INNER JOIN prc_productos USING (id_producto)
        INNER JOIN ctg_marcas USING (id_marca)
        INNER JOIN ctg_tallas USING (id_talla)
        WHERE id_pedido =? AND (descripcion_producto like ? 
        OR nombre_marca like ? OR precio_producto_talla like ?)
        ORDER BY descripcion_producto';

        $params = array($this->idPedido,$this->search,$this->search,$this->search);
        return Database::getRows($sql, $params);
    }
    public function searchHistorial()
    {
        $this->search = $this->search === '' ? '%%' : '%' . $this->search . '%';

        $sql = 'SELECT id_detalle,id_pedido,descripcion_producto,nombre_marca,
        cantidad_producto,fecha_registro,imagen_producto, nombre_producto
        from detalle_pedidos
        INNER JOIN pedidos USING (id_pedido)
        INNER JOIN productos USING (id_producto)
        INNER JOIN marcas USING (id_marca)
        WHERE estado_pedido ="Finalizado" AND id_cliente= ? AND (descripcion_producto like ?
        OR nombre_marca like ?)
        ORDER BY descripcion_producto';

        $params = array($_SESSION['idCliente'],$this->search,$this->search);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO prc_producto_tallas(id_talla, id_producto, stock_producto_talla, precio_producto_talla)
                VALUES(?, ?, ?, ?)';
        $params = array($this->idTalla, $this->idPedido, $this->existencias, $this->precio);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'select mt.id_producto_talla,mt.id_talla,mt.id_producto,mt.stock_producto_talla,
        mt.precio_producto_talla,t.descripcion_talla as talla
        from prc_producto_tallas mt 
        INNER JOIN ctg_tallas t USING(id_talla)
        INNER JOIN prc_productos m USING(id_producto)
        WHERE mt.id_producto = ?
        ORDER BY t.descripcion_talla';
        //echo $this->idproducto. ' que';
        $params = array($this->idPedido);
        
        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql ='select mt.id_producto_talla,mt.id_talla,mt.id_producto,mt.stock_producto_talla,
        mt.precio_producto_talla,t.descripcion_talla as talla
        from prc_producto_tallas mt 
        INNER JOIN ctg_tallas t USING(id_talla)
        INNER JOIN prc_productos m USING(id_producto)
        WHERE mt.id_producto_talla =?
        ORDER BY t.descripcion_talla ';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readFilename()
    {
        $sql = 'SELECT foto
                FROM prc_productos
                WHERE id_producto = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE prc_producto 
                SET foto = ?, descripcion = ?,estado = ?, id_marca = ?
                WHERE id_producto = ?';
        $params = array($this->imagen, $this->nombre,$this->estado, $this->categoria, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM prc_productos
                WHERE id_producto = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    public function readProductosCategoria()
    {
        $sql = 'SELECT mo.id_producto, mo.descripcion,mo.foto, mo.estado,ma.descripcion as marca
        FROM prc_productos mo
        INNER JOIN ctg_marcas ma USING(id_marca)
        WHERE mo.id_marca LIKE ? OR estado="A"
        ORDER BY mo.descripcion';
        /*'SELECT id_producto, imagen_producto, nombre_producto, descripcion_producto, precio_producto, existencias_producto
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                WHERE id_categoria = ? AND estado_producto = true
                ORDER BY nombre_producto'*/;
        $params = array($this->categoria);
        return Database::getRows($sql, $params);
    }

    /*
    *   Métodos para generar gráficos.
    */
    public function cantidadProductosCategoria()
    {
        $sql = 'SELECT nombre_categoria, COUNT(id_producto) cantidad
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                GROUP BY nombre_categoria ORDER BY cantidad DESC LIMIT 5';
        return Database::getRows($sql);
    }

    public function porcentajeProductosCategoria()
    {
        $sql = 'SELECT nombre_categoria, ROUND((COUNT(id_producto) * 100.0 / (SELECT COUNT(id_producto) FROM producto)), 2) porcentaje
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                GROUP BY nombre_categoria ORDER BY porcentaje DESC';
        return Database::getRows($sql);
    }

    /*
    *   Métodos para generar reportes.
    */
    public function productosCategoria()
    {
        $sql = 'SELECT nombre_producto, precio_producto, estado_producto
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                WHERE id_categoria = ?
                ORDER BY nombre_producto';
        $params = array($this->categoria);
        return Database::getRows($sql, $params);
    }
}
