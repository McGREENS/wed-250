import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import LoginPage from '@/app/(public)/login/page'

// Mock modules
jest.mock('next-auth/react')
jest.mock('next/navigation')
jest.mock('sonner')

describe('LoginPage', () => {
  const mockPush = jest.fn()
  const mockRefresh = jest.fn()
  const mockSignIn = signIn as jest.MockedFunction<typeof signIn>
  const mockToast = toast as jest.Mocked<typeof toast>

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
    
    // Setup router mock
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    })

    // Mock fetch for session check
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // ============================================================================
  // RENDERING TESTS
  // ============================================================================

  describe('Rendering', () => {
    test('should render login form with all elements', () => {
      render(<LoginPage />)

      // Check for main elements
      expect(screen.getByText('Welcome Back')).toBeInTheDocument()
      expect(screen.getByText('Enter your credentials to access your dashboard')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
      expect(screen.getByText('Forgot password?')).toBeInTheDocument()
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
      expect(screen.getByText('Sign up')).toBeInTheDocument()
    })

    test('should render lock icon', () => {
      render(<LoginPage />)
      const lockIcon = document.querySelector('svg')
      expect(lockIcon).toBeInTheDocument()
    })

    test('should have proper link to signup page', () => {
      render(<LoginPage />)
      const signupLink = screen.getByText('Sign up')
      expect(signupLink).toHaveAttribute('href', '/signup')
    })
  })

  // ============================================================================
  // FORM VALIDATION TESTS
  // ============================================================================

  describe('Form Validation', () => {
    test('should show error for invalid email format', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      const emailInput = screen.getByPlaceholderText('Email')
      const submitButton = screen.getByRole('button', { name: /log in/i })

      await user.type(emailInput, 'invalidemail')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument()
      })
    })

    test('should show error when email is empty', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      const submitButton = screen.getByRole('button', { name: /log in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument()
      })
    })

    test('should show error when password is empty', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      const emailInput = screen.getByPlaceholderText('Email')
      const submitButton = screen.getByRole('button', { name: /log in/i })

      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Password is required')).toBeInTheDocument()
      })
    })

    test('should accept valid email format', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      const emailInput = screen.getByPlaceholderText('Email')
      await user.type(emailInput, 'valid@example.com')

      // Should not show error for valid email
      expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument()
    })
  })

  // ============================================================================
  // PASSWORD VISIBILITY TOGGLE TESTS
  // ============================================================================

  describe('Password Visibility Toggle', () => {
    test('should toggle password visibility when eye icon is clicked', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement
      const toggleButton = passwordInput.nextElementSibling as HTMLButtonElement

      // Initially password should be hidden
      expect(passwordInput.type).toBe('password')

      // Click to show password
      await user.click(toggleButton)
      expect(passwordInput.type).toBe('text')

      // Click to hide password again
      await user.click(toggleButton)
      expect(passwordInput.type).toBe('password')
    })
  })

  // ============================================================================
  // SUCCESSFUL LOGIN TESTS
  // ============================================================================

  describe('Successful Login', () => {
    test('should login successfully and redirect to couple dashboard', async () => {
      const user = userEvent.setup()
      
      // Mock successful login
      mockSignIn.mockResolvedValue({ ok: true, error: null } as any)
      
      // Mock session response for couple
      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ user: { role: 'COUPLE' } }),
      })

      render(<LoginPage />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')
      const submitButton = screen.getByRole('button', { name: /log in/i })

      await user.type(emailInput, 'couple@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('credentials', {
          email: 'couple@example.com',
          password: 'password123',
          redirect: false,
        })
        expect(mockToast.success).toHaveBeenCalledWith('Welcome back!')
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
        expect(mockRefresh).toHaveBeenCalled()
      })
    })

    test('should redirect vendor to vendor dashboard', async () => {
      const user = userEvent.setup()
      
      mockSignIn.mockResolvedValue({ ok: true, error: null } as any)
      
      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ user: { role: 'VENDOR' } }),
      })

      render(<LoginPage />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')
      const submitButton = screen.getByRole('button', { name: /log in/i })

      await user.type(emailInput, 'vendor@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/vendor/dashboard')
      })
    })

    test('should redirect admin to admin dashboard', async () => {
      const user = userEvent.setup()
      
      mockSignIn.mockResolvedValue({ ok: true, error: null } as any)
      
      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ user: { role: 'ADMIN' } }),
      })

      render(<LoginPage />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')
      const submitButton = screen.getByRole('button', { name: /log in/i })

      await user.type(emailInput, 'admin@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/admin')
      })
    })
  })

  // ============================================================================
  // FAILED LOGIN TESTS
  // ============================================================================

  describe('Failed Login', () => {
    test('should show error message for invalid credentials', async () => {
      const user = userEvent.setup()
      
      // Mock failed login
      mockSignIn.mockResolvedValue({ ok: false, error: 'CredentialsSignin' } as any)

      render(<LoginPage />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')
      const submitButton = screen.getByRole('button', { name: /log in/i })

      await user.type(emailInput, 'wrong@example.com')
      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
      })
    })

    test('should show error message when login throws exception', async () => {
      const user = userEvent.setup()
      
      // Mock exception
      mockSignIn.mockRejectedValue(new Error('Network error'))

      render(<LoginPage />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')
      const submitButton = screen.getByRole('button', { name: /log in/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      })
    })
  })

  // ============================================================================
  // LOADING STATE TESTS
  // ============================================================================

  describe('Loading State', () => {
    test('should show loading state during login', async () => {
      const user = userEvent.setup()
      
      // Mock delayed response
      mockSignIn.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ ok: true, error: null } as any), 100))
      )

      render(<LoginPage />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')
      const submitButton = screen.getByRole('button', { name: /log in/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      // Check for loading text
      expect(screen.getByText('Logging in...')).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })
  })

  // ============================================================================
  // FORGOT PASSWORD TESTS
  // ============================================================================

  describe('Forgot Password', () => {
    test('should open forgot password modal when clicked', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      const forgotPasswordButton = screen.getByText('Forgot password?')
      await user.click(forgotPasswordButton)

      await waitFor(() => {
        expect(screen.getByText('Reset Password')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /send new password/i })).toBeInTheDocument()
      })
    })

    test('should close forgot password modal when cancel is clicked', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      // Open modal
      const forgotPasswordButton = screen.getByText('Forgot password?')
      await user.click(forgotPasswordButton)

      // Close modal
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      await waitFor(() => {
        expect(screen.queryByText('Reset Password')).not.toBeInTheDocument()
      })
    })

    test('should close forgot password modal when X is clicked', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      // Open modal
      const forgotPasswordButton = screen.getByText('Forgot password?')
      await user.click(forgotPasswordButton)

      // Close modal with X button
      const closeButton = screen.getByText('✕')
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('Reset Password')).not.toBeInTheDocument()
      })
    })

    test('should show error when email is empty in forgot password', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      // Open modal
      const forgotPasswordButton = screen.getByText('Forgot password?')
      await user.click(forgotPasswordButton)

      // Try to submit without email
      const sendButton = screen.getByRole('button', { name: /send new password/i })
      await user.click(sendButton)

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Please enter your email')
      })
    })

    test('should send password reset successfully', async () => {
      const user = userEvent.setup()
      
      // Mock successful password reset
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })

      render(<LoginPage />)

      // Open modal
      const forgotPasswordButton = screen.getByText('Forgot password?')
      await user.click(forgotPasswordButton)

      // Enter email
      const emailInput = screen.getByPlaceholderText('Enter your email')
      await user.type(emailInput, 'test@example.com')

      // Submit
      const sendButton = screen.getByRole('button', { name: /send new password/i })
      await user.click(sendButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@example.com' }),
        })
        expect(mockToast.success).toHaveBeenCalledWith('New password sent to your email')
        expect(screen.queryByText('Reset Password')).not.toBeInTheDocument()
      })
    })

    test('should show error when password reset fails', async () => {
      const user = userEvent.setup()
      
      // Mock failed password reset
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'User not found' }),
      })

      render(<LoginPage />)

      // Open modal
      const forgotPasswordButton = screen.getByText('Forgot password?')
      await user.click(forgotPasswordButton)

      // Enter email
      const emailInput = screen.getByPlaceholderText('Enter your email')
      await user.type(emailInput, 'notfound@example.com')

      // Submit
      const sendButton = screen.getByRole('button', { name: /send new password/i })
      await user.click(sendButton)

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('User not found')
      })
    })

    test('should disable buttons during password reset', async () => {
      const user = userEvent.setup()
      
      // Mock delayed response
      ;(global.fetch as jest.Mock).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100))
      )

      render(<LoginPage />)

      // Open modal
      const forgotPasswordButton = screen.getByText('Forgot password?')
      await user.click(forgotPasswordButton)

      // Enter email
      const emailInput = screen.getByPlaceholderText('Enter your email')
      await user.type(emailInput, 'test@example.com')

      // Submit
      const sendButton = screen.getByRole('button', { name: /send new password/i })
      await user.click(sendButton)

      // Check loading state
      expect(screen.getByText('Sending...')).toBeInTheDocument()
      expect(sendButton).toBeDisabled()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled()
    })
  })

  // ============================================================================
  // ACCESSIBILITY TESTS
  // ============================================================================

  describe('Accessibility', () => {
    test('should have proper form structure', () => {
      render(<LoginPage />)
      
      const form = screen.getByRole('button', { name: /log in/i }).closest('form')
      expect(form).toBeInTheDocument()
    })

    test('should have accessible input fields', () => {
      render(<LoginPage />)
      
      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')
      
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    test('should have accessible buttons', () => {
      render(<LoginPage />)
      
      const loginButton = screen.getByRole('button', { name: /log in/i })
      expect(loginButton).toHaveAttribute('type', 'submit')
    })
  })

  // ============================================================================
  // INTEGRATION TESTS
  // ============================================================================

  describe('Integration Tests', () => {
    test('should complete full login flow for couple user', async () => {
      const user = userEvent.setup()
      
      mockSignIn.mockResolvedValue({ ok: true, error: null } as any)
      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ user: { role: 'COUPLE', email: 'couple@example.com' } }),
      })

      render(<LoginPage />)

      // Fill form
      await user.type(screen.getByPlaceholderText('Email'), 'couple@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'SecurePass123!')

      // Submit
      await user.click(screen.getByRole('button', { name: /log in/i }))

      // Verify complete flow
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalled()
        expect(mockToast.success).toHaveBeenCalledWith('Welcome back!')
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
        expect(mockRefresh).toHaveBeenCalled()
      })
    })

    test('should handle complete forgot password flow', async () => {
      const user = userEvent.setup()
      
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })

      render(<LoginPage />)

      // Open forgot password
      await user.click(screen.getByText('Forgot password?'))
      
      // Enter email
      await user.type(screen.getByPlaceholderText('Enter your email'), 'forgot@example.com')
      
      // Submit
      await user.click(screen.getByRole('button', { name: /send new password/i }))

      // Verify flow
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/forgot-password', expect.any(Object))
        expect(mockToast.success).toHaveBeenCalledWith('New password sent to your email')
        expect(screen.queryByText('Reset Password')).not.toBeInTheDocument()
      })
    })
  })
})
