import { ConnectButton } from '@rainbow-me/rainbowkit';
// routes
import Router from './routes';
// theme

import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <div className='flex flex-row p-3 w-screen absolute z-1 bg-transparent ' style={{ display: 'flex', justifyContent: 'flex-end' }} >
        <ConnectButton />
      </div>
      <ScrollToTop />
      <StyledChart />
      <Router />
    </ThemeProvider>
  );
}
