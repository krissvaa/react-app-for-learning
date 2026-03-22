import { useState, useCallback } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { useTheme } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import useDriverTour, { type PortalTarget, TOUR_STEP_COUNT, TOUR_OK_LABELS } from '../hooks/useDriverTour';
import WelcomeStep from './tour/WelcomeStep';
import TourFooter from './tour/TourFooter';

// LEARNING NOTE: React Portals bridge driver.js ↔ React 19 ↔ MUI v5
//
// We now portal TWO things into driver.js's popover:
//   1. Content portal (step 0 only) — WelcomeStep component into description el
//   2. Footer portal (every step) — TourFooter with bubbles + OK/Skip buttons
//
// Both portals inherit MUI's ThemeProvider context, so sx props, palette
// colors, and MUI components all work inside driver.js's external DOM.

// Map step indices to React components for custom content
const STEP_COMPONENTS: Record<number, React.ComponentType> = {
  0: WelcomeStep,
};

export default function DriverTour() {
  const theme = useTheme();
  const [portalTarget, setPortalTarget] = useState<PortalTarget | null>(null);

  const { moveTo, nextStep, skipTour } = useDriverTour({
    onPopoverRender: useCallback((target: PortalTarget) => {
      flushSync(() => {
        setPortalTarget(target);
      });
    }, []),
  });

  const { palette, typography, shape } = theme;

  const StepComponent = portalTarget ? STEP_COMPONENTS[portalTarget.stepIndex] : null;

  return (
    <>
      {/* Content portal: custom React component for specific steps */}
      {StepComponent && portalTarget && createPortal(
        <StepComponent />,
        portalTarget.descriptionEl,
      )}

      {/* Footer portal: bubble indicators + OK/Skip on every step */}
      {portalTarget && createPortal(
        <TourFooter
          activeStep={portalTarget.stepIndex}
          totalSteps={TOUR_STEP_COUNT}
          okLabel={TOUR_OK_LABELS[portalTarget.stepIndex] ?? 'OK'}
          onBubbleClick={moveTo}
          onOk={nextStep}
          onSkip={skipTour}
        />,
        portalTarget.footerEl,
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
          // Custom footer container padding
          '.driver-tour-custom-footer': {
            padding: '0 16px 16px !important',
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
    </>
  );
}
