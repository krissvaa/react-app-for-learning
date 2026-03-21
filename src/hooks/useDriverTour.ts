import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { driver, type Driver, type DriveStep, type PopoverDOM } from 'driver.js';
import 'driver.js/dist/driver.css';
import useLocalStorage from './useLocalStorage';

// LEARNING NOTE: Integrating driver.js with React 19 + MUI v5 (Portal pattern)
//
// Challenge: driver.js is an imperative DOM library that creates its own DOM
// outside React's tree. MUI components and sx props can't be used in raw HTML
// strings passed to driver.js's `description` field.
//
// Solution — React Portals:
//   driver.js has an `onPopoverRender` callback that gives us the popover's
//   DOM node. We pass this node back to the React component (DriverTour.tsx)
//   which uses createPortal to render a real React component INTO driver.js's
//   popover. Because portals preserve React's context tree, MUI's ThemeProvider,
//   sx props, and all hooks work inside the popover — even though the DOM node
//   lives outside React's root.
//
// Flow:
//   1. useDriverTour creates the Driver instance with step configs
//   2. Each step's `onPopoverRender` fires when driver.js creates the popover
//   3. The callback receives { stepIndex, descriptionEl } and calls setState
//   4. flushSync forces React to synchronously re-render DriverTour.tsx
//   5. DriverTour uses createPortal to render the React component into descriptionEl
//   6. Result: real MUI components inside driver.js popovers
//
// Why flushSync? React 19 batches all state updates by default — even those
// triggered outside React event handlers (like driver.js callbacks). Without
// flushSync, the portal would render AFTER onPopoverRender returns, causing
// the popover to briefly flash empty. flushSync forces React to process the
// state update and commit the portal to the DOM immediately, before the
// callback returns — so driver.js never shows an empty popover.

const TOUR_VERSION = 1;
const STORAGE_KEY = 'driver_tour_completed';
const DISCLAIMER_KEY = 'disclaimer_acceptance';
const ONBOARDING_KEY = 'onboarding_completed';

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

  useEffect(() => {
    if (isCompleted || !prerequisitesDone) return;

    const timeout = setTimeout(() => {
      const isDark = theme.palette.mode === 'dark';

      // Helper: wraps onPopoverRender to call back with the description element
      const withPortal = (stepIndex: number) => (_popover: PopoverDOM) => {
        // Clear description text — React portal will fill it
        _popover.description.innerHTML = '';
        onPopoverRenderRef.current?.({
          stepIndex,
          descriptionEl: _popover.description,
        });
      };

      const steps: DriveStep[] = [
        {
          // Step 1: No element — centered welcome (rendered via React portal)
          popover: {
            title: 'Welcome to LearnHub!',
            // Must be non-empty so driver.js creates the description DOM element.
            // The portal replaces this content immediately via flushSync.
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
          },
        },
      ];

      driverRef.current = driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        overlayColor: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.5)',
        stagePadding: 8,
        stageRadius: 12,
        popoverClass: `driver-theme-${theme.palette.mode}`,
        nextBtnText: 'Next →',
        prevBtnText: '← Back',
        doneBtnText: "Let's Go!",
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

  return { isCompleted, restartTour };
}
