import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
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
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
}));

// Container centré sur toute la page
const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center', // centre verticalement
  alignItems: 'center',     // centre horizontalement
  padding: theme.spacing(2),
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
  },
}));

export default function CreationCompte({ signUp, setSignUp }: any) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const CreationCompteFunction = (data: any) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: data.name,
        email: data.email,
        mdp: data.password,
      }),
    };
    fetch('http://localhost:3000/post-admine', requestOptions)
      .then((response) => response.json())
      .then(() => {
        Swal.fire({
          title: 'Compte ajouté avec succès!',
          icon: 'success',
          draggable: true,
        });
        setSignUp(!signUp);
      });
  };

  return (
    <Box sx={{  width: '100%' ,ml :45}}>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign up
          </Typography>

          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            onSubmit={handleSubmit(CreationCompteFunction)}
          >
            {/* NAME */}
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                fullWidth
                id="name"
                placeholder="Name"
                {...register("name", { required: "Name required" })}
                error={!!errors.name}
                helperText={errors.name ? String(errors.name.message) : ''}
              />
            </FormControl>

            {/* EMAIL */}
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                fullWidth
                id="email"
                placeholder="your@email.com"
                {...register("email", { required: "Email required" })}
                error={!!errors.email}
                helperText={errors.email ? String(errors.email.message) : ''}
              />
            </FormControl>

            {/* PASSWORD */}
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                fullWidth
                type="password"
                id="password"
                placeholder="••••••"
                {...register("password", { required: "Password required" })}
                error={!!errors.password}
                helperText={errors.password ? String(errors.password.message) : ''}
              />
            </FormControl>

            <Button type="submit" fullWidth variant="contained">
              Création Compte
            </Button>
          </Box>

          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <button
                onClick={() => setSignUp(!signUp)}
                style={{
                  color: 'blue',
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Sign in
              </button>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </Box>
  );
}
