import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import DataCard from './components/DataCard';

function App() {
  // Define the datasets to display, with keys matching API endpoints
  const datasets = [
    { key: 'customer-type',     title: 'Customer Type' },
    { key: 'account-industry',  title: 'Account Industry' },
    { key: 'team',              title: 'Team' },
    { key: 'acv-range',         title: 'ACV Range' }
  ];

  return (
    <Container maxWidth="lg" sx={{ padding: '2rem 0' }}>
      <Grid container spacing={3}>
        {datasets.map(ds => (
          <Grid item xs={12} md={12} key={ds.key}>
            {/* Each DataCard fetches data and renders the charts for one dataset */}
            <DataCard datasetKey={ds.key} title={ds.title} />
          </Grid>
        ))}
      </Grid>

    </Container>
  );
}

export default App;
