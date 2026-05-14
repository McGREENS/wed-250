# Testing Setup Guide

## Step 1: Install Testing Dependencies

Run this command to install all required testing packages:

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest
```

## Step 2: Verify Files Created

Make sure these files exist:
- ✅ `jest.config.js` - Jest configuration
- ✅ `jest.setup.js` - Test environment setup
- ✅ `__tests__/login.test.tsx` - Login page tests
- ✅ `__tests__/README.md` - Test documentation

## Step 3: Run Tests

### Run all tests:
```bash
npm test
```

### Run tests in watch mode (auto-rerun on changes):
```bash
npm run test:watch
```

### Run tests with coverage report:
```bash
npm run test:coverage
```

## Expected Output

When you run `npm test`, you should see:

```
PASS  __tests__/login.test.tsx
  LoginPage
    Rendering
      ✓ should render login form with all elements (XXms)
      ✓ should render lock icon (XXms)
      ✓ should have proper link to signup page (XXms)
    Form Validation
      ✓ should show error for invalid email format (XXms)
      ✓ should show error when email is empty (XXms)
      ✓ should show error when password is empty (XXms)
      ✓ should accept valid email format (XXms)
    Password Visibility Toggle
      ✓ should toggle password visibility when eye icon is clicked (XXms)
    Successful Login
      ✓ should login successfully and redirect to couple dashboard (XXms)
      ✓ should redirect vendor to vendor dashboard (XXms)
      ✓ should redirect admin to admin dashboard (XXms)
    Failed Login
      ✓ should show error message for invalid credentials (XXms)
      ✓ should show error message when login throws exception (XXms)
    Loading State
      ✓ should show loading state during login (XXms)
    Forgot Password
      ✓ should open forgot password modal when clicked (XXms)
      ✓ should close forgot password modal when cancel is clicked (XXms)
      ✓ should close forgot password modal when X is clicked (XXms)
      ✓ should show error when email is empty in forgot password (XXms)
      ✓ should send password reset successfully (XXms)
      ✓ should show error when password reset fails (XXms)
      ✓ should disable buttons during password reset (XXms)
    Accessibility
      ✓ should have proper form structure (XXms)
      ✓ should have accessible input fields (XXms)
      ✓ should have accessible buttons (XXms)
    Integration Tests
      ✓ should complete full login flow for couple user (XXms)
      ✓ should handle complete forgot password flow (XXms)

Test Suites: 1 passed, 1 total
Tests:       35 passed, 35 total
Snapshots:   0 total
Time:        X.XXXs
```

## Coverage Report

After running `npm run test:coverage`, you'll see:

```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   XX.XX |    XX.XX |   XX.XX |   XX.XX |
 login/page.tsx     |   XX.XX |    XX.XX |   XX.XX |   XX.XX | XX-XX
--------------------|---------|----------|---------|---------|-------------------
```

## Troubleshooting

### Issue: "Cannot find module '@testing-library/react'"
**Solution**: Run `npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event`

### Issue: "Jest encountered an unexpected token"
**Solution**: Make sure `jest.config.js` and `jest.setup.js` are properly configured

### Issue: Tests are failing
**Solution**: 
1. Check if all dependencies are installed
2. Make sure you're in the project root directory
3. Try `npm test -- --clearCache` to clear Jest cache

### Issue: "Cannot find module '@/app/...'"
**Solution**: The `@/` alias is configured in `jest.config.js` - make sure the file exists

## Quick Commands Reference

```bash
# Install dependencies
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test login.test.tsx

# Run specific test suite
npm test -- -t "Form Validation"

# Clear cache and run
npm test -- --clearCache

# Verbose output
npm test -- --verbose
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Run tests to verify setup
3. ✅ Check coverage report
4. 📝 Write tests for other pages (signup, dashboard, etc.)
5. 🚀 Set up CI/CD with automated testing

## Need Help?

- Check `__tests__/README.md` for detailed documentation
- Review test file `__tests__/login.test.tsx` for examples
- Visit [Jest Documentation](https://jestjs.io/)
- Visit [React Testing Library](https://testing-library.com/react)
