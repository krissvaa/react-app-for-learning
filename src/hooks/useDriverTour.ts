import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { driver, type Driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import useLocalStorage from './useLocalStorage';

// LEARNING NOTE: Integrating driver.js with React 19 + MUI v5
//
// Challenge: driver.js is an imperative DOM library — it creates overlays,
// highlights, and popovers by directly manipulating the DOM. React 19 manages
// the DOM via its virtual DOM reconciler. These two approaches can conflict.
//
// Solution:
//   1. useRef to hold the Driver instance — prevents React from recreating it
//   2. useEffect for lifecycle — start the tour after React has mounted the DOM,
//      clean up (destroy) when the component unmounts
//   3. MUI theme integration — read palette values via useTheme() and pass them
//      as driver.js popover styles, so the tour matches the app's look & feel
//   4. localStorage gating — only show the tour once per version (same pattern
//      as DisclaimerDialog and OnboardingTour)

const TOUR_VERSION = 1;
const STORAGE_KEY = 'driver_tour_completed';

interface TourCompletion {
  version: number;
  completedAt: string;
}

export default function useDriverTour() {
  const theme = useTheme();
  const driverRef = useRef<Driver | null>(null);
  const [completion, setCompletion] = useLocalStorage<TourCompletion | null>(
    STORAGE_KEY,
    null,
  );

  const isCompleted = completion !== null && completion.version >= TOUR_VERSION;

  const markCompleted = useCallback(() => {
    setCompletion({
      version: TOUR_VERSION,
      completedAt: new Date().toISOString(),
    });
  }, [setCompletion]);

  useEffect(() => {
    if (isCompleted) return;

    // Wait for the DOM to be fully rendered before starting the tour.
    // React 19 batches state updates and may defer paints — a short
    // timeout ensures layout elements (sidebar, header) are in the DOM.
    const timeout = setTimeout(() => {
      const isDark = theme.palette.mode === 'dark';

      const steps: DriveStep[] = [
        {
          // Step 1: No element — centered welcome popover
          popover: {
            title: 'Welcome to LearnHub! 👋',
            description:
              'This interactive tour will walk you through the key areas of the app. Let\'s take a quick look around!',
            align: 'center',
          },
        },
        {
          // Step 2: Sidebar navigation
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
          // Step 3: Main content area
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
          // Step 4: Theme toggle
          element: '#tour-theme-toggle',
          popover: {
            title: 'Theme Toggle',
            description:
              'Switch between light and dark mode. This uses a custom React Context with MUI\'s ThemeProvider — a common pattern in MUI v5 apps.',
            side: 'bottom',
            align: 'end',
          },
        },
        {
          // Step 5: User avatar / header actions
          element: '#tour-avatar',
          popover: {
            title: 'Your Profile',
            description:
              'This is where user settings and profile info would live in a production app. For now, it\'s a placeholder — but the layout is ready!',
            side: 'bottom',
            align: 'end',
          },
        },
      ];

      // Create a driver instance styled to match the MUI theme
      driverRef.current = driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        overlayColor: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.5)',
        stagePadding: 8,
        stageRadius: 12, // match MUI's shape.borderRadius
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
  }, [isCompleted, theme.palette.mode, markCompleted]);

  // Allow manual restart of the tour
  const restartTour = useCallback(() => {
    setCompletion(null);
  }, [setCompletion]);

  return { isCompleted, restartTour };
}
