// pages/_app.tsx
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { AppProps } from 'next/app';

const theme = createTheme();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
