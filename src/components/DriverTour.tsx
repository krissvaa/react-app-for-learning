import { useTheme } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import useDriverTour from '../hooks/useDriverTour';

// LEARNING NOTE: Bridging driver.js styles with MUI v5
//
// driver.js renders its own DOM (overlay, popover, buttons) outside of React's
// tree. MUI's ThemeProvider and sx prop can't reach it. We solve this with
// MUI's GlobalStyles component, which injects <style> into the document head.
//
// By reading palette values from useTheme() and passing them to GlobalStyles,
// the driver.js popover automatically matches the current MUI theme — including
// dark mode. When the theme changes, React re-renders this component and
// GlobalStyles updates the CSS.
//
// We scope our overrides under .driver-theme-light / .driver-theme-dark using
// driver.js's `popoverClass` option so they don't leak into the rest of the app.

export default function DriverTour() {
  const theme = useTheme();
  useDriverTour();

  const { palette, typography, shape } = theme;

  return (
    <GlobalStyles
      styles={{
        // Popover container
        '.driver-popover': {
          backgroundColor: `${palette.background.paper} !important`,
          color: `${palette.text.primary} !important`,
          borderRadius: `${shape.borderRadius}px !important`,
          fontFamily: `${typography.fontFamily} !important`,
          boxShadow: `${theme.shadows[8]} !important`,
          border: `1px solid ${palette.divider} !important`,
        },
        // Title
        '.driver-popover .driver-popover-title': {
          fontFamily: `${typography.fontFamily} !important`,
          fontSize: `${typography.h6.fontSize} !important`,
          fontWeight: `${typography.h6.fontWeight} !important`,
          color: `${palette.text.primary} !important`,
        },
        // Description
        '.driver-popover .driver-popover-description': {
          fontFamily: `${typography.fontFamily} !important`,
          color: `${palette.text.secondary} !important`,
          fontSize: '0.9rem !important',
          lineHeight: '1.5 !important',
        },
        // Progress text
        '.driver-popover .driver-popover-progress-text': {
          color: `${palette.text.secondary} !important`,
          fontFamily: `${typography.fontFamily} !important`,
        },
        // Navigation buttons
        '.driver-popover .driver-popover-navigation-btns button': {
          fontFamily: `${typography.fontFamily} !important`,
          textTransform: 'none !important' as 'none',
          borderRadius: '8px !important',
          padding: '6px 16px !important',
          fontSize: '0.875rem !important',
          fontWeight: '500 !important',
        },
        // Next / Done button — matches MUI contained primary
        '.driver-popover .driver-popover-next-btn': {
          backgroundColor: `${palette.primary.main} !important`,
          color: `${palette.primary.contrastText} !important`,
          border: 'none !important',
          '&:hover': {
            backgroundColor: `${palette.primary.dark} !important`,
          },
        },
        // Previous button — matches MUI outlined style
        '.driver-popover .driver-popover-prev-btn': {
          backgroundColor: 'transparent !important',
          color: `${palette.primary.main} !important`,
          border: `1px solid ${palette.primary.main} !important`,
          '&:hover': {
            backgroundColor: `${palette.action.hover} !important`,
          },
        },
        // Close button
        '.driver-popover .driver-popover-close-btn': {
          color: `${palette.text.secondary} !important`,
          '&:hover': {
            color: `${palette.text.primary} !important`,
          },
        },
        // Arrow — match popover background
        '.driver-popover-arrow': {
          borderColor: `${palette.background.paper} !important`,
        },
        '.driver-popover-arrow-side-left.driver-popover-arrow': {
          borderLeftColor: `${palette.background.paper} !important`,
        },
        '.driver-popover-arrow-side-right.driver-popover-arrow': {
          borderRightColor: `${palette.background.paper} !important`,
        },
        '.driver-popover-arrow-side-top.driver-popover-arrow': {
          borderTopColor: `${palette.background.paper} !important`,
        },
        '.driver-popover-arrow-side-bottom.driver-popover-arrow': {
          borderBottomColor: `${palette.background.paper} !important`,
        },
      }}
    />
  );
}
