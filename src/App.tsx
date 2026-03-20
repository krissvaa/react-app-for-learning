import { useState, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { RouterProvider } from 'react-router';
import { buildTheme } from './theme/theme';
import ColorModeContext from './theme/ColorModeContext';
import { router } from './app/router';
import DisclaimerDialog from './components/DisclaimerDialog';
import OnboardingTour from './components/OnboardingTour';

// LEARNING NOTE: MUI 5 dark mode pattern —
// 1. Store mode in state
// 2. Build theme from mode (useMemo so it only recalculates when mode changes)
// 3. Provide toggleColorMode via context so any component can flip it
// 4. Wrap everything in ThemeProvider with the current theme

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [],
  );

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DisclaimerDialog>
          <OnboardingTour>
            <RouterProvider router={router} />
          </OnboardingTour>
        </DisclaimerDialog>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
