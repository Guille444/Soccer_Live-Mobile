<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/categorias_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla CATEGORIA.
 */
class CategoriaData extends CategoriaHandler
{
    /*
     *  Atributos adicionales.
     */
    private $data_error = null;
    private $filename = null;

    /*
     *  Métodos para validar y establecer los datos.
     */

         // Método para establecer el ID de la categoría, validando que sea un número natural.
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la categoría es incorrecto';
            return false;
        }
    }
        // Método para establecer el nombre de la categoría, con validaciones de duplicados, formato alfanumérico y longitud.
    public function setNombre($value, $min = 2, $max = 50)
    {
        // Primero, verificar si el nombre ya existe
        if ($this->checkDuplicate($value)) {
            $this->data_error = 'El nombre de la categoría ingresada ya existe';
            return false;
        }
        // Validar que el nombre sea alfanumérico
        elseif (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El nombre debe ser un valor alfanumérico';
            return false;
        }
        // Validar la longitud del nombre
        elseif (!Validator::validateLength($value, $min, $max)) {
            $this->data_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
        // Si pasa todas las validaciones, asignar el valor
        else {
            $this->nombre = $value;
            return true;
        }
    }

        // Método para establecer la imagen de la categoría, validando el archivo y asignando un nombre.
    public function setImagen($file, $filename = null)
    {
            // Validar que el archivo de imagen sea válido y no exceda el tamaño máximo
        if (Validator::validateImageFile($file, 100)) {
            $this->imagen = Validator::getFilename();
            return true;
        } elseif (Validator::getFileError()) {
            $this->data_error = Validator::getFileError();
            return false;
        } elseif ($filename) {
            $this->imagen = $filename;
            return true;
        } else {
            $this->imagen = 'default.png';
            return true;
        }
    }

        // Método para establecer la descripción de la categoría, con validaciones de caracteres y longitud.
    public function setDescripcion($value, $min = 2, $max = 250)
    {
        if (!$value) {
            return true;
        } elseif (!Validator::validateString($value)) {
            $this->data_error = 'La descripción contiene caracteres prohibidos';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->descripcion = $value;
            return true;
        } else {
            $this->data_error = 'La descripción debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

        // Método para recuperar y establecer el nombre del archivo de imagen de la categoría.
    public function setFilename()
    {
        if ($data = $this->readFilename()) {
            $this->filename = $data['imagen_categoria'];
            return true;
        } else {
            $this->data_error = 'Categoría inexistente';
            return false;
        }
    }

    /*
     *  Métodos para obtener los atributos adicionales.
     */
    public function getDataError()
    {
        return $this->data_error;
    }
    // Método para obtener el nombre del archivo de imagen asociado a la categoría.
    public function getFilename()
    {
        return $this->filename;
    }
}
