import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import BarChart from './BarChart';
import DonutChart from './DonutChart';
import Legend from './Legend';
import Relation from '../components/Relation'

// Map dataset keys to the JSON field name for category
const categoryFieldMap = {
  'customer-type': 'Cust_Type',
  'account-industry': 'Acct_Industry',
  'team': 'Team',
  'acv-range': 'ACV_Range'
};

function DataCard({ datasetKey, title }) {
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [quarters, setQuarters] = useState([]);

  // Fetch data from the API when the component mounts
  useEffect(() => {
    console.log('hi')
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/${datasetKey}`)
      .then(res => res.json())
      .then(json => {
        const catField = categoryFieldMap[datasetKey];

        // Compute unique categories and quarters from the data
        let cats = Array.from(new Set(json.map(item => item[catField])));
        let qtrs = Array.from(new Set(json.map(item => item.closed_fiscal_quarter)));

        // Sort categories alphabetically by default, with custom ordering for specific cases
        if (datasetKey === 'acv-range') {
          // Sort ACV ranges in logical order of deal size
          const rangeOrder = ['<$20K', '$20K - 50K', '$50K - 100K', '$100K - 200K', '>=$200K'];
          cats.sort((a, b) => rangeOrder.indexOf(a) - rangeOrder.indexOf(b));
        } else {
          cats.sort();
        }

        // Sort quarters chronologically (lexicographically works for format "YYYY-QN")
        qtrs.sort();

        setData(json);
        setCategories(cats);
        setQuarters(qtrs);
      })
      .catch(err => {
        console.error("Failed to fetch data for", datasetKey, err);
      });
  }, [datasetKey]);

  return (
    <Card>
      {/* Card header displays the dataset title (e.g., "Customer Type") */}
      <CardHeader title={title} />
      <CardContent>
        {!data ? (
          // Show a loading state while data is being fetched
          <Box>Loading...</Box>
        ) : (
          // Once data is loaded, render the charts and legend
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              justifyContent: 'space-around', 
              alignItems: 'center', 
              flexWrap: 'wrap',
              gap : 2,
              paddingRight : 4
              // border : '1px solid black'

            }}
          >
          {/* BarChart for ACV by quarter (grouped by category) */}
          <Box sx={{ minWidth: 0, maxWidth: '100%', overflowX: 'auto' , padding : 2}}>
            <BarChart 
              data={data} 
              categories={categories} 
              quarters={quarters} 
              categoryField={categoryFieldMap[datasetKey]} 
              
            />
          </Box>

          {/* DonutChart for overall deal count distribution by category */}
          <Box sx={{ width: { xs: '100%', md : 220 }, flex: '0 0 auto', display : 'flex' ,alignItems: 'center' ,justifyContent: 'center', padding : 4, paddingRight : 3 }}>
            <DonutChart 
              data={data} 
              categories={categories} 
              categoryField={categoryFieldMap[datasetKey]} 
              
            />
          </Box>
        </Box>
        )}

        {/*  Once data is loaded, render the charts and legend */}
        {data && <Legend categories={categories} />}

          {/* Once data is loaded , render the  Relation */}
        {data && <Relation data={data} 
                  categories={categories} 
                  quarters={quarters} 
                  categoryField={categoryFieldMap[datasetKey]} 
                />
        }
      </CardContent>   
    
    </Card>
  );
}

export default DataCard;
