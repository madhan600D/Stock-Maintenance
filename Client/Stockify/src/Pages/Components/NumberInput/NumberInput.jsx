import React from "react";
import TextField from "@mui/material/TextField";

const NumberInput = ({
  label = "Number",
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  size = "small",
  fullWidth = true,
  disabled = false,
  sx = {},
}) => {
  const handleChange = (e) => {
    const val = e.target.value === "" ? "" : Number(e.target.value);
    onChange(val);
  };

  return (
    <TextField
      type="number"
      label={label}
      value={value}
      onChange={handleChange}
      variant="outlined"
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      InputLabelProps={{ shrink: true }}
      inputProps={{ min, max, step }}
      sx={{
        "& .MuiInputBase-root": {
          backgroundColor: "#1e1e1e",
          color: "#fff",
          borderRadius: "8px",
        },
        "& .MuiInputLabel-root": {
          color: "#aaa",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#555",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#5A7DC4",
        },
        "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#5A7DC4",
        },
        ...sx,
      }}
    />
  );
};

export default NumberInput;
