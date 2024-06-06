import React, { useState } from 'react';
import { TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { DataOption } from '../constants/DataOptionEnum';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [option, setOption] = useState(0);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(query, option);
    }
  };

  const handleOptionChange = (event) => {
    setOption(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120, marginBottom: 2 }}>
      <TextField
        sx={{ width: '80%' }}
        variant="outlined"
        label="Customer search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <FormControl
        sx={{ width: '20%' }}
      >
        <InputLabel>Option</InputLabel>
        <Select
          value={option}
          label="Option"
          onChange={handleOptionChange}
        >
          <MenuItem value={0}>None</MenuItem>
          <MenuItem value={DataOption.Diff_lower_zero}>Difference lower than 0</MenuItem>
          <MenuItem value={DataOption.Diff_equal_zero}>Difference equal 0</MenuItem>
          <MenuItem value={DataOption.Diff_greater_zero}>Difference greater than 0</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SearchBar;
