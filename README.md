# React + Vite

# Task Management Application - React + Vite

Este proyecto es una aplicación de gestión de tareas desarrollada en React utilizando Vite como build tool. La aplicación permite filtrar tareas por estado (todas, pendientes, completadas) y está configurada para facilitar la integración con un backend.

## 🚀 Instrucciones para ejecutar el proyecto

### 1. Clonar el repositorio
Primero, clona este repositorio en tu máquina local:

```bash
git clone https://github.com/ManuelRoperoM/Front-Task.git
cd front-task
```

### 2. Instalar dependencias
Asegúrate de que tienes instalado Node.js (versión 20 o superior recomendada). Luego, instala las dependencias del proyecto ejecutando:

```bash
npm install
```

### 3. Configurar el entorno

Crea un archivo .env en la raíz del proyecto con las variables de entorno necesarias. Por ejemplo:
VITE_ENDPOINT_BACKEND=http://localhost:3000

### 4. Ejecutar el proyecto

Para iniciar el servidor de desarrollo, usa el siguiente comando:

```bash
npm run dev
```
### 5. Compilar para producción

Si deseas generar una versión optimizada para producción, usa:

```bash
npm run build
```

## 🧪 Usuario y contraseña para evaluadores

Para acceder a la aplicación como evaluador, utiliza las siguientes credenciales:

Usuario: Administrador
Contraseña: admin123
Por favor, recuerda que estas credenciales son solo para propósitos de prueba y no deben usarse en entornos de producción.

## 📚 Dependencias principales

Este proyecto utiliza las siguientes tecnologías y herramientas:

React: Biblioteca para crear interfaces de usuario.
Vite: Herramienta rápida para desarrollo y compilación.
Axios: Cliente HTTP para realizar peticiones al backend.
ESLint: Herramienta de análisis estático para mantener un código limpio y consistente.

## 📂 Estructura del proyecto

src/
├── components/    # Componentes reutilizables de React
        ├──tasksComponents # Componentes creados para Tasks
        ├──ui #Componentes de Chakra UI
├── App.jsx        # Componente principal de la aplicación
├── main.jsx       # Punto de entrada de la aplicación

