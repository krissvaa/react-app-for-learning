import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';

// LEARNING NOTE: This is a real React component rendered inside driver.js
// via createPortal. Because portals preserve the React context tree, this
// component has full access to MUI's ThemeProvider — so sx props, palette
// colors, and all MUI components work exactly as they do in the rest of the app.
//
// Compare this with the raw HTML string approach: that required manually
// injecting palette values into inline styles. Here we just use MUI normally.

export default function WelcomeStep() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, py: 1 }}>
      <Avatar
        src="https://rickandmortyapi.com/api/character/avatar/1.jpeg"
        alt="Welcome"
        sx={{
          width: 120,
          height: 120,
          border: 3,
          borderColor: 'primary.main',
        }}
      />

      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
        Welcome to <strong>LearnHub</strong> — your playground for learning React 19,
        TypeScript, and modern frontend patterns.
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
        This guided tour will walk you through the key areas of the app.
        Each section demonstrates a different real-world pattern you can learn from.
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
        Ready? Let's take a quick look around and see what's inside!
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Chip label="React 19" size="small" color="primary" sx={{ fontWeight: 600 }} />
        <Chip label="MUI v5" size="small" color="secondary" sx={{ fontWeight: 600 }} />
        <Chip label="TypeScript" size="small" color="warning" sx={{ fontWeight: 600 }} />
      </Box>
    </Box>
  );
}
