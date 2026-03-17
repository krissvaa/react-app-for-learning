import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import useLocalStorage from '../hooks/useLocalStorage';

// LEARNING NOTE: Enterprise-grade improvements over the basic version:
//
// 1. VERSIONED DISCLAIMER — bump DISCLAIMER_VERSION when content changes.
//    Users who accepted v1 will see the dialog again for v2.
//    This is how real apps handle updated Terms of Service.
//
// 2. CUSTOM HOOK — useLocalStorage handles errors (private browsing, storage full),
//    is type-safe, and is reusable across the app.
//
// 3. SEPARATED CONTENT — disclaimerContent is a plain data object, not embedded in JSX.
//    A non-developer (legal team) could maintain it, or it could come from a CMS/API.
//
// 4. ACCEPTANCE METADATA — we store when the user accepted (timestamp + version),
//    not just a boolean. Useful for auditing and compliance.
//
// 5. ACCESSIBILITY — proper aria-labelledby/describedby, role="alertdialog", autoFocus.

// ---- Configuration ----

const DISCLAIMER_VERSION = 1; // Bump this when disclaimer content changes
const STORAGE_KEY = 'disclaimer_acceptance';

// ---- Content (separated from presentation) ----

const disclaimerContent = {
  title: 'Disclaimer',
  heading: 'Data Safety & Privacy Notice',
  paragraphs: [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
     tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
     quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
    `Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
     eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
     sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    `Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius,
     turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis
     sollicitudin mauris. Integer in mauris eu nibh euismod gravida.`,
  ],
  acknowledgements: [
    'This is a proof-of-concept application for learning purposes only',
    'No real personal data is collected or stored',
    'Data shown is fetched from public demo APIs',
    'This application is not intended for production use',
  ],
  acceptLabel: 'Yeah, OK, Go for it!',
};

// ---- Types ----

interface DisclaimerAcceptance {
  version: number;
  acceptedAt: string; // ISO timestamp
}

// ---- Component ----
// LEARNING NOTE: This uses the "preload" pattern — children are ALWAYS mounted
// (so the app loads, API calls fire, etc.), but hidden with visibility: hidden
// until the user accepts. Once accepted, the dialog disappears and children
// become visible instantly — no loading delay.
//
// Three approaches compared:
//   1. Gate pattern:     children not mounted until accepted (previous version)
//   2. Overlay pattern:  children mounted & visible, dialog on top (first version)
//   3. Preload pattern:  children mounted but hidden, revealed on accept (this version)
//
// Preload is best when you want instant app readiness without the user
// being able to see or interact with the app before accepting.

interface DisclaimerDialogProps {
  children: React.ReactNode;
}

export default function DisclaimerDialog({ children }: DisclaimerDialogProps) {
  const [acceptance, setAcceptance] = useLocalStorage<DisclaimerAcceptance | null>(
    STORAGE_KEY,
    null,
  );

  const isAccepted = acceptance !== null && acceptance.version >= DISCLAIMER_VERSION;

  const handleAccept = () => {
    setAcceptance({
      version: DISCLAIMER_VERSION,
      acceptedAt: new Date().toISOString(),
    });
  };

  return (
    <>
      {/* Children always mount, but are hidden + non-interactive until accepted */}
      <Box sx={isAccepted ? undefined : { visibility: 'hidden', height: 0, overflow: 'hidden' }}>
        {children}
      </Box>

      {!isAccepted && (
        <Dialog
      open
      fullWidth
      maxWidth="sm"
      role="alertdialog"
      aria-labelledby="disclaimer-title"
      aria-describedby="disclaimer-content"
      disableEscapeKeyDown
      slotProps={{ backdrop: { sx: { backdropFilter: 'blur(4px)' } } }}
    >
      <DialogTitle id="disclaimer-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningAmberIcon color="warning" />
        {disclaimerContent.title}
      </DialogTitle>

      <Divider />

      <DialogContent id="disclaimer-content">
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          {disclaimerContent.heading}
        </Typography>

        {disclaimerContent.paragraphs.map((text, i) => (
          <Typography key={i} variant="body2" color="text.secondary" paragraph>
            {text}
          </Typography>
        ))}

        <Box sx={{ bgcolor: 'action.hover', borderRadius: 1, p: 2, mt: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            By proceeding, you acknowledge that:
          </Typography>
          <Typography variant="body2" color="text.secondary" component="ul" sx={{ mt: 1, pl: 2 }}>
            {disclaimerContent.acknowledgements.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </Typography>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleAccept}
          autoFocus
        >
          {disclaimerContent.acceptLabel}
        </Button>
      </DialogActions>
    </Dialog>
      )}
    </>
  );
}
