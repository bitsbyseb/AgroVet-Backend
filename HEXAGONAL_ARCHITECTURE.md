# Hexagonal Architecture Guide (AgroVet Backend)

This document explains the "Ports and Adapters" (Hexagonal) architecture applied to this project. 

## The Core Concept: The Brain vs. The Tools
Think of your application as a **Brain** (Business Logic) that is protected from the **Tools** (Database, Frameworks, External APIs). 

If you decide to change your database (e.g., from MySQL to MongoDB) or your web framework (e.g., from Hono to Express), you only change the **Tools** in the "Infrastructure" layer. The **Brain** (Domain and Application layers) stays exactly the same.

---

## 📂 Directory Structure Explained

### 1. `src/domain` (The "Heart" or "Brain")
This is the most important folder. It contains the rules of your business. It **must not** depend on any external libraries (no Sequelize, no Hono).
*   **`entities/`**: Core objects (e.g., `User.ts`). They represent "what a User is" in your system.
*   **`repositories/`**: These are **Interfaces** (contracts). They define *what* we need to do with data (e.g., `findByEmail`), but they don't say *how* to do it.
*   **`services/`**: Interfaces for tools we need, like `PasswordHasher`. The domain knows it needs to hash passwords, but it doesn't care if you use Bcrypt or something else.

### 2. `src/application` (The "Orchestrator")
This folder handles the "Jobs" or "Tasks" of your app.
*   **`use-cases/`**: Specific actions a user can perform (e.g., `LoginUserUseCase.ts`). 
    *   **Purpose**: A Use Case takes the "Tools" (Repositories/Services) and coordinates them to finish a task.
    *   **Logic**: It asks the repository for data, applies business rules, and saves the result.

### 3. `src/infrastructure` (The "Tools" or "Adapters")
This is where we use external libraries. It "adapts" the external world to our Domain.
*   **`database/`**: 
    *   **`models/`**: Actual Sequelize models tied to your database tables.
    *   **`repositories/`**: The **Implementation**. This is where the actual SQL queries happen (e.g., `SequelizeUserRepository.ts`). This "plugs into" the interface defined in the Domain.
*   **`http/hono/`**: Everything related to the web server.
    *   **`controllers/`**: They receive the web request, extract data, and hand it to a **Use Case**.
    *   **`routers/`**: The URL paths/endpoints.
    *   **`validators/`**: Zod schemas to ensure incoming user data is correct.
*   **`security/`**: Concrete tools like `BcryptHasher.ts` and `HonoTokenService.ts`.

---

## 🗺️ Roadmap: What to do next?

Follow this path to continue building your project:

### Step 1: Complete the "Domain" for other entities
Currently, only `User` is fully mapped.
*   Create files in `src/domain/entities/` for `Animal`, `Owner`, `Appointment`, etc.
*   Create interfaces in `src/domain/repositories/` for each (e.g., `AnimalRepository.ts`).

### Step 2: Implement the "Infrastructure Repositories"
For every new interface you created in Step 1:
*   Create the Sequelize implementation in `src/infrastructure/database/repositories/` (e.g., `SequelizeAnimalRepository.ts`).
*   This is where you write the code to fetch animals from the database using Sequelize models.

### Step 3: Create "Use Cases"
Define what a user can do with the data.
*   Create `CreateAnimalUseCase.ts`, `GetAnimalHistoryUseCase.ts`, etc., in `src/application/use-cases/`.
*   These will use the repository interfaces you defined in the domain.

### Step 4: Connect the "Web Layer" (Controllers & Routers)
*   Create controllers to handle HTTP requests.
*   Create routers and link them in `src/index.ts`.

### Step 5: Unit Testing
Because the "Brain" (Use Cases) is separated from the "Database," you can now test your logic without a real database. You can create "Mock" versions of your repositories to test your code quickly and safely.

---

> **Pro-tip:** When adding a new feature, always follow this order: 
> **Domain (The Rule) ➔ Application (The Task) ➔ Infrastructure (The Tool).**
