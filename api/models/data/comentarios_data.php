<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/comentarios_handler.php');
/*
 *	Clase para manejar el encapsulamiento de los datos de la tabla PRODUCTO.
 *  Esta clase extiende de ComentarioHandler y añade validaciones y métodos específicos
 *  para manejar los datos relacionados con comentarios de productos.
 */
class ComentarioData extends ComentarioHandler
{
    /*
     *  Atributos adicionales que no están presentes en la clase padre.
     */
    private $data_error = null;  // Almacena mensajes de error cuando una validación falla.
    private $filename = null; // Almacena el nombre del archivo de imagen.

    /*
     *   Métodos para validar y establecer los datos. Estos métodos aseguran
     *   que los datos cumplen con ciertos criterios antes de ser almacenados.
     */

    // Método para establecer el ID, asegurando que es un número natural.
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) { // Verifica si el valor es un número natural.
            $this->id = $value;  // Si es válido, lo asigna al atributo id.
            return true;
        } else {
            $this->data_error = 'El identificador es incorrecto';   // Si no es válido, guarda un mensaje de error.
            return false;
        }
    }

    // Método para establecer el ID del producto, asegurando que es un número natural.
    public function setIdProducto($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idProducto = $value;
            return true;
        } else {
            $this->data_error = 'El identificador 1 es incorrecto';
            return false;
        }
    }

    // Método para establecer el ID de detalle, asegurando que es un número natural.
    public function setIdDetalle($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idDetalle = $value;
            return true;
        } else {
            $this->data_error = 'El identificador 2 es incorrecto';
            return false;
        }
    }

    // Método para establecer la puntuación, asegurando que es un número natural.
    public function setPuntuacion($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->puntuacion = $value;
            return true;
        } else {
            $this->data_error = 'El identificador 2 es incorrecto';
            return false;
        }
    }

    // Método para establecer el nombre, asegurando que es alfanumérico y dentro del rango de longitud permitido.
    public function setNombre($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphanumeric($value)) { // Verifica si el valor es alfanumérico.
            $this->data_error = 'El nombre debe ser un valor alfanumérico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {  // Verifica si el valor está dentro del rango de longitud permitido.
            $this->nombre = $value;
            return true;
        } else {
            $this->data_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Método para establecer el mensaje, asegurando que es una cadena válida y dentro del rango de longitud permitido.
    public function setMensaje($value, $min = 2, $max = 250)
    {
        if (!Validator::validateString($value)) { // Verifica si la cadena contiene caracteres permitidos.
            $this->data_error = 'El mensaje contiene caracteres prohibidos';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {  // Verifica si la longitud de la cadena está dentro del rango permitido
            $this->mensaje = $value;
            return true;
        } else {
            $this->data_error = 'El mensaje debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Método para establecer el precio, asegurando que es un valor numérico válido.
    public function setPrecio($value)
    {
        if (Validator::validateMoney($value)) { // Verifica si el valor es un número válido para precios.
            $this->precio = $value;
            return true;
        } else {
            $this->data_error = 'El precio debe ser un valor numérico';
            return false;
        }
    }

    // Método para establecer el número de existencias, asegurando que es un número natural.
    public function setExistencias($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->existencias = $value;
            return true;
        } else {
            $this->data_error = 'El valor de las existencias debe ser numérico entero';
            return false;
        }
    }

    // Método para establecer la imagen, validando el archivo subido.
    public function setImagen($file, $filename = null)
    {
        if (Validator::validateImageFile($file, 500, 500)) { // Valida si el archivo es una imagen y cumple con las dimensiones requeridas.
            $this->imagen = Validator::getFileName(); // Si es válido, asigna el nombre del archivo.
            return true;
        } elseif (Validator::getFileError()) { // Verifica si hubo un error en la validación del archivo.
            return false;
        } elseif ($filename) { // Si se proporciona un nombre de archivo por defecto. 
            $this->imagen = $filename;
            return true;
        } else {
            $this->imagen = 'default.png';  // Si no se proporciona un archivo, se asigna una imagen por defecto.
            return true;
        }
    }

    // Método para establecer la categoría, asegurando que es un número natural.
    public function setCategoria($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->categoria = $value;
            return true;
        } else {
            $this->data_error = 'El identificador es incorrecto';
            return false;
        }
    }

    // Método para establecer el estado, asegurando que es un valor booleano.
    public function setEstado($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->estado = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }

    // Método para establecer un valor de búsqueda.
    public function setSearch($value)
    {
        $this->search = $value;
        return true;
    }

    // Método para establecer el nombre de archivo a partir de la base de datos o un valor por defecto.
    public function setFilename()
    {
        if ($data = $this->readFilename()) { // Intenta leer el nombre del archivo de la base de datos.
            $this->filename = $data['imagen_producto'];
            return true;
        } else {
            $this->data_error = 'Producto inexistente'; // Si no se encuentra el producto, guarda un mensaje de error.
            return false;
        }
    }

    /*
     *  Métodos para obtener los atributos adicionales.
     */

    // Método para obtener el mensaje de error almacenado.
    public function getDataError()
    {
        return $this->data_error;
    }


    // Método para obtener el nombre del archivo de imagen almacenado.
    public function getFilename()
    {
        return $this->filename;
    }
}