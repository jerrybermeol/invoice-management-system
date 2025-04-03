# invoice-management-system
Prueba técnica para desarrollo . Sistema de ingreso y gestión de facturas usando Angular, .NET y SQL-Jbermeo

# Sistema de Gestión de Facturas - Simple Invoice App

Este proyecto es una solución desarrollada como parte de una prueba técnica para un puesto de desarrollador. La aplicación permite el ingreso, gestión y visualización de facturas, productos, clientes y usuarios (vendedores).

## 🚀 Tecnologías utilizadas

- **Frontend:** Angular v19 (SPA)
- **Backend:** C#.NET 8 (API REST)
- **Base de Datos:** SQLite / SQL Server / InMemory
- **Control de versiones:** Git + GitHub

## 📁 Estructura del repositorio
simple-invoice-app/ │ ├── frontend/ # Aplicación Angular │ └── (código Angular) │ ├── backend/ # API C# .NET 6 │ └── (código C#) │ ├── docs/ # Documentación del proyecto │ └── modelo-er.pdf │ └── README.md # Este archivo

##  Funcionalidades principales

###  Gestión de entidades:

- CRUD completo de:
  - Productos
  - Clientes
  - Usuarios (vendedores)

###  Facturación:

- Creación de facturas con:
  - Múltiples productos (detalle)
  - Múltiples formas de pago (efectivo, tarjeta, etc.)
- Cálculo automático de subtotales
- Validaciones de formulario (Reactivo)
- Selección dinámica de cliente, usuario y productos desde la base de datos
- Alerta de éxito/error al guardar o editar

###  Filtros y búsqueda:

- Filtro combinado por:
  - Número de factura
  - Cliente
  - Fecha (en formato corto)
  - Monto total

###  Otras funcionalidades:

- Estilos responsive con TailwindCSS
- Alertas visuales personalizadas (`AlertaUtil`)
- Carga automática de datos tras cada acción
- Código organizado en servicios y componentes reutilizables

---

##  Cómo ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/simple-invoice-app.git
cd simple-invoice-app

Ejecutar el backend (.NET 8 API)
cd backend/
dotnet restore
dotnet ef database update  # Asegúrate de tener Entity Framework CLI
dotnet run
La API estará disponible en: https://localhost:7230/api


Ejecutar el frontend (Angular)
cd frontend/
npm install
ng serve
La app estará disponible en: http://localhost:4200

## Autor

Joel Jerry Bermeo Lopez.
