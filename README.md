# TODO API

Task management REST API built with **Express 5**, **TypeScript**, **Clean Architecture** and **Firebase Cloud Functions**.

## Installation

### Requirements

- Node.js 24+
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project with Firestore enabled

### Steps

1. Clone the repository:
```bash
git clone https://bitbucket.org/atomchat-challenge/todo-api.git
cd todo-api
```

2. Install dependencies:
```bash
yarn install
```

3. Login to Firebase:
```bash
firebase login
```

4. Initialize the project (select your existing project):
```bash
firebase init
```

5. Make sure Firestore is enabled in your Firebase project.

## Available Scripts

| Script | Description |
|--------|-------------|
| `yarn build` | Compile TypeScript |
| `yarn serve` | Local development with emulators |
| `yarn dev` | Development with watch mode |
| `yarn deploy` | Deploy to Cloud Functions |
| `yarn test` | Run tests |
| `yarn test:watch` | Tests in watch mode |
| `yarn test:coverage` | Tests with coverage report |

## Technologies

### Core

- **Express 5.2.1** - Web framework
- **TypeScript 5.3** - Static typing
- **Clean Architecture** - Layer separation (Domain, Application, Infrastructure, Presentation)

### Database

- **Firebase Admin SDK 12.7** - Firebase services
- **Cloud Firestore** - NoSQL database

### Authentication

- **JSON Web Token (JWT)** - Stateless authentication
- **reCAPTCHA v3** - Bot protection

### Validation

- **Custom DTOs** - Data Transfer Objects for input validation
- **Custom Error Handling** - Centralized error management

## Architecture

This project follows **Clean Architecture** principles and is deployed on **Firebase Cloud**.

![Architecture Diagram](docs/TaskFlow%20-%20Deployment%20Diagram.png)

```
User → Firebase Hosting (Angular SPA) → Cloud Functions (Express API) → Firestore
```

The architecture diagram source is available at `docs/architecture.puml` (PlantUML format).

## API Documentation

API request examples are available in the `docs/` folder:

| File | Description |
|------|-------------|
| `docs/Insomnia_todo_api.yaml` | Insomnia collection with all API endpoints |
| `docs/architecture.puml` | Architecture diagram (PlantUML) |

### Import to Insomnia

1. Open Insomnia
2. Go to **Application** → **Preferences** → **Data** → **Import Data**
3. Select `docs/Insomnia_todo_api.yaml`

## Project Structure

```
src/
├── domain/                    # Domain Layer (Entities and Interfaces)
│   ├── entities/
│   │   ├── Task.ts
│   │   └── User.ts
│   └── repositories/
│       ├── ITaskRepository.ts
│       └── IUserRepository.ts
│
├── application/               # Application Layer (Use Cases)
│   ├── dtos/
│   │   ├── TaskDTO.ts
│   │   └── UserDTO.ts
│   ├── errors/
│   │   └── AppError.ts
│   ├── permissions/
│   │   └── abilities.ts
│   └── use-cases/
│       ├── task/
│       └── user/
│
├── infrastructure/            # Infrastructure Layer
│   ├── database/
│   │   └── firebase.ts
│   ├── repositories/
│   │   ├── FirestoreTaskRepository.ts
│   │   └── FirestoreUserRepository.ts
│   └── services/
│       ├── JwtService.ts
│       └── RecaptchaService.ts
│
├── presentation/              # Presentation Layer (HTTP)
│   └── http/
│       ├── app.ts
│       ├── controllers/
│       ├── middleware/
│       └── routes/
│
└── index.ts                   # Entry point (Cloud Function)

tests/
├── mocks/
├── unit/
└── integration/
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
RECAPTCHA_SECRET_KEY=your-recaptcha-secret
```

### Contributing

#### Contribution Guide

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Convention (Smart Commits)

| Prefix | Description |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Code formatting |
| `refactor:` | Code refactoring |
| `test:` | Add/modify tests |
| `chore:` | Maintenance tasks |

### Code Standards

- Follow **Clean Architecture** principles
- Apply **SOLID** principles
- Use **TypeScript** strict mode
- Write **unit tests** for use cases
- Use **meaningful** variable and function names

## Tests

### Commands

```bash
yarn test              # Run all tests
yarn test:watch        # Run tests in watch mode
yarn test:coverage     # Run tests with coverage report
```

### Example Test

```typescript
import { describe, it, expect, vi } from 'vitest';
import { CreateTaskUseCase } from '../../../src/application/use-cases/task/CreateTaskUseCase';

describe('CreateTaskUseCase', () => {
  it('should create a task successfully', async () => {
    const mockRepository = {
      create: vi.fn().mockResolvedValue({
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
      }),
    };

    const useCase = new CreateTaskUseCase(mockRepository as any);
    const result = await useCase.execute({
      title: 'Test Task',
      description: 'Test Description',
      userId: 'user-1',
    });

    expect(result.title).toBe('Test Task');
    expect(mockRepository.create).toHaveBeenCalled();
  });
});
```

### Test Coverage

Run coverage report:

```bash
yarn test:coverage
```

Coverage reports are generated in the `coverage/` directory.

## License

This project is proprietary software owned by marcotorres.pe. All rights reserved.
