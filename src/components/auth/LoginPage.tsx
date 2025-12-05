// Login Page Component with react-hook-form and yup

import React from 'react';
import {
  Box,
  Container,
  Paper,
  Button,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Link,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useAuth';
import { Email as EmailIcon, Lock as LockIcon } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';

// Validation schema
const loginSchema = yup.object({
  username: yup
    .string()
    .email('Invalid email format')
    .required('Username is required'),
  password: yup
    .string()
    .required('Password is required'),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync({
        username: data.username,
        password: data.password,
      });
      navigate('/');
    } catch (error) {
      // Error is handled by React Query
      console.error('Login failed:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Sign in to ThingsBoard
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            {loginMutation.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {loginMutation.error instanceof Error
                  ? loginMutation.error.message
                  : 'Login failed. Please check your credentials.'}
              </Alert>
            )}

            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  required
                  error={!!errors.username}
                  sx={{ mt: 2 }}
                >
                  <InputLabel htmlFor="username-input">Username</InputLabel>
                  <OutlinedInput
                    {...field}
                    id="username-input"
                    type="email"
                    label="Username"
                    autoComplete="username"
                    autoFocus
                    startAdornment={
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    }
                  />
                  {errors.username && (
                    <FormHelperText>{errors.username.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  required
                  error={!!errors.password}
                  sx={{ mt: 2 }}
                >
                  <InputLabel htmlFor="password-input">Password</InputLabel>
                  <OutlinedInput
                    {...field}
                    id="password-input"
                    type="password"
                    label="Password"
                    autoComplete="current-password"
                    startAdornment={
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    }
                  />
                  {errors.password && (
                    <FormHelperText>{errors.password.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Link
                href="/login/resetPasswordRequest"
                variant="body2"
                underline="hover"
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting || loginMutation.isPending}
            >
              {isSubmitting || loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
