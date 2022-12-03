import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, Stack, TextField, FormControl, MenuItem, Select, Checkbox, OutlinedInput, InputLabel, ListItemText } from '@mui/material';
import { LoadingButton } from '@mui/lab';


const ITEM_HEIGHT = 52;
const ITEM_PADDING_TOP = 12;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const variants = [
  {
    id: 3,
    name: 'Is Age above 18?',
    cover: null,
  },
  {
    id: 10,
    name: 'Is user from Asia?',
    cover: null,
  },
];

export default function LoginForm() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard', { replace: true });
  };
  const [variantName, setVariantName] = useState([]);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    console.log(value);

    const filterdValue = value.filter(
      (item) => variantName.findIndex((o) => o.id === item.id) >= 0
    );
    let duplicateRemoved = [];

    value.forEach((item) => {
      if (duplicateRemoved.findIndex((o) => o.id === item.id) >= 0) {
        duplicateRemoved = duplicateRemoved.filter((x) => x.id === item.id);
      } else {
        duplicateRemoved.push(item);
      }
    });

    setVariantName(duplicateRemoved);
  };
  return (
    <>
      <Stack spacing={3}>
        <TextField name="text" label="Wallet address" />
        <FormControl sx={{ m: 5, width: 485 }}>
          <InputLabel id="demo-multiple-checkbox-label">Questions</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={variantName}
            onChange={handleChange}
            input={<OutlinedInput label="Questions" />}
            renderValue={(selected) => selected.map((x) => x.name).join(', ')}
            MenuProps={MenuProps}
          >
            {variants.map((variant) => (
              <MenuItem key={variant.id} value={variant}>
                <Checkbox
                  checked={
                    variantName.findIndex((item) => item.id === variant.id) >= 0
                  }
                />
                <ListItemText primary={variant.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>


      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          I agree the terms and conditions
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Verify
      </LoadingButton>
    </>
  );
}
