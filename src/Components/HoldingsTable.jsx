import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const HoldingsTable = () => {
  const [holdings, setHoldings] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    axios.get('https://canopy-frontend-task.now.sh/api/holdings')
      .then(response => {
        setHoldings(response.data.payload);
      })
      .catch(error => {
        console.error('Error fetching holdings:', error);
      });
  }, []);

  const groupedHoldings = holdings.reduce((acc, holding) => {
    if (!acc[holding.asset_class]) {
      acc[holding.asset_class] = [];
    }
    acc[holding.asset_class].push(holding);
    return acc;
  }, {});

  const toggleGroup = (assetClass) => {
    setExpandedGroups(prevState => ({
      ...prevState,
      [assetClass]: !prevState[assetClass]
    }));
  };

  const getChangeColor = (change) => {
    if (change > 0) {
      return 'green';
    } else if (change < 0) {
      return 'red';
    } else {
      return 'black';
    }
  };

  return (
    <div style={{margin: '20px', padding:'10px', borderRadius: '10px', backgroundColor:'white'}}>
    <div>
      {Object.entries(groupedHoldings).map(([assetClass, holdings]) => (
        <div key={assetClass}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton sx={{ height: '25px', width: '25px', bgcolor: '#703be7', borderRadius: '50%', color: 'white', marginRight: '10px'}} onClick={() => toggleGroup(assetClass)}>
              {expandedGroups[assetClass] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            <h2 style={{textTransform: 'uppercase', color: 'grey',fontWeight: '600' }}>{assetClass} ({holdings.length})</h2>
          </div>
          {expandedGroups[assetClass] && (
            <TableContainer component={Paper} style={{ backgroundColor: 'smokewhite'}}>
              <Table>
                <TableHead style={{textTransform: 'uppercase', backgroundColor: 'aliceblue' }}>
                  <TableRow>
                    <TableCell>Name of The Holding</TableCell>
                    <TableCell>Ticker</TableCell>
                    <TableCell>Average Price</TableCell>
                    <TableCell>Market Price</TableCell>
                    <TableCell>Latest Change Percentage</TableCell>
                    <TableCell>Market Value in Base CCY</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {holdings.map(holding => (
                    <TableRow key={holding.ticker}>
                      <TableCell>{holding.name}</TableCell>
                      <TableCell>{holding.ticker}</TableCell>
                      <TableCell>{holding.avg_price || 'NA'}</TableCell>
                      <TableCell>{holding.market_price || 'NA'}</TableCell>
                      <TableCell style={{ color: getChangeColor(holding.latest_chg_pct), fontWeight: '700' }}>{holding.latest_chg_pct}</TableCell>
                      <TableCell>{holding.market_value_ccy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      ))}
    </div>
    </div>
  );
};

export default HoldingsTable;
