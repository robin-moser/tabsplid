<!-- ![Tabsplid Logo](frontend/public/tabsplid.svg) -->
<p>
    <img src="frontend/public/tabsplid.svg" width="250">
</p>

A modern, open-source expense splitting application that helps groups track shared expenses
and automatically calculates who owes what to whom. Perfect for roommates, festivals, holidays,
dinner parties, and any shared expenses.

## Live Application

**Use it now at [tabsplid.com](https://tabsplid.com)** - completely free, no ads, no registration required!

Try the demo at [tabsplid.com/demo](https://tabsplid.com/demo) to see how it works.

<img width="960" alt="" src="https://github.com/user-attachments/assets/bf1faaf6-c1b3-4be6-ab6a-9bcb647e5a92" />

## Features

- **Smart payment calculation**: Automatically calculates the most efficient way to settle debts
- **Flexible expense splitting**: Split expenses equally or among selected members
- **Real-time updates**: Changes are reflected immediately in the calculation
- **No registration required**: Create projects instantly without accounts and just send the generated
  link for your friends to collaborate

## Code Structure

### Backend

- **Framework**: FastAPI with Python
- **Database**: SQLModel for ORM
- **Migrations**: Alembic for database schema management

### Frontend

- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and builds
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router for navigation
- **Styling**: Tailwind CSS

## API Specification

The automatically generated REST API specification is available
at [tabsplid.com/docs](https://tabsplid.com/docs).

Rate limiting is applied to all endpoints to prevent abuse.

## Deployment

### Docker Compose (Recommended)

1. **Get the docker-compose.yml file** from
    [tabplid/docker-compose.yml](https://raw.githubusercontent.com/robin-moser/tabsplid/main/docker-compose.yml):

    ```bash
    curl -o compose.yml https://raw.githubusercontent.com/robin-moser/tabsplid/main/docker-compose.yml
    ```

2. **Edit the environment variables** in `docker-compose.yml` as needed.
   It's recommended to change the Mariadb passwords and to use a
   reverse proxy like Nginx or Traefik for public accessable deployments.

3. **Start with Docker Compose**:

    ```bash
    docker-compose up -d
    ```

4. **Access the application**:
    - Frontend: <http://localhost:3000>
    - API docs: <http://localhost:8000/docs>

### Development Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/robin-moser/tabsplid.git
    cd tabsplid
    ```

2. **Configure environment**:

    Optional: Edit the `frontend/.env` and `backend/.env` files
    to set custom environment variables like API URL, database connection, etc.

3. **Start the backend**:

    For local development, the application uses SQLite by default
    (no separate database setup required):

    ```bash
    cd backend
    poetry install
    poetry run uvicorn app.main:app --reload --port 8000
    # This creates a database.db file automatically
    ```

4. **Start the frontend**:

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## Contributing

### Translations

To add a new language:

1. Create new locale files in `frontend/public/locales/{language-code}/`
2. Copy the structure from existing locale files (`en`, `de`, `es`)
3. Add the language to the dropdown in `LanguageDropdown.tsx`
