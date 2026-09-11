# Sistema de Requisiciones Administrativas

Sistema web integral para la gestión, aprobación y seguimiento de requisiciones administrativas con control de acceso basado en roles (RBAC) y un tablero dinámico de métricas.

## tecnologías Utilizadas

* **Backend:** ASP.NET Core 10 Web API, Entity Framework Core 10, JWT Authentication, BCrypt.Net.
* **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Zustand.
* **Base de Datos:** PostgreSQL 16.
* **Infraestructura:** Docker & Docker Compose.

---

## Credenciales de Prueba

Al iniciar el sistema por primera vez, la base de datos se siembra automáticamente con las siguientes cuentas:

| Rol | Usuario | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin1` | `123456` | Ver todas las requisiciones, aprobar y rechazar con comentarios. |
| **Empleado** | `empleado1` | `123456` | Crear solicitudes y consultar únicamente su historial propio. |

---

## onfiguración del Entorno (.env)

1. En la raíz del proyecto, crea una copia del archivo `.env.example` y renómbralo a `.env`:
   ```bash
   cp .env.example .env