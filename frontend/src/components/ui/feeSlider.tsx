import React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { FeeSliderProps } from "@/types";

const marks = [
  { value: 0, label: "0%" },
  { value: 1, label: "1%" },
  { value: 2, label: "2%" },
  { value: 5, label: "5%" },
  { value: 7.5, label: "7.5%" },
  { value: 10, label: "10%" },
];

function valuetext(value: number) {
  return `${value}%`;
}

export default function FeeSlider({ value, setValue }: FeeSliderProps) {
  const handleChange = (_: Event, newValue: number | number[]) => {
    const val = Array.isArray(newValue) ? newValue[0] : newValue;
    setValue(val);
  };

  return (
    <Card
      sx={{
       
        backgroundColor: "transparent", 
        color: "white",
        borderRadius: 0,
        boxShadow: "0",
      }}
      className="w-[400px] xl:w-[500px] "
    >
      <CardContent>
        <Box sx={{ my: 3, color: "white" }}>
          <Slider
            value={value}
            onChange={handleChange}
            getAriaValueText={valuetext}
            valueLabelDisplay="on"
            step={0.5}
            min={0}
            max={10}
            marks={marks}
            sx={{
              color: "#1e90ff", // slider track color
              "& .MuiSlider-thumb": {
                bgcolor: "#1e90ff",
                border: "2px solid white",
              },
              "& .MuiSlider-valueLabel": {
                bgcolor: "#1e90ff",
                color: "white",
              },
              "& .MuiSlider-markLabel": {
                color: "white",
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
