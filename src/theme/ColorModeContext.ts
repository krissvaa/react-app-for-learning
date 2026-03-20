import { createContext } from 'react';

// LEARNING NOTE: In MUI 5, there's no built-in useColorScheme hook.
// We create our own React context so any component (like ThemeToggle)
// can call toggleColorMode() without prop drilling.

const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export default ColorModeContext;
