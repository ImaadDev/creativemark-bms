# Jest Testing Guide - Creative Mark BMS

## 🎉 Setup Complete!

Jest has been successfully configured for both your **Frontend** and **Backend** projects.

---

## 📁 Project Structure

```
creativemark-bms/
├── creative-mark-backend/          # Node.js/Express Backend
│   ├── __tests__/                  # Backend test files
│   │   ├── auth.test.js           # API endpoint tests
│   │   ├── models.test.js         # Model validation tests
│   │   └── utils.test.js          # Utility function tests
│   ├── jest.config.js             # Backend Jest configuration
│   └── package.json               # Updated with test scripts
│
└── creative-mark-bm/               # Next.js Frontend
    ├── src/__tests__/              # Frontend test files
    │   ├── LoadingSpinner.test.jsx  # Component tests
    │   ├── api.test.js              # API service tests
    │   └── utils.test.js            # Utility function tests
    ├── jest.config.mjs             # Frontend Jest configuration
    ├── jest.setup.js               # Test environment setup
    └── package.json                # Updated with test scripts
```

---

## 🚀 Running Tests

### Frontend Tests (Next.js)

```powershell
# Navigate to frontend directory
cd creative-mark-bm

# Run all tests
npm test

# Run tests in watch mode (reruns on file changes)
npm run test:watch

# Run tests with coverage report (if configured)
npm run test:coverage
```

### Backend Tests (Node.js/Express)

```powershell
# Navigate to backend directory
cd creative-mark-backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

---

## ✅ Test Results

### Frontend: ✅ **31 tests passing**
- LoadingSpinner Component Tests (14 tests)
- Utility Functions Tests (12 tests)
- API Service Tests (5 tests)

### Backend: ✅ **14 tests passing**
- Auth API Tests (5 tests)
- JWT & Email Validation Tests (5 tests)
- Model Validation Tests (4 tests)

---

## 📝 Writing Tests

### Backend Example (API Test with Supertest)

```javascript
import request from 'supertest';

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      })
      .expect(201);

    expect(response.body.success).toBe(true);
  });
});
```

### Frontend Example (React Component Test)

```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

---

## 🧪 Test Types

### 1. **Unit Tests** - Test individual functions
```javascript
describe('calculateTotal', () => {
  it('should sum array of numbers', () => {
    expect(calculateTotal([1, 2, 3])).toBe(6);
  });
});
```

### 2. **Component Tests** - Test React components
```javascript
it('should handle button click', async () => {
  render(<Button onClick={mockFn} />);
  await userEvent.click(screen.getByRole('button'));
  expect(mockFn).toHaveBeenCalled();
});
```

### 3. **Integration Tests** - Test API endpoints
```javascript
it('should create a new task', async () => {
  const response = await request(app)
    .post('/api/tasks')
    .send({ title: 'Test Task' });
  expect(response.status).toBe(201);
});
```

---

## 🔧 Jest Configuration

### Backend (jest.config.js)
```javascript
export default {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: ['controllers/**/*.js', 'models/**/*.js'],
  coverageDirectory: 'coverage',
  verbose: true,
  testTimeout: 10000,
};
```

### Frontend (jest.config.mjs)
```javascript
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
```

---

## 📚 Testing Libraries

### Backend
- **Jest**: Test runner and assertion library
- **Supertest**: HTTP assertion library for API testing
- **@types/jest**: TypeScript definitions for Jest

### Frontend
- **Jest**: Test runner and assertion library
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM
- **@testing-library/user-event**: User interaction simulation

---

## 🎯 Best Practices

### 1. **Test File Naming**
- Use `.test.js` or `.spec.js` suffix
- Place tests in `__tests__/` directories
- Name tests after the file they're testing

### 2. **Test Structure (AAA Pattern)**
```javascript
it('should do something', () => {
  // Arrange - Setup test data
  const input = { name: 'Test' };
  
  // Act - Execute the function
  const result = processInput(input);
  
  // Assert - Verify the result
  expect(result.name).toBe('TEST');
});
```

### 3. **Use Descriptive Test Names**
```javascript
✅ Good: it('should reject invalid email addresses')
❌ Bad:  it('test email')
```

### 4. **Mock External Dependencies**
```javascript
jest.mock('@/services/api', () => ({
  fetchUser: jest.fn().mockResolvedValue({ id: 1, name: 'Test' }),
}));
```

### 5. **Test Edge Cases**
```javascript
describe('divide', () => {
  it('should divide two numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });
  
  it('should handle division by zero', () => {
    expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
  });
});
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module '@/...'"
**Solution**: Check `moduleNameMapper` in `jest.config.mjs`

### Issue: "ReferenceError: fetch is not defined"
**Solution**: Add polyfill or mock fetch in `jest.setup.js`
```javascript
global.fetch = jest.fn();
```

### Issue: Tests timeout
**Solution**: Increase timeout in `jest.config.js`
```javascript
testTimeout: 10000, // 10 seconds
```

### Issue: "ExperimentalWarning: VM Modules"
**Solution**: This is normal for ES modules. It's just a warning and won't affect your tests.

---

## 📊 Coverage Reports

### Generate Coverage Report

```powershell
# Backend
cd creative-mark-backend
npm run test:coverage

# Frontend
cd creative-mark-bm
npm run test:coverage
```

Coverage reports will be generated in the `coverage/` directory.

---

## 🔍 Debugging Tests

### 1. **Run specific test file**
```powershell
npm test auth.test.js
```

### 2. **Run tests matching a pattern**
```powershell
npm test -- --testNamePattern="should login"
```

### 3. **Use VS Code Debugger**
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

---

## 📖 Next Steps

1. **Expand Test Coverage**
   - Add tests for controllers (`authController.js`, `clientController.js`, etc.)
   - Add tests for React components (`Navbar.jsx`, `Sidebar.jsx`, etc.)
   - Add tests for API services (`applicationService.js`, `userService.js`, etc.)

2. **Set Up CI/CD**
   - Configure tests to run on GitHub Actions, GitLab CI, etc.
   - Add coverage thresholds
   - Prevent merging PRs with failing tests

3. **Add E2E Tests**
   - Consider adding Playwright or Cypress for end-to-end testing

4. **Monitor Test Performance**
   - Keep tests fast (< 1s per test suite ideally)
   - Use mocks to avoid real database/API calls
   - Run tests in parallel when possible

---

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

## 🎉 Happy Testing!

Your project is now ready for comprehensive testing. Start by adding tests for your most critical features, then expand coverage over time.

**Current Status:**
- ✅ Frontend: 31 tests passing
- ✅ Backend: 14 tests passing
- ✅ Total: **45 tests passing** 🎊

---

*Last Updated: October 9, 2025*

