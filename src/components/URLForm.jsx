import { useState } from "react";
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  IconButton, 
  Tooltip,
  Alert,
  Snackbar
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, ContentCopy as CopyIcon } from "@mui/icons-material";
import { nanoid } from "nanoid";
import { isValidUrl, isValidShortcode } from "../utils/validate";
import { saveToStorage, isShortcodeTaken } from "../dataModel";
import { logEvent } from "../utils/logger";

export default function URLForm({ onNewLink }) {
  const [inputs, setInputs] = useState([{ url: "", validity: "30", shortcode: "" }]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const addField = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { url: "", validity: "30", shortcode: "" }]);
    }
  };

  const removeField = (index) => {
    if (inputs.length > 1) {
      setInputs(inputs.filter((_, i) => i !== index));
    }
  };

  const generateShortcode = (index) => {
    const newShortcode = nanoid(6);
    handleChange(index, "shortcode", newShortcode);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = () => {
    let hasErrors = false;
    const validInputs = [];

    inputs.forEach((input, index) => {
      const { url, validity, shortcode } = input;
      
      if (!url.trim()) {
        showSnackbar(`Please enter a URL for field ${index + 1}`, "error");
        hasErrors = true;
        return;
      }

      if (!isValidUrl(url)) {
        showSnackbar(`Invalid URL format in field ${index + 1}`, "error");
        hasErrors = true;
        return;
      }

      let finalCode = shortcode || nanoid(6);
      
      if (shortcode && !isValidShortcode(shortcode)) {
        showSnackbar(`Invalid shortcode format in field ${index + 1}`, "error");
        hasErrors = true;
        return;
      }

      if (isShortcodeTaken(finalCode)) {
        showSnackbar(`Shortcode "${finalCode}" is already taken`, "error");
        hasErrors = true;
        return;
      }

      validInputs.push({ url, validity, finalCode });
    });

    if (hasErrors) return;

    // Process all valid inputs
    validInputs.forEach(({ url, validity, finalCode }) => {
      const expireTime = new Date(Date.now() + (parseInt(validity) * 60000)).toISOString();
      const entry = { 
        url, 
        createdAt: new Date().toISOString(), 
        expireAt: expireTime 
      };

      saveToStorage(finalCode, entry);
      logEvent("Shortcode created", { finalCode, url, expireTime });
      onNewLink(finalCode, url);
    });

    showSnackbar(`${validInputs.length} URL${validInputs.length > 1 ? 's' : ''} shortened successfully!`);
    setInputs([{ url: "", validity: "30", shortcode: "" }]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'text.primary' }}>
        Create Short Links
      </Typography>
      
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {inputs.map((input, index) => (
          <Box 
            key={index} 
            sx={{ 
              p: 3, 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: 2,
              backgroundColor: 'background.paper',
              position: 'relative'
            }}
          >
            <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Original URL"
                value={input.url}
                onChange={(e) => handleChange(index, "url", e.target.value)}
                fullWidth
                placeholder="https://example.com/very-long-url"
                variant="outlined"
                size="medium"
              />
            </Box>
            
            <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Validity (minutes)"
                value={input.validity}
                onChange={(e) => handleChange(index, "validity", e.target.value)}
                type="number"
                sx={{ minWidth: 150 }}
                variant="outlined"
                size="medium"
              />
              
              <TextField
                label="Custom Shortcode (optional)"
                value={input.shortcode}
                onChange={(e) => handleChange(index, "shortcode", e.target.value)}
                sx={{ minWidth: 200 }}
                variant="outlined"
                size="medium"
                placeholder="my-link"
              />
              
              <Tooltip title="Generate random shortcode">
                <IconButton 
                  onClick={() => generateShortcode(index)}
                  sx={{ alignSelf: 'center' }}
                >
                  <CopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            {inputs.length > 1 && (
              <Tooltip title="Remove this field">
                <IconButton 
                  onClick={() => removeField(index)}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        ))}
        
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: 'wrap' }}>
          {inputs.length < 5 && (
            <Button 
              variant="outlined" 
              onClick={addField}
              startIcon={<AddIcon />}
              className="btn-secondary"
            >
              Add Another URL
            </Button>
          )}
          
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            className="btn-primary"
            size="large"
            sx={{ minWidth: 150 }}
          >
            Create Short Links
          </Button>
        </Box>
      </Box>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
