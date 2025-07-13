Instalación:

1. Base de Datos:
   * Descarga el archivo sql que se encuentra en la carpeta "Base de Datos"
   * Entra a pgAdmin de PostgreSQL
   * Crea una base de datos con el mismo nombre que el archivo sql descargado
   * Dale click derecho a la base de datos y da click en "Restore"
   * en "Filename" elige el archivo sql que descargaste y dale click en "Restore"
2. Frontend:
   * Ejecuta el comando "cd frontend-bookrecommendations"
   * Ejecuta el comando "npm install"
3. Backend:
   * Ejecuta el comando "pip install -r requirements.txt"

Ejecución:

1. Frontend:
   * Ejecuta el comando "npm run dev"
2. Backend:
   * Ejecuta el comando "uvicorn main:app --reload"
