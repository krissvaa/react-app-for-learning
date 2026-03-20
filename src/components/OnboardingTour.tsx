import { useState, useRef, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useLocalStorage from '../hooks/useLocalStorage';

// Rick and Morty character images — free, stable URLs from the API
// These are 300x300 character portraits
const IMAGES = {
  rick: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  morty: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
  summer: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
  beth: 'https://rickandmortyapi.com/api/character/avatar/4.jpeg',
  jerry: 'https://rickandmortyapi.com/api/character/avatar/5.jpeg',
};

// LEARNING NOTE: This version adds CSS animations with a pattern called
// "animation key" — we use a `key` prop on the content Box to force React
// to unmount and remount it on every step change. When a new element mounts,
// its CSS @keyframes animation plays from the start.
//
// The slide direction is controlled by changing the animation name:
//   - "Next" → current slides out left, new slides in from right
//
// We use useRef to track whether the content is currently animating (sliding out),
// and only advance the step after the exit animation finishes (onAnimationEnd).

// ---- Configuration ----

const TOUR_VERSION = 1;
const STORAGE_KEY = 'onboarding_completed';
const ANIMATION_DURATION_MS = 300;

// ---- Step content ----

const tourSteps = [
  {
    image: IMAGES.rick,
    title: 'Welcome to the Learning App!',
    description:
      'This app is your playground for learning React, TypeScript, and modern frontend patterns. Let us give you a quick tour of what you can do here.',
  },
  {
    image: IMAGES.morty,
    title: 'Your Dashboard',
    description:
      'The dashboard gives you an overview of your learning resources, bookmarks, and progress. It also includes a live timer and counter — both built as learning exercises for React hooks.',
  },
  {
    image: IMAGES.summer,
    title: 'Learning Resources',
    description:
      'Browse, create, edit, and delete learning resources. This feature demonstrates CRUD operations with RTK Query, form validation, and different view modes (grid and list).',
  },
  {
    image: IMAGES.beth,
    title: 'Rick & Morty Characters',
    description:
      'Explore characters from the Rick and Morty API. This feature showcases server-side pagination, real API integration, image-heavy cards, and skeleton loading states.',
  },
  {
    image: IMAGES.jerry,
    title: 'Filtering, Searching & Navigation',
    description:
      'Use the sidebar to navigate between features. Most pages include search, filters, and sorting. Try the AG-Grid examples for advanced data tables, or check the Settings page for app configuration.',
  },
];

// ---- CSS keyframes (injected once) ----
// LEARNING NOTE: We define CSS @keyframes as a string and inject them into a
// <style> tag via MUI's sx prop GlobalStyles-like pattern. Alternatively you
// could use MUI's keyframes helper, but plain CSS is clearer for learning.

const slideAnimations = `
  @keyframes slideInFromRight {
    from { transform: translateX(100%); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }
  @keyframes slideOutToLeft {
    from { transform: translateX(0);    opacity: 1; }
    to   { transform: translateX(-100%); opacity: 0; }
  }
`;

// ---- Types ----

interface TourCompletion {
  version: number;
  completedAt: string;
}

interface OnboardingTourProps {
  children: React.ReactNode;
}

// ---- Component ----

export default function OnboardingTour({ children }: OnboardingTourProps) {
  const [completion, setCompletion] = useLocalStorage<TourCompletion | null>(
    STORAGE_KEY,
    null,
  );

  const [activeStep, setActiveStep] = useState(0);
  // LEARNING NOTE: "exiting" controls which animation plays.
  // false → slideInFromRight (enter), true → slideOutToLeft (exit)
  const [exiting, setExiting] = useState(false);
  const nextStepRef = useRef<number | null>(null);

  const isCompleted = completion !== null && completion.version >= TOUR_VERSION;
  const isLastStep = activeStep === tourSteps.length - 1;
  const currentStep = tourSteps[activeStep];

  // LEARNING NOTE: useCallback prevents this function from being recreated
  // on every render. It's not strictly necessary here, but good practice
  // when passing callbacks to event handlers in animated components.
  const handleNext = useCallback(() => {
    if (exiting) return; // prevent double-clicks during animation

    if (isLastStep) {
      setCompletion({
        version: TOUR_VERSION,
        completedAt: new Date().toISOString(),
      });
      return;
    }

    // Start exit animation, store which step to go to
    nextStepRef.current = activeStep + 1;
    setExiting(true);
  }, [activeStep, exiting, isLastStep, setCompletion]);

  // Called when exit animation finishes — advance to next step
  const handleExitAnimationEnd = () => {
    if (nextStepRef.current !== null) {
      setActiveStep(nextStepRef.current);
      nextStepRef.current = null;
      setExiting(false); // new step will play enter animation
    }
  };

  if (isCompleted) return <>{children}</>;

  return (
    <>
      {/* Inject keyframe animations */}
      <style>{slideAnimations}</style>

      <Box sx={{ visibility: 'hidden', height: 0, overflow: 'hidden' }}>
        {children}
      </Box>

      <Dialog
        open
        fullWidth
        maxWidth="sm"
        disableEscapeKeyDown
        aria-labelledby="tour-title"
        BackdropProps={{ sx: { backdropFilter: 'blur(4px)' } }}
      >
        <DialogContent sx={{ overflow: 'hidden', minHeight: 250 }}>
          {/* LEARNING NOTE: The `key` prop is the secret to the animation.
              When `key` changes, React unmounts the old Box and mounts a new one.
              The new Box's CSS animation plays from the start.
              When exiting, we use a different key suffix to trigger unmount. */}
          <Box
            key={`step-${activeStep}-${exiting ? 'exit' : 'enter'}`}
            onAnimationEnd={exiting ? handleExitAnimationEnd : undefined}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              py: 3,
              gap: 2,
              animation: `${exiting ? 'slideOutToLeft' : 'slideInFromRight'} ${ANIMATION_DURATION_MS}ms ease-out`,
              animationFillMode: 'forwards',
            }}
          >
            <Box
              component="img"
              src={currentStep.image}
              alt={currentStep.title}
              sx={{ width: 150, height: 150, borderRadius: '50%', objectFit: 'cover' }}
            />
            <Typography variant="h5" fontWeight="bold">
              {currentStep.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
              {currentStep.description}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleNext}
            disabled={exiting}
          >
            {isLastStep ? "Let's Go!" : 'Next'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
