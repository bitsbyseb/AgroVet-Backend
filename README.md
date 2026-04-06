# Sistema Integral de Gestión Animal

## 1. Descripción General del Proyecto

El Sistema Integral de Gestión Animal es una plataforma web diseñada para gestionar información veterinaria y productiva de animales urbanos y rurales, incluyendo bovinos, caprinos, equinos, avícolas y mascotas. El sistema permite registrar animales, propietarios, historial médico, vacunación, alimentación, reproducción y datos productivos.

El proyecto está desarrollado bajo una arquitectura hexagonal, lo que permite una separación clara entre la lógica de negocio, la infraestructura y la interfaz, facilitando el mantenimiento y la escalabilidad del sistema.


## 2. Requisitos de Instalación

Para ejecutar el proyecto correctamente, se deben cumplir los siguientes requisitos:

* Node.js (versión 18 o superior)
* MySQL Server
* Gestor de paquetes npm
* Navegador web moderno (Chrome, Edge, Firefox)


## 3. Dependencias

El backend del sistema utiliza las siguientes dependencias principales:

* hono: Framework para manejo de rutas HTTP
* sequelize: Conexión a base de datos


Para instalar las dependencias, ejecutar:
_________________
npm install
------------------------------


## 4. Variables de Entorno

El sistema requiere un archivo `.env` con la siguiente configuración:

```
DATABASE_PASSWORD="<your password goes here>"
DATABASE_USERNAME="<your username goes here>"
DATABASE_NAME="agrovet"
JWT_SECRET="your secret"
PORT=1234
```

Estas variables permiten configurar la conexión a la base de datos y el puerto del servidor.



## 5. Instrucciones de Ejecución

Para ejecutar el proyecto en entorno local:

1. Clonar el repositorio
2. Instalar dependencias con `npm install`
3. Configurar el archivo `.env`
4. Ejecutar el servidor con:

_______________
npm run dev
--------------------------

El sistema estará disponible en:

_______________________
http://localhost:3000/api/v1
----------------------------------------



## 6. Instrucciones para Pruebas

Las pruebas del sistema pueden realizarse mediante herramientas como Postman o Thunder Client.

Pasos básicos:

1. Iniciar el servidor
2. Realizar solicitudes HTTP a los endpoints definidos (GET, POST, PUT, DELETE)
3. Verificar respuestas del sistema

Ejemplo:

```
GET /animals
POST /animals
```



## 7. Estructura del Proyecto

El proyecto está organizado bajo una arquitectura hexagonal con la siguiente estructura:

```
src
 ├── application
 │   └── use-cases
 │       ├── Alimentation
 │       ├── Animal
 │       ├── Appointment
 │       ├── Auth
 │       ├── Food
 │       ├── MedicalHistory
 │       ├── Owner
 │       ├── Production
 │       ├── Reproduction
 │       └── Vaccination
 │
 ├── domain
 │   ├── entities
 │   ├── repositories
 │   └── services
 │
 ├── infrastructure
 │   ├── config
 │   ├── database
 │   │   ├── config
 │   │   ├── models
 │   │   └── repositories
 │   ├── http
 │   │   └── hono
 │   │       ├── controllers
 │   │       ├── routers
 │   │       └── validators
 │   └── security
```

### Descripción de carpetas:

* **application:** Contiene los casos de uso del sistema, donde se implementa la lógica de aplicación.
* **domain:** Representa el núcleo del sistema con entidades, interfaces de repositorios y lógica de negocio.
* **infrastructure:** Incluye la implementación técnica como base de datos, controladores HTTP, configuración y seguridad.



## 8. Notas Finales

El sistema sigue una arquitectura modular que facilita su crecimiento y mantenimiento. La separación de capas permite modificar tecnologías sin afectar la lógica principal del sistema.

Este proyecto está diseñado con fines académicos, pero sigue buenas prácticas de desarrollo de software aplicables en entornos reales.
