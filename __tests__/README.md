# Login Page Test Documentation

## Overview
Comprehensive automated tests for the login page using Jest and React Testing Library.

## Test Coverage

### 1. Rendering Tests
- ✅ Renders all form elements (email, password, buttons)
- ✅ Renders icons and branding
- ✅ Renders links (signup, forgot password)

### 2. Form Validation Tests
- ✅ Invalid email format validation
- ✅ Empty email validation
- ✅ Empty password validation
- ✅ Valid email acceptance

### 3. Password Visibility Tests
- ✅ Toggle password visibility (show/hide)
- ✅ Eye icon functionality

### 4. Successful Login Tests
- ✅ Couple user login → redirects to `/dashboard`
- ✅ Vendor user login → redirects to `/vendor/dashboard`
- ✅ Admin user login → redirects to `/admin`
- ✅ Success toast notification
- ✅ Router refresh after login

### 5. Failed Login Tests
- ✅ Invalid credentials error message
- ✅ Network error handling
- ✅ Error display in UI

### 6. Loading State Tests
- ✅ Shows "Logging in..." during submission
- ✅ Disables submit button during loading

### 7. Forgot Password Tests
- ✅ Opens forgot password modal
- ✅ Closes modal (Cancel button)
- ✅ Closes modal (X button)
- ✅ Empty email validation
- ✅ Successful password reset
- ✅ Failed password reset error
- ✅ Loading state during reset

### 8. Accessibility Tests
- ✅ Proper form structure
- ✅ Accessible input fields
- ✅ Accessible buttons

### 9. Integration Tests
- ✅ Complete login flow (end-to-end)
- ✅ Complete forgot password flow (end-to-end)

## Running Tests

### Install Dependencies
```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Specific Test File
```bash
npm test login.test.tsx
```

### Run Specific Test Suite
```bash
npm test -- -t "Form Validation"
```

### Run Specific Test Case
```bash
npm test -- -t "should show error for invalid email format"
```

## Test Structure

```
__tests__/
└── login.test.tsx          # Login page tests

jest.config.js              # Jest configuration
jest.setup.js               # Test environment setup
```

## Test Statistics

- **Total Test Suites**: 9
- **Total Test Cases**: 35+
- **Coverage Target**: 80%+

## Mocked Dependencies

### Next.js
- `next/navigation` - Router and navigation hooks
- `next-auth/react` - Authentication

### UI Libraries
- `sonner` - Toast notifications

### APIs
- `fetch` - API calls (session, forgot password)

## Common Test Patterns

### Testing User Interactions
```typescript
const user = userEvent.setup()
await user.type(emailInput, 'test@example.com')
await user.click(submitButton)
```

### Testing Async Operations
```typescript
await waitFor(() => {
  expect(mockFunction).toHaveBeenCalled()
})
```

### Testing Error States
```typescript
mockSignIn.mockResolvedValue({ ok: false, error: 'Error' })
// ... trigger action
expect(screen.getByText('Error message')).toBeInTheDocument()
```

## Debugging Tests

### View Test Output
```bash
npm test -- --verbose
```

### Debug Specific Test
```bash
npm test -- --no-coverage -t "test name"
```

### View DOM Structure
Add this in your test:
```typescript
screen.debug() // Prints entire DOM
screen.debug(element) // Prints specific element
```

## CI/CD Integration

Add to your `package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

Add to GitHub Actions:
```yaml
- name: Run tests
  run: npm run test:ci
```

## Best Practices

1. ✅ Test user behavior, not implementation
2. ✅ Use `userEvent` over `fireEvent` for realistic interactions
3. ✅ Use `waitFor` for async operations
4. ✅ Query by role/label for accessibility
5. ✅ Mock external dependencies
6. ✅ Test error states and edge cases
7. ✅ Keep tests isolated and independent

## Troubleshooting

### Tests Failing?
1. Check if all dependencies are installed
2. Verify mock implementations
3. Check for async timing issues
4. Review error messages carefully

### Coverage Not 100%?
- Some code paths may be unreachable in tests
- Focus on critical paths first
- 80%+ coverage is excellent

## Next Steps

1. Add tests for other pages (signup, dashboard, etc.)
2. Add E2E tests with Playwright for critical flows
3. Set up CI/CD pipeline with automated testing
4. Monitor test coverage over time

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
