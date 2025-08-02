import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Chip,
  Tooltip,
  Paper
} from "@mui/material";
import { 
  ContentCopy as CopyIcon, 
  OpenInNew as OpenIcon,
  Link as LinkIcon 
} from "@mui/icons-material";
import { useState } from "react";

export default function URLList({ items }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const openUrl = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <LinkIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No shortened URLs yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first short link above to see it here
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <LinkIcon sx={{ fontSize: 28 }} />
        Your Shortened URLs
      </Typography>
      
      <List sx={{ p: 0 }}>
        {items.map(([code, url], index) => {
          const shortUrl = `${window.location.origin}/${code}`;
          
          return (
            <Paper 
              key={code} 
              elevation={1} 
              sx={{ 
                mb: 2, 
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                '&:hover': {
                  elevation: 3,
                  transform: 'translateY(-1px)'
                }
              }}
            >
              <ListItem sx={{ py: 2 }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontFamily: 'JetBrains Mono',
                          color: 'primary.main',
                          fontWeight: 600
                        }}
                      >
                        {shortUrl}
                      </Typography>
                      <Chip 
                        label="Active" 
                        size="small" 
                        color="success" 
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          wordBreak: 'break-all',
                          fontFamily: 'JetBrains Mono',
                          fontSize: '0.875rem'
                        }}
                      >
                        {url}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ mt: 0.5, display: 'block' }}
                      >
                        Created: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                      </Typography>
                    </Box>
                  }
                />
                
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Copy short URL">
                      <IconButton
                        onClick={() => copyToClipboard(shortUrl, index)}
                        color={copiedIndex === index ? "success" : "primary"}
                        size="small"
                      >
                        <CopyIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Open original URL">
                      <IconButton
                        onClick={() => openUrl(url)}
                        color="primary"
                        size="small"
                      >
                        <OpenIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          );
        })}
      </List>
      
      {copiedIndex !== null && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Chip 
            label="Copied to clipboard!" 
            color="success" 
            variant="filled"
            size="small"
          />
        </Box>
      )}
    </Box>
  );
}
