<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class ComentarioHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $search = null;
    protected $idProducto = null;
    protected $idDetalle = null;
    protected $puntuacion = null;
    protected $mensaje = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $precio = null;
    protected $existencias = null;
    protected $imagen = null;
    protected $categoria = null;
    protected $estado = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/modelos/';

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    public function searchRows()
    {
        $this->search = $this->search === '' ? '%%' : '%' . $this->search . '%';

        $sql = 'select id_comentario,id_detalle,CONCAT(nombre_cliente," ",apellido_cliente) as cliente,
        CONCAT(descripcion_marca," ",nombre_producto) as modelo,contenido_comentario,
        puntuacion_comentario,estado_comentario,
        DATE_FORMAT(cm.fecha_comentario, "%d-%m-%Y - %h:%i %p") AS fecha_comentario
        from comentarios cm
        INNER JOIN detalle_pedidos dp USING(id_detalle)
        INNER JOIN pedidos p USING(id_pedido)
        INNER JOIN clientes c USING(id_cliente)
        INNER JOIN productos mo USING (id_producto)
        INNER JOIN marcas ma USING (id_marca)
        WHERE CONCAT(nombre_cliente," ",apellido_cliente) like ? 
        OR CONCAT(descripcion_marca," ",nombre_producto) like ?
        ORDER BY fecha_comentario DESC, estado_comentario DESC';

        $params = array($this->search, $this->search);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {

        $sql = 'INSERT INTO comentarios(contenido_comentario,puntuacion_comentario,
        fecha_comentario,estado_comentario, id_detalle) VALUES(?,?,now(),true,?)';
        $params = array($this->mensaje, $this->puntuacion, $this->idDetalle,);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'select id_comentario,id_detalle,CONCAT(nombre_cliente," ",apellido_cliente) as cliente,
        CONCAT(nombre_producto) as modelo,contenido_comentario,
        puntuacion_comentario,estado_comentario,
        DATE_FORMAT(cm.fecha_comentario, "%d-%m-%Y - %h:%i %p") AS fecha_comentario
        from comentarios cm
        INNER JOIN detalle_pedidos dp USING(id_detalle)
        INNER JOIN pedidos p USING(id_pedido)
        INNER JOIN clientes c USING(id_cliente)
        INNER JOIN productos mo USING (id_producto)
        INNER JOIN marcas ma USING (id_marca)
        ORDER BY fecha_comentario DESC, estado_comentario DESC';
        return Database::getRows($sql);
    }
    public function readAllActive()
    {
        $sql = 'select id_producto,id_comentario,id_detalle,CONCAT(nombre_cliente," ",apellido_cliente) as cliente,
        CONCAT(nombre_producto) as modelo,contenido_comentario,
        puntuacion_comentario,estado_comentario,
        DATE_FORMAT(fecha_comentario, "%d-%m-%Y - %h:%i %p") AS fecha_comentario
        from comentarios 
        INNER JOIN detalle_pedidos dp USING(id_detalle)
        INNER JOIN pedidos USING(id_pedido)
        INNER JOIN clientes  USING(id_cliente)
        INNER JOIN productos USING (id_producto)
        WHERE id_producto = ? AND estado_comentario=true
        ORDER BY puntuacion_comentario DESC';
        //echo $this->idProducto. ' que';
        $params = array($this->idProducto);

        return Database::getRows($sql, $params);
    }
    public function readByIdDetalle()
    {
        $sql = 'select id_producto,id_comentario,id_detalle,CONCAT(nombre_cliente," ",apellido_cliente) as cliente,
        CONCAT(nombre_producto) as modelo,contenido_comentario,
        puntuacion_comentario,estado_comentario,
        DATE_FORMAT(fecha_comentario, "%d-%m-%Y - %h:%i %p") AS fecha_comentario
        from comentarios 
        INNER JOIN detalle_pedidos dp USING(id_detalle)
        INNER JOIN pedidos p USING(id_pedido)
        INNER JOIN clientes c USING(id_cliente)
        INNER JOIN productos mo USING (id_producto)
        INNER JOIN marcas ma USING (id_marca)
        WHERE id_detalle = ?';
        //echo $this->idProducto. ' que';
        $params = array($this->idDetalle);

        return Database::getRows($sql, $params);
    }
    public function readByIdComentario()
    {
        $sql = 'select id_producto,id_comentario,id_detalle,CONCAT(nombre_cliente," ",apellido_cliente) as cliente,
        CONCAT(nombre_marca," ",nombre_producto) as modelo,contenido_comentario,
        puntuacion_comentario,estado_comentario,
        DATE_FORMAT(fecha_comentario, "%d-%m-%Y - %h:%i %p") AS fecha_comentario
        from comentarios 
        INNER JOIN detalle_pedidos dp USING(id_detalle)
        INNER JOIN pedidos p USING(id_pedido)
        INNER JOIN clientes c USING(id_cliente)
        INNER JOIN productos mo USING (id_producto)
        INNER JOIN marcas ma USING (id_marca)
        WHERE id_comentario = ?';
        //echo $this->idProducto. ' que';
        $params = array($this->id);

        return Database::getRows($sql, $params);
    }


    public function readOne()
    {
        $sql = 'select id_comentario,id_detalle,CONCAT(nombre_cliente," ",apellido_cliente) as cliente,
        CONCAT(nombre_producto) as modelo,contenido_comentario,
        puntuacion_comentario,estado_comentario,
        DATE_FORMAT(cm.fecha_comentario, "%d-%m-%Y - %h:%i %p") AS fecha_comentario
        from comentarios cm
        INNER JOIN detalle_pedidos dp USING(id_detalle)
        INNER JOIN pedidos p USING(id_pedido)
        INNER JOIN clientes c USING(id_cliente)
        INNER JOIN productos mo USING (id_producto)
        INNER JOIN marcas ma USING (id_marca)
        WHERE id_comentario = ?
        ORDER BY fecha_comentario DESC, estado_comentario DESC';
        $params = array($this->id);
        $data = Database::getRow($sql, $params);
        //$_SESSION['idmod'] = $data['id_producto'];

        return $data;
    }

    public function readFilename()
    {
        $sql = 'SELECT foto
                FROM productos
                WHERE id_producto = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE comentarios
                SET estado_comentario = ?
                WHERE id_comentario = ?';
        $params = array($this->estado,  $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM productos
                WHERE id_producto = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    public function readProductosCategoria()
    {
        $sql = 'SELECT mo.id_producto, mo.descripcion,mo.foto, mo.estado,ma.descripcion as marca
        FROM productos mo
        INNER JOIN ctg_marcas ma USING(id_marca)
        WHERE mo.id_marca LIKE ? OR estado="A"
        ORDER BY mo.descripcion';
            /*'SELECT id_producto, imagen_producto, nombre_producto, nombre_producto, precio_producto, existencias_producto
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
