import { useState } from "react";
import { Container, Typography, Box, Paper } from "@mui/material";
import URLForm from "../components/URLForm";
import URLList from "../components/URLList";

export default function Home() {
  const [list, setList] = useState([]);

  const handleNew = (code, url) => {
    setList((prev) => [...prev, [code, url]]);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box className="fade-in" sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h2" className="title" gutterBottom>
          URL Shortener
        </Typography>
        <Typography variant="h6" className="subtitle">
          Create short, memorable links in seconds
        </Typography>
      </Box>
      
      <Paper className="card slide-up" elevation={3}>
        <URLForm onNewLink={handleNew} />
      </Paper>
      
      {list.length > 0 && (
        <Paper className="card slide-up" elevation={3} sx={{ mt: 3 }}>
          <URLList items={list} />
        </Paper>
      )}
    </Container>
  );
}
