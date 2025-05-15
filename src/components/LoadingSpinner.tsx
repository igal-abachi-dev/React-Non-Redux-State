import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSpinnerState } from '../context/SpinnerContext';

interface LoadingSpinnerProps {
  spinnerSize?: number;
  backgroundColor?: string;
  zIndex?: number;
  slowThresholdMs?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  spinnerSize = 60,
  backgroundColor = 'rgba(0,0,0,0.1)',
  zIndex = 9999,
  slowThresholdMs = 5000,
}) => {
  const { loading, pendingCount } = useSpinnerState();
  const [showSlowMsg, setShowSlowMsg] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (loading) {
      timer = setTimeout(() => setShowSlowMsg(true), slowThresholdMs);
    } else {
      setShowSlowMsg(false);
    }
    return () => clearTimeout(timer);
  }, [loading, slowThresholdMs]);

  if (!loading) return null;

  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: backgroundColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex,
      }}
    >
      <CircularProgress size={spinnerSize} aria-label="Loading" />
      {pendingCount > 1 && (
        <Typography sx={{ mt: 2 }}>
          Processing {pendingCount} requests…
        </Typography>
      )}
      {showSlowMsg && (
        <Typography sx={{ mt: 1, color: 'text.secondary' }}>
          This is taking longer than expected…
        </Typography>
      )}
    </Box>
  );
};