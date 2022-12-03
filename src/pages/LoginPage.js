import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';

import { Link, Container, Typography, Button } from '@mui/material';
// hooks
import { LoginForm } from '../sections/auth/login';
import useResponsive from '../hooks/useResponsive';

import Logo from '../components/logo';

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({

  marginTop: '0.1px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',

  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,


}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');

  return (
    <>

      <Helmet>
        <title> Verify Authentictiy </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {/* {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              One Step verfication of wallets
            </Typography>
            <img src="/assets/mainpage-2.jpg" alt="login" />
          </StyledSection>
        )} */}

        <Container maxWidth="sm" style={{ marginLeft: "115px", marginTop: "0.0001px" }}>
          <StyledContent style={{ marginTop: "0px" }}>
            <Typography variant="h4" style={{ marginTop: "0px" }} >
              Verify Authentictiy
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              Want to understand how we work? {''}
              <Link variant="subtitle2">Get started</Link>
            </Typography>
            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
