import { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Tooltip from '@mui/material/Tooltip';
import ColorModeContext from '../theme/ColorModeContext';

// LEARNING NOTE: MUI 5 doesn't have useColorScheme.
// Instead we read the current mode from useTheme().palette.mode
// and toggle via our custom ColorModeContext.

export default function ThemeToggle() {
  const theme = useTheme();
  const { toggleColorMode } = useContext(ColorModeContext);
  const isDark = theme.palette.mode === 'dark';

  return (
    <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton id="tour-theme-toggle" onClick={toggleColorMode} color="inherit">
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
