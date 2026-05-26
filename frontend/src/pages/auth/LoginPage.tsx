import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { useAppDispatch } from '@hooks/redux';
import { loginStart, loginSuccess, loginFailure } from '@store/slices/authSlice';
import { authService } from '@services/authService';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      dispatch(loginStart());
      const data = await authService.login(username, password);
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      navigate('/dashboard');
    } catch (err) {
      dispatch(loginFailure());
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card sx={{ width: '100%' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Shop Floor Allocation
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
              Sign in to continue
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginPage;
