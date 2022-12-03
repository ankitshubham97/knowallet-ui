import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Link, Stack, TextField, FormControl, MenuItem, Select, Checkbox, OutlinedInput, InputLabel, ListItemText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ToastContainer, toast } from 'material-react-toastify';
import { url } from '../../../constants';
import GetAccount from '../../../hooks/account';


import 'material-react-toastify/dist/ReactToastify.css';

toast.configure()
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

  },
  {
    id: 10,
    name: 'Is user from Asia?',
  },
];

export default function LoginForm() {
  const navigate = useNavigate();
  const account = GetAccount();
  console.log("Requester wallet address: ");
  console.log(account.props.children);

  const [postForm, setForm] = useState({
    userWalletAddress: "0x4ad53d31Cb104Cf5f7622f1AF8Ed09C3ca980523",
    requestorWalletAddress: account.props.children,
    questionId: 1,
    chain: ""
  });


  const [variantName, setVariantName] = useState([]);
  const [networkName, setNetworkName] = useState([]);
  const handleSubmit = async (e) => {
    console.log("called here")
    console.log(postForm);
    e.preventDefault();
    try {
      const res = await axios.post(`${url}verify`, postForm, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        }
      });
      console.log(res);
      if (res.data.code === 404) {
        toast.error("Verification is unsuccessful", { position: toast.POSITION.TOP_CENTER });
      }
      else {
        toast.success("Verification is successful", { position: toast.POSITION.TOP_CENTER });
      }
    } catch (error) {
      toast.error("Verification is unsuccessful", { position: toast.POSITION.TOP_CENTER });
      console.log(error.message);
    }


  };
  const handleNetworkChange = (event) => {
    setNetworkName(event.target.value);
    setForm({
      ...postForm,
      network: event.target.value,
    });
  };
  const handleTextChange = (event) => {
    setForm({
      ...postForm,
      walletAddress: event.target.value,
    });
  };
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    console.log(value[0].id);
    setForm({ ...postForm, questionId: value[0].id });

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
        <TextField name="text" label="Wallet address" onChange={handleTextChange} />
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
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Network</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={networkName}
            label="Network"
            onChange={handleNetworkChange}
          >
            <MenuItem value={"Polygon"}>Polygon</MenuItem>
            <MenuItem value={"Gnosis"}>Gnosis</MenuItem>
            <MenuItem value={"moonbeam"}>Moonbeam</MenuItem>
            <MenuItem value={"cronos"}>Cronos</MenuItem>

          </Select>
        </FormControl>
      </Stack>



      <Stack direction="row" alignItems="center" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          I agree to the terms and conditions
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
        Verify
      </LoadingButton>
    </>
  );
}
