DROP DATABASE IF EXISTS db_soccer_live;

CREATE DATABASE db_soccer_live;

USE db_soccer_live;

CREATE TABLE empleados(
id_empleado INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
nombre_empleado VARCHAR(50) NOT NULL,
apellido_empleado VARCHAR(50) NOT NULL,
telefono_empleado VARCHAR(9) NOT NULL,
dui_empleado VARCHAR(10) NOT NULL,
correo_empleado VARCHAR(100) NOT NULL,
clave_empleado VARCHAR(64) NOT NULL
);

DESCRIBE empleados;

ALTER TABLE empleados
ADD CONSTRAINT chk_telefono_empleado CHECK (telefono_empleado REGEXP '^[0-9]{4}-[0-9]{4}$');

ALTER TABLE empleados
ADD CONSTRAINT chk_correo_empleado CHECK (correo_empleado REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

CREATE TABLE categorias(
id_categoria INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
nombre_categoria VARCHAR(50) NOT NULL,
descripcion_categoria VARCHAR(150) NOT NULL,
imagen_categoria VARCHAR(25) NOT NULL
);

DESCRIBE categorias;

CREATE TABLE marcas(
id_marca INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
nombre_marca VARCHAR(50) NOT NULL,
correo_marca VARCHAR(100) NOT NULL,
imagen_marca VARCHAR(25) NOT NULL
);

DESCRIBE marcas;

ALTER TABLE marcas
ADD CONSTRAINT chk_correo_marca CHECK (correo_marca REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

CREATE TABLE productos(
id_producto INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
nombre_producto VARCHAR(50) NOT NULL,
descripcion_producto VARCHAR(150),
precio_producto NUMERIC(5,2) NOT NULL,
existencias_producto INT UNSIGNED NOT NULL,
imagen_producto VARCHAR(25) NOT NULL,
estado_producto BOOLEAN NOT NULL,
id_categoria INT NOT NULL,
CONSTRAINT fk_producto_categoria
FOREIGN KEY (id_categoria)
REFERENCES categorias (id_categoria),
id_marca INT NOT NULL,
CONSTRAINT fk_producto_marca
FOREIGN KEY (id_marca)
REFERENCES marcas (id_marca),
id_empleado INT NOT NULL,
CONSTRAINT fk_producto_empleado
FOREIGN KEY (id_empleado)
REFERENCES empleados (id_empleado)
);

DESCRIBE productos;

ALTER TABLE productos
ADD CONSTRAINT chk_precio_positivo CHECK (precio_producto > 0);

CREATE TABLE clientes(
id_cliente INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
nombre_cliente VARCHAR(50) NOT NULL,
apellido_cliente VARCHAR(50) NOT NULL,
direccion_cliente VARCHAR(250) NOT NULL,
telefono_cliente VARCHAR(10) NOT NULL,
correo_cliente VARCHAR(100) NOT NULL,
clave_cliente VARCHAR(64) NOT NULL,
estado_cliente BOOLEAN NOT NULL,
codigo_recuperacion VARCHAR(6) NOT NULL
);

DESCRIBE clientes;

ALTER TABLE clientes
ADD CONSTRAINT chk_telefono_cliente CHECK (telefono_cliente REGEXP '^[0-9]{4}-[0-9]{4}$');

ALTER TABLE clientes
ADD CONSTRAINT chk_correo_cliente CHECK (correo_cliente REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

ALTER TABLE clientes
ALTER COLUMN estado_cliente SET DEFAULT 1;

CREATE TABLE pedidos(
id_pedido INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
direccion_pedido VARCHAR(250) NOT NULL,
estado_pedido ENUM('Pendiente','Finalizado','Entregado') NOT NULL,
fecha_registro DATE DEFAULT current_timestamp(),
id_cliente INT NOT NULL,
CONSTRAINT fk_pedido_cliente
FOREIGN KEY (id_cliente)
REFERENCES clientes (id_cliente)
);

DESCRIBE pedidos;

CREATE TABLE detalle_pedidos(
id_detalle INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
id_producto INT NOT NULL,
CONSTRAINT fk_detalle_producto
FOREIGN KEY (id_producto)
REFERENCES productos (id_producto),
cantidad_producto INT UNSIGNED NOT NULL,
precio_producto DECIMAL(5,2) NOT NULL,
id_pedido INT NOT NULL,
CONSTRAINT fk_detalle_pedido
FOREIGN KEY (id_pedido)
REFERENCES pedidos (id_pedido)
);

DESCRIBE detalle_pedidos;

ALTER TABLE detalle_pedidos
ADD CONSTRAINT chk_cantidad_positiva CHECK (cantidad_producto >= 0);

ALTER TABLE detalle_pedidos
ADD CONSTRAINT chk_precio_unitario_positivo CHECK (precio_producto > 0);

CREATE TABLE comentarios(
id_comentario INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
contenido_comentario VARCHAR(250) NOT NULL,
puntuacion_comentario INT UNSIGNED NOT NULL,
fecha_comentario DATE DEFAULT current_timestamp(),
estado_comentario BOOLEAN NOT NULL,
id_detalle INT NOT NULL,
CONSTRAINT fk_comentario_detalle
FOREIGN KEY (id_detalle)
REFERENCES detalle_pedidos (id_detalle)
);
        
DESCRIBE comentarios;

SELECT * FROM clientes;