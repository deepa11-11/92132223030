import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Button, 
  Paper
} from "@mui/material";
import { 
  Error as ErrorIcon, 
  AccessTime as ExpiredIcon,
  Home as HomeIcon 
} from "@mui/icons-material";
import { getFromStorage } from "../dataModel";
import { logEvent } from "../utils/logger";

export default function RedirectHandler() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, not-found, expired, redirecting
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Simulate a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const data = getFromStorage(code);
        
        if (!data) {
          setStatus("not-found");
          setErrorMessage("This short link doesn't exist or has been removed.");
          logEvent("404", { code });
          return;
        }

        const isExpired = new Date(data.expireAt) < new Date();
        if (isExpired) {
          setStatus("expired");
          setErrorMessage("This link has expired and is no longer available.");
          logEvent("Link expired", { code });
          return;
        }

        // Log the redirect
        logEvent("Redirect", { code, to: data.url });
        
        // Set status to redirecting
        setStatus("redirecting");
        
        // Redirect after a brief moment
        setTimeout(() => {
          window.location.href = data.url;
        }, 1500);
        
      } catch (error) {
        console.error("Redirect error:", error);
        setStatus("not-found");
        setErrorMessage("An error occurred while processing the link.");
      }
    };

    handleRedirect();
  }, [code]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Processing your link...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please wait while we redirect you to your destination.
            </Typography>
          </Box>
        );

      case "redirecting":
        return (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Redirecting...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You will be redirected to your destination shortly.
            </Typography>
          </Box>
        );

      case "not-found":
        return (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
            <Typography variant="h4" gutterBottom color="error.main">
              Link Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {errorMessage}
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
              size="large"
            >
              Go Home
            </Button>
          </Box>
        );

      case "expired":
        return (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ExpiredIcon sx={{ fontSize: 80, color: 'warning.main', mb: 3 }} />
            <Typography variant="h4" gutterBottom color="warning.main">
              Link Expired
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {errorMessage}
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
              size="large"
            >
              Create New Link
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--gradient-primary)',
        p: 3
      }}
    >
      <Paper 
        elevation={8}
        sx={{ 
          maxWidth: 500,
          width: '100%',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        {renderContent()}
      </Paper>
    </Box>
  );
}
