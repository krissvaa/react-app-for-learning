import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// LEARNING NOTE: Custom footer for driver.js tour steps
//
// Layout: [ Skip ] ··●·· [ OK ]
//   - Skip on the left, bubbles centered, OK on the right
//   - okLabel is configurable per step via props

interface TourFooterProps {
  activeStep: number;
  totalSteps: number;
  okLabel: string;
  onBubbleClick: (index: number) => void;
  onOk: () => void;
  onSkip: () => void;
}

export default function TourFooter({
  activeStep,
  totalSteps,
  okLabel,
  onBubbleClick,
  onOk,
  onSkip,
}: TourFooterProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', pt: 2 }}>
      {/* Skip — left */}
      <Button
        variant="outlined"
        size="small"
        color="inherit"
        onClick={onSkip}
        sx={{ color: 'text.secondary', borderColor: 'divider', flexShrink: 0 }}
      >
        Skip
      </Button>

      {/* Bubble indicators — centered */}
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flex: 1 }}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <Tooltip key={i} title={`Step ${i + 1}`} arrow>
            <IconButton
              onClick={() => onBubbleClick(i)}
              size="small"
              sx={{
                width: 14,
                height: 14,
                p: 0,
                borderRadius: '50%',
                backgroundColor: i === activeStep ? 'primary.main' : 'action.disabled',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: i === activeStep ? 'primary.dark' : 'action.active',
                  transform: 'scale(1.3)',
                },
              }}
            />
          </Tooltip>
        ))}
      </Box>

      {/* OK — right */}
      <Button
        variant="contained"
        size="small"
        onClick={onOk}
        sx={{ flexShrink: 0 }}
      >
        {okLabel}
      </Button>
    </Box>
  );
}
