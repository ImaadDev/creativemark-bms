# Jest Cheatsheet 🚀

Quick reference for common Jest testing patterns and commands.

---

## 📋 Test Commands

```powershell
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test auth.test.js

# Run tests matching pattern
npm test -- --testNamePattern="login"

# Run with coverage
npm test -- --coverage

# Run tests for changed files only
npm test -- --onlyChanged

# Update snapshots
npm test -- --updateSnapshot

# Run tests in CI mode (no watch)
npm test -- --ci

# Show verbose output
npm test -- --verbose
```

---

## 🧪 Test Structure

```javascript
// Test Suite
describe('Feature Name', () => {
  
  // Setup before each test
  beforeEach(() => {
    // Runs before each test
  });

  // Setup before all tests
  beforeAll(() => {
    // Runs once before all tests
  });

  // Cleanup after each test
  afterEach(() => {
    // Runs after each test
  });

  // Cleanup after all tests
  afterAll(() => {
    // Runs once after all tests
  });

  // Individual test
  it('should do something', () => {
    expect(true).toBe(true);
  });

  // Skip test
  it.skip('skipped test', () => {
    // This won't run
  });

  // Run only this test
  it.only('only this test runs', () => {
    // Only this test will run
  });

  // Test with timeout
  it('async test', async () => {
    // Test code
  }, 10000); // 10 second timeout
});
```

---

## ✅ Common Matchers

### Equality
```javascript
expect(value).toBe(5);                    // Strict equality (===)
expect(value).toEqual({ a: 1 });          // Deep equality
expect(value).not.toBe(null);             // Negation
expect(value).toStrictEqual({ a: 1 });    // Strict deep equality
```

### Truthiness
```javascript
expect(value).toBeTruthy();               // Boolean true
expect(value).toBeFalsy();                // Boolean false
expect(value).toBeNull();                 // null
expect(value).toBeUndefined();            // undefined
expect(value).toBeDefined();              // not undefined
```

### Numbers
```javascript
expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(3.5);
expect(value).toBeLessThan(5);
expect(value).toBeLessThanOrEqual(4.5);
expect(value).toBeCloseTo(0.3);           // For floating point
```

### Strings
```javascript
expect(str).toMatch(/pattern/);
expect(str).toMatch('substring');
expect(str).toContain('substring');
```

### Arrays & Iterables
```javascript
expect(arr).toContain('item');
expect(arr).toHaveLength(3);
expect(arr).toEqual(expect.arrayContaining([1, 2]));
```

### Objects
```javascript
expect(obj).toHaveProperty('key');
expect(obj).toHaveProperty('key', value);
expect(obj).toMatchObject({ key: 'value' });
expect(obj).toEqual(expect.objectContaining({ key: 'value' }));
```

### Functions & Errors
```javascript
expect(fn).toThrow();
expect(fn).toThrow('error message');
expect(fn).toThrow(Error);
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledTimes(2);
expect(fn).toHaveBeenCalledWith(arg1, arg2);
expect(fn).toHaveBeenLastCalledWith(arg1, arg2);
```

### Promises
```javascript
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

### DOM (with @testing-library/jest-dom)
```javascript
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toBeDisabled();
expect(element).toHaveTextContent('text');
expect(element).toHaveClass('className');
expect(input).toHaveValue('value');
```

---

## 🎭 Mocking

### Mock Functions
```javascript
// Create mock function
const mockFn = jest.fn();

// Mock implementation
mockFn.mockImplementation(() => 'value');
mockFn.mockReturnValue('value');
mockFn.mockResolvedValue('async value');
mockFn.mockRejectedValue(new Error('error'));

// Mock implementation once
mockFn.mockImplementationOnce(() => 'first call');
mockFn.mockReturnValueOnce('first');

// Check calls
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(1);
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
expect(mockFn).toHaveBeenLastCalledWith(arg);

// Get call information
mockFn.mock.calls;              // All calls
mockFn.mock.results;            // All results
mockFn.mock.instances;          // All instances

// Clear mock data
mockFn.mockClear();             // Clears call history
mockFn.mockReset();             // Clears everything
mockFn.mockRestore();           // Restores original
```

### Mock Modules
```javascript
// Auto-mock module
jest.mock('./module');

// Manual mock
jest.mock('./module', () => ({
  fn: jest.fn(() => 'mocked'),
}));

// Mock specific function
jest.mock('./module', () => ({
  ...jest.requireActual('./module'),
  fn: jest.fn(),
}));

// Mock ES6 class
jest.mock('./MyClass');
const MockedClass = require('./MyClass');
MockedClass.mockImplementation(() => ({
  method: jest.fn(),
}));
```

### Spy on Methods
```javascript
const spy = jest.spyOn(object, 'method');
spy.mockImplementation(() => 'mocked');
spy.mockRestore();
```

### Mock Timers
```javascript
jest.useFakeTimers();
jest.runAllTimers();
jest.runOnlyPendingTimers();
jest.advanceTimersByTime(1000);
jest.clearAllTimers();
jest.useRealTimers();
```

---

## 🧩 React Testing Library

### Rendering
```javascript
import { render, screen } from '@testing-library/react';

const { container, getByText, queryByText } = render(<Component />);
```

### Queries
```javascript
// getBy - Throws error if not found
screen.getByText('text');
screen.getByRole('button');
screen.getByLabelText('label');
screen.getByPlaceholderText('placeholder');
screen.getByTestId('test-id');

// queryBy - Returns null if not found
screen.queryByText('text');

// findBy - Async, waits for element
await screen.findByText('text');

// getAllBy - Returns array
screen.getAllByRole('listitem');
```

### User Events
```javascript
import userEvent from '@testing-library/user-event';

// Click
await userEvent.click(element);

// Type
await userEvent.type(input, 'text');

// Clear
await userEvent.clear(input);

// Select option
await userEvent.selectOptions(select, 'value');

// Upload file
await userEvent.upload(input, file);

// Keyboard
await userEvent.keyboard('{Enter}');
```

### Waiting
```javascript
import { waitFor } from '@testing-library/react';

// Wait for condition
await waitFor(() => {
  expect(screen.getByText('loaded')).toBeInTheDocument();
});

// Wait with options
await waitFor(() => {
  expect(element).toBeVisible();
}, { timeout: 3000 });
```

---

## 🌐 API Testing (Supertest)

```javascript
import request from 'supertest';
import app from './app';

describe('API Tests', () => {
  it('GET /api/users', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', 'Bearer token')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveLength(5);
  });

  it('POST /api/users', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'John', email: 'john@test.com' })
      .expect(201);
  });

  it('PUT /api/users/:id', async () => {
    await request(app)
      .put('/api/users/123')
      .send({ name: 'Jane' })
      .expect(200);
  });

  it('DELETE /api/users/:id', async () => {
    await request(app)
      .delete('/api/users/123')
      .expect(204);
  });
});
```

---

## 🎨 Snapshot Testing

```javascript
// Create snapshot
expect(component).toMatchSnapshot();

// Inline snapshot
expect(value).toMatchInlineSnapshot(`"expected value"`);

// Update snapshots
// npm test -- --updateSnapshot
```

---

## 🔧 Configuration Examples

### jest.config.js (Backend)
```javascript
export default {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  verbose: true,
  testTimeout: 10000,
};
```

### jest.config.mjs (Frontend - Next.js)
```javascript
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};

export default createJestConfig(customJestConfig);
```

---

## 💡 Pro Tips

### 1. **Test Isolation**
```javascript
// ✅ Good - Each test is independent
it('test 1', () => {
  const data = { value: 1 };
  expect(data.value).toBe(1);
});

it('test 2', () => {
  const data = { value: 2 };
  expect(data.value).toBe(2);
});

// ❌ Bad - Tests depend on each other
let data = {};
it('test 1', () => {
  data.value = 1;
});
it('test 2', () => {
  expect(data.value).toBe(1); // Depends on test 1
});
```

### 2. **Async Testing**
```javascript
// ✅ Good - Always await or return promises
it('async test', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});

// or
it('async test', () => {
  return fetchData().then(data => {
    expect(data).toBeDefined();
  });
});
```

### 3. **Mock Only What You Need**
```javascript
// ✅ Good - Mock external dependencies
jest.mock('@/services/api');

// ❌ Bad - Don't mock the code you're testing
jest.mock('./myFunction'); // Then testing myFunction
```

### 4. **Use Test IDs for E2E**
```jsx
// Component
<button data-testid="submit-btn">Submit</button>

// Test
screen.getByTestId('submit-btn');
```

### 5. **Group Related Tests**
```javascript
describe('UserService', () => {
  describe('create', () => {
    it('should create user with valid data', () => {});
    it('should reject invalid email', () => {});
  });

  describe('update', () => {
    it('should update user', () => {});
    it('should handle not found', () => {});
  });
});
```

---

## 📊 Coverage Thresholds

```javascript
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/utils/': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
```

---

## 🐛 Debugging

### VS Code Jest Extension
1. Install "Jest" extension
2. Click on "Run | Debug" above each test

### Console Logs
```javascript
it('debug test', () => {
  console.log('Debug info:', value);
  expect(value).toBe(expected);
});
```

### Debug in Node
```powershell
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## 📚 Resources

- [Jest Docs](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Jest Cheat Sheet](https://github.com/sapegin/jest-cheat-sheet)

---

**Quick Start:**
```powershell
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test -- --coverage     # With coverage
```

🎉 Happy Testing!

