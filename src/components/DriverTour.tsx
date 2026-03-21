import { useState, useCallback } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { useTheme } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import useDriverTour, { type PortalTarget } from '../hooks/useDriverTour';
import WelcomeStep from './tour/WelcomeStep';

// LEARNING NOTE: React Portals bridge driver.js ↔ React 19 ↔ MUI v5
//
// Problem: driver.js creates DOM nodes outside React's tree. Normally you
// can't render React components there — no ThemeProvider, no context, no hooks.
//
// Solution: createPortal(element, domNode) renders a React element into any
// DOM node while preserving the React context tree. The portal "lives" in
// React's component hierarchy (so it inherits ThemeProvider, Redux store, etc.)
// but its output appears in the target DOM node.
//
// How it works here:
//   1. driver.js fires `onPopoverRender` with the popover's description element
//   2. We store that element reference in state (triggers a re-render)
//   3. In the render, we use createPortal to inject a React component into it
//   4. The component (WelcomeStep) uses MUI's Avatar, Typography, Chip — all
//      fully themed, because the portal inherits context from DriverTour's
//      position in the tree (inside ThemeProvider)
//
// This pattern works for any imperative DOM library (driver.js, tippy.js,
// intro.js, etc.) — anywhere you have a DOM node and want React inside it.

// Map step indices to React components
const STEP_COMPONENTS: Record<number, React.ComponentType> = {
  0: WelcomeStep,
};

export default function DriverTour() {
  const theme = useTheme();
  const [portalTarget, setPortalTarget] = useState<PortalTarget | null>(null);

  // LEARNING NOTE: flushSync forces React to process this state update
  // synchronously — the portal is committed to the DOM before this callback
  // returns. Without it, React 19 would batch the update and the popover
  // would briefly appear empty before the portal content renders.
  const handlePopoverRender = useCallback((target: PortalTarget) => {
    flushSync(() => {
      setPortalTarget(target);
    });
  }, []);

  useDriverTour({ onPopoverRender: handlePopoverRender });

  const { palette, typography, shape } = theme;

  // Determine which React component to render for the current step
  const StepComponent = portalTarget ? STEP_COMPONENTS[portalTarget.stepIndex] : null;

  return (
    <>
      {/* Portal: render React component into driver.js popover DOM */}
      {StepComponent && portalTarget && createPortal(
        <StepComponent />,
        portalTarget.descriptionEl,
      )}

      <GlobalStyles
        styles={{
          '.driver-popover': {
            backgroundColor: `${palette.background.paper} !important`,
            color: `${palette.text.primary} !important`,
            borderRadius: `${shape.borderRadius}px !important`,
            fontFamily: `${typography.fontFamily} !important`,
            boxShadow: `${theme.shadows[8]} !important`,
            border: `1px solid ${palette.divider} !important`,
          },
          '.driver-popover .driver-popover-title': {
            fontFamily: `${typography.fontFamily} !important`,
            fontSize: `${typography.h6.fontSize} !important`,
            fontWeight: `${typography.h6.fontWeight} !important`,
            color: `${palette.text.primary} !important`,
          },
          '.driver-popover .driver-popover-description': {
            fontFamily: `${typography.fontFamily} !important`,
            color: `${palette.text.secondary} !important`,
            fontSize: '0.9rem !important',
            lineHeight: '1.5 !important',
          },
          '.driver-popover .driver-popover-progress-text': {
            color: `${palette.text.secondary} !important`,
            fontFamily: `${typography.fontFamily} !important`,
          },
          '.driver-popover .driver-popover-navigation-btns button': {
            fontFamily: `${typography.fontFamily} !important`,
            textTransform: 'none !important' as 'none',
            borderRadius: '8px !important',
            padding: '6px 16px !important',
            fontSize: '0.875rem !important',
            fontWeight: '500 !important',
          },
          '.driver-popover .driver-popover-next-btn': {
            backgroundColor: `${palette.primary.main} !important`,
            color: `${palette.primary.contrastText} !important`,
            border: 'none !important',
            '&:hover': {
              backgroundColor: `${palette.primary.dark} !important`,
            },
          },
          '.driver-popover .driver-popover-prev-btn': {
            backgroundColor: 'transparent !important',
            color: `${palette.primary.main} !important`,
            border: `1px solid ${palette.primary.main} !important`,
            '&:hover': {
              backgroundColor: `${palette.action.hover} !important`,
            },
          },
          '.driver-popover .driver-popover-close-btn': {
            color: `${palette.text.secondary} !important`,
            '&:hover': {
              color: `${palette.text.primary} !important`,
            },
          },
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
    </>
  );
}
