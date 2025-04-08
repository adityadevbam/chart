import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import * as d3 from 'd3';

function Legend({ categories }) {
  const color = d3.scaleOrdinal(d3.schemeCategory10).domain(categories);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
      {categories.map(cat => (
        <Box key={cat} sx={{ display: 'flex', alignItems: 'center', mr: 2, mb: 1 }}>
          {/* Color swatch */}
          <Box sx={{ width: 12, height: 12, backgroundColor: color(cat), mr: 0.5 }} />
          <Typography variant="body2">{cat}</Typography>
        </Box>
      ))}
    </Box>
  );
}

export default Legend;
