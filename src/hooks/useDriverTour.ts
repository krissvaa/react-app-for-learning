import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { driver, type Driver, type DriveStep, type PopoverDOM } from 'driver.js';
import 'driver.js/dist/driver.css';
import useLocalStorage from './useLocalStorage';

// LEARNING NOTE: Integrating driver.js with React 19 + MUI v5 (Portal pattern)
//
// We take over driver.js's UI entirely:
//   - Built-in prev/next buttons, progress text, and close button are hidden
//   - A custom React footer (TourFooter) with bubble indicators + OK/Skip
//     is portaled into every step's popover via onPopoverRender
//   - allowClose: false prevents overlay clicks and escape from dismissing
//   - The only way to close is via our OK (advance) or Skip (exit) buttons
//
// The hook exposes imperative methods (moveTo, nextStep, skipTour) so the
// portaled footer component can control the driver instance.

const TOUR_VERSION = 1;
const STORAGE_KEY = 'driver_tour_completed';
const DISCLAIMER_KEY = 'disclaimer_acceptance';
const ONBOARDING_KEY = 'onboarding_completed';

export const TOUR_STEP_COUNT = 5;

// Per-step OK button labels — customizable for each step
export const TOUR_OK_LABELS: string[] = [
  'Get Started',   // Step 1: Welcome
  'Got it',        // Step 2: Sidebar
  'Nice',          // Step 3: Main content
  'Cool',          // Step 4: Theme toggle
  "Let's Go!",     // Step 5: Profile (last step)
];

interface TourCompletion {
  version: number;
  completedAt: string;
}

interface VersionedRecord {
  version: number;
}

export interface PortalTarget {
  stepIndex: number;
  descriptionEl: Element;
  footerEl: Element;
}

interface UseDriverTourOptions {
  onPopoverRender?: (target: PortalTarget) => void;
}

export default function useDriverTour({ onPopoverRender }: UseDriverTourOptions = {}) {
  const theme = useTheme();
  const driverRef = useRef<Driver | null>(null);
  const onPopoverRenderRef = useRef(onPopoverRender);
  onPopoverRenderRef.current = onPopoverRender;

  const [completion, setCompletion] = useLocalStorage<TourCompletion | null>(
    STORAGE_KEY,
    null,
  );

  const [disclaimerAcceptance] = useLocalStorage<VersionedRecord | null>(DISCLAIMER_KEY, null);
  const [onboardingCompletion] = useLocalStorage<VersionedRecord | null>(ONBOARDING_KEY, null);

  const prerequisitesDone = disclaimerAcceptance !== null && onboardingCompletion !== null;
  const isCompleted = completion !== null && completion.version >= TOUR_VERSION;

  const markCompleted = useCallback(() => {
    setCompletion({
      version: TOUR_VERSION,
      completedAt: new Date().toISOString(),
    });
  }, [setCompletion]);

  // Imperative controls exposed to the portal footer component
  const moveTo = useCallback((index: number) => {
    driverRef.current?.moveTo(index);
  }, []);

  const nextStep = useCallback(() => {
    if (!driverRef.current?.isActive()) return;
    if (!driverRef.current.hasNextStep()) {
      // Last step — finish the tour
      driverRef.current.destroy();
    } else {
      driverRef.current.moveNext();
    }
  }, []);

  const skipTour = useCallback(() => {
    driverRef.current?.destroy();
  }, []);

  useEffect(() => {
    if (isCompleted || !prerequisitesDone) return;

    const timeout = setTimeout(() => {
      const isDark = theme.palette.mode === 'dark';

      // Every step gets onPopoverRender so we can portal the custom footer.
      // We hide the built-in footer and inject a container div for our portal.
      const withPortal = (stepIndex: number) => (_popover: PopoverDOM) => {
        // Hide driver.js's built-in navigation and close button
        _popover.footer.style.display = 'none';
        _popover.wrapper.querySelector('.driver-popover-close-btn')?.remove();

        // Create a container for our React portal footer
        const footerEl = document.createElement('div');
        footerEl.className = 'driver-tour-custom-footer';
        _popover.wrapper.appendChild(footerEl);

        onPopoverRenderRef.current?.({
          stepIndex,
          descriptionEl: _popover.description,
          footerEl,
        });
      };

      const steps: DriveStep[] = [
        {
          popover: {
            title: 'Welcome to LearnHub!',
            description: '\u00A0',
            align: 'center',
            onPopoverRender: withPortal(0),
          },
        },
        {
          element: '#tour-sidebar-nav',
          popover: {
            title: 'Sidebar Navigation',
            description:
              'Use the sidebar to jump between features — Dashboard, Resources, Characters, and more. Each page demonstrates different React patterns.',
            side: 'right',
            align: 'start',
            onPopoverRender: withPortal(1),
          },
        },
        {
          element: '#tour-main-content',
          popover: {
            title: 'Main Content Area',
            description:
              'This is where each feature renders. Try the Dashboard for hooks demos, Resources for CRUD with RTK Query, or Characters for API pagination.',
            side: 'left',
            align: 'start',
            onPopoverRender: withPortal(2),
          },
        },
        {
          element: '#tour-theme-toggle',
          popover: {
            title: 'Theme Toggle',
            description:
              "Switch between light and dark mode. This uses a custom React Context with MUI's ThemeProvider — a common pattern in MUI v5 apps.",
            side: 'bottom',
            align: 'end',
            onPopoverRender: withPortal(3),
          },
        },
        {
          element: '#tour-avatar',
          popover: {
            title: 'Your Profile',
            description:
              "This is where user settings and profile info would live in a production app. For now, it's a placeholder — but the layout is ready!",
            side: 'bottom',
            align: 'end',
            onPopoverRender: withPortal(4),
          },
        },
      ];

      driverRef.current = driver({
        showProgress: false,
        showButtons: [],       // hide all built-in buttons
        animate: true,
        allowClose: false,     // no overlay click, no escape key
        overlayColor: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.5)',
        stagePadding: 8,
        stageRadius: 12,
        popoverClass: `driver-theme-${theme.palette.mode}`,
        steps,
        onDestroyed: () => {
          markCompleted();
        },
      });

      driverRef.current.drive();
    }, 500);

    return () => {
      clearTimeout(timeout);
      if (driverRef.current) {
        driverRef.current.destroy();
        driverRef.current = null;
      }
    };
  }, [isCompleted, prerequisitesDone, theme.palette.mode, markCompleted]);

  const restartTour = useCallback(() => {
    setCompletion(null);
  }, [setCompletion]);

  return { isCompleted, restartTour, moveTo, nextStep, skipTour };
}
