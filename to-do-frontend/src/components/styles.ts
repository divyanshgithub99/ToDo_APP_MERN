import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CustomTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 600,
  fontSize: '20px',
  marginLeft: '370px',
  padding: '8px 39px',
  [theme.breakpoints.down('sm')]: {
    padding: 0,
    marginLeft: '64px',
  },
}));
