<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/marcas_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla Marca.
 */
class MarcaData extends MarcaHandler
{
    /*
     *  Atributos adicionales.
     */
    private $data_error = null;
    private $filename = null;

    /*
     *  Métodos para validar y establecer los datos.
     */
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

    public function setNombre($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El nombre debe ser un valor alfanumérico';
            return false;
        }
        // Primero, verificar si el nombre ya existe
        elseif ($this->checkDuplicate($value)) {
            $this->data_error = 'El nombre de la marca ingresada ya existe';
            return false;
        }
        // Después, validar la longitud del nombre
        elseif (Validator::validateLength($value, $min, $max)) {
            $this->nombre = $value;
            return true;
        }
        // Si la longitud del nombre no es válida
        else {
            $this->data_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }


    public function setCorreo($value, $min = 8, $max = 100)
    {
        // Primero, verificar si el correo ya existe
        if ($this->checkDuplicate2($value)) {
            $this->data_error = 'El correo de la marca ingresado ya existe';
            return false;
        }
        // Después, validar que el correo sea válido
        elseif (!Validator::validateEmail($value)) {
            $this->data_error = 'El correo no es válido';
            return false;
        }
        // Validar la longitud del correo
        elseif (Validator::validateLength($value, $min, $max)) {
            $this->correo = $value;
            return true;
        }
        // Si la longitud del correo no es válida
        else {
            $this->data_error = 'El correo debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setImagen($file, $filename = null)
    {
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

    public function setFilename()
    {
        if ($data = $this->readFilename()) {
            $this->filename = $data['imagen_marca'];
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

    public function getFilename()
    {
        return $this->filename;
    }
}
