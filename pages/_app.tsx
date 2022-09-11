import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTheme } from '@mui/material/styles';
import teal from '@mui/material/colors/teal';
import indigo from '@mui/material/colors/indigo';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import DefaultLayout from '@layouts/default-layout';

const queryClient = new QueryClient();
let theme = createTheme({
  palette: {
    primary: {
      main: teal[500]
    },
    secondary: {
      main: indigo[500]
    },
    mode: "light"
  }
});
function MyApp({ Component, pageProps }: AppProps) {
  return <QueryClientProvider client={queryClient}>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <DefaultLayout children={<Component {...pageProps} />}/>
    </ThemeProvider>
  </QueryClientProvider>
}

export default MyApp
