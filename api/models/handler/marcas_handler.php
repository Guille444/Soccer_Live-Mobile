<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla Marca.
 */
class MarcaHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $correo = null;
    protected $imagen = null;
    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/marcas/';

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_marca, nombre_marca, correo_marca, imagen_marca
                FROM marcas
                WHERE nombre_marca LIKE ? OR correo_marca LIKE ?
                ORDER BY nombre_marca';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO marcas(nombre_marca, correo_marca, imagen_marca)
                VALUES(?, ?, ?)';
        $params = array($this->nombre, $this->correo, $this->imagen);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT id_marca, nombre_marca, correo_marca, imagen_marca
                FROM marcas
                ORDER BY nombre_marca';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT id_marca, nombre_marca, correo_marca, imagen_marca
                FROM marcas
                WHERE id_marca = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readFilename()
    {
        $sql = 'SELECT imagen_marca
                FROM marcas
                WHERE id_marca = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE marcas
                SET imagen_marca = ?, nombre_marca = ?, correo_marca = ?
                WHERE id_marca = ?';
        $params = array($this->imagen, $this->nombre, $this->correo, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM marcas
                WHERE id_marca = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    public function checkDuplicate($value)
    {
        $sql = 'SELECT id_marca
                FROM marcas
                WHERE nombre_marca = ?';
        $params = array($value);
        return Database::getRow($sql, $params);
    }

    public function checkDuplicate2($value)
    {
        $sql = 'SELECT id_marca
                FROM marcas
                WHERE correo_marca = ?';
        $params = array($value);
        return Database::getRow($sql, $params);
    }
}
