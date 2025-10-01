import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const marks = [
  { value: 0, label: '0%' },
  { value: 1, label: '1%' },
  { value: 2, label: '2%' },
  { value: 5, label: '5%' },
  { value: 7.5, label: '7.5%' },
  { value: 10, label: '10%' },
];

function valuetext(value: number) {
  return `${value}%`;
}

export default function FeeSlider() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: Event, newValue: number | number[]) => {
    const val = Array.isArray(newValue) ? newValue[0] : newValue;
    setValue(val);
  };

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        value={value}
        onChange={handleChange}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        step={0.5}        
        min={0}
        max={10}
        marks={marks}
      />
    </Box>
  );
}
