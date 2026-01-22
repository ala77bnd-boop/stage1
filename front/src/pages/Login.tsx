import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
  },
}));


export default function Login({ setIsConeter }: any) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const LoginFunction = (data: any) => {
    console.log(data)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        mdp: data.password,
      }),
    };
    fetch('http://localhost:3000/login-admine', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          localStorage.setItem('admine_id', data[0].id);
          localStorage.setItem('NomAdmine', data[0].nom);

          Swal.fire({
            title: 'Connexion réussie!',
            icon: 'success',
            draggable: true,
          });
          setIsConeter(true);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Email ou mot de passe incorrect!',
          });
        }
      });
  };

  return (
    <Box sx={{  width: '100%' ,ml :45,mt: 10 }}>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Login
          </Typography>

          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            onSubmit={handleSubmit(LoginFunction)}
          >
            {/* EMAIL */}
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                fullWidth
                id="email"
                placeholder="your@email.com"
                autoComplete='email'
                variant='outlined'
                {...register("email", {
                  required: "email required"
                })}
                error={!!errors.email}
                helperText={errors.email ? String(errors.email.message) : ''}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                autoComplete='password'
                fullWidth
                type="password"
                id="password"
                placeholder="••••"
                helperText={errors.password ? String(errors.password.message) : ''}
                {...register("password", {
                  required: "password required"
                })}
                error={!!errors.password}
              />
            </FormControl>

            <Button type="submit" fullWidth variant="contained">
              Login
            </Button>
          </Box>

          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>
              Create an account?{' '}
              <Link
                href="/material-ui/getting-started/templates/sign-in/"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Création Compte
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </Box>
  );
}
