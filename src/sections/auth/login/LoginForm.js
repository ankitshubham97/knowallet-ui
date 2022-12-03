import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import ShowMoreText from "react-show-more-text";
import { Link, Stack, TextField, FormControl, MenuItem, Select, Checkbox, OutlinedInput, InputLabel, ListItemText, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ToastContainer, toast } from 'material-react-toastify';
import { queryENSForETHAddress } from '../../../stores/ensStore';

import { url } from '../../../constants';
import GetAccount from '../../../hooks/account';
import './result.css';

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

export function LoginForm() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const account = GetAccount();
  const [postForm, setForm] = useState({
    userWalletAddress: "",
    requestorWalletAddress: account.props.children,
    questionId: 1,
    chain: ""
  });

  const [showResult, setShowResult] = useState(false);
  const [variantName, setVariantName] = useState([]);
  const [callData, setCallData] = useState([]);
  const [chainName, setChainName] = useState([]);
  const [contract, setContract] = useState([]);
  const [chainLink, setChainLink] = useState([]);
  const [networkName, setNetworkName] = useState([]);
  const handleSubmit = async (e) => {
    console.log("called here")
    console.log(postForm);
    e.preventDefault();
    try {
      const res = await axios.post(`${url}users/verify`, postForm, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        }
      });
      console.log(res);
      if (res.data.code === 404) {
        toast.info("We have asked the end user for his consent, please wait till the user validates it", { position: toast.POSITION.TOP_CENTER });
        setForm({
          ...postForm,
          userWalletAddress: "",
          requestorWalletAddress: account.props.children,
          questionId: 1,
          chain: ""
        })
      }
      else {
        toast.success("Verification is successful", { position: toast.POSITION.TOP_CENTER });
        setShowResult(true);
        setLink("https://" + chainLink + contract)
      }
    } catch (error) {
      toast.error("Verification is unsuccessful, Please try again", { position: toast.POSITION.TOP_CENTER });
      console.log(error.message);
      setForm({
        ...postForm,
        userWalletAddress: "",
        requestorWalletAddress: account.props.children,
        questionId: 1,
        chain: ""
      })
    }


  };
  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(callData);
  };
  const handleNetworkChange = (event) => {
    setNetworkName(event.target.value);
    setForm({
      ...postForm,
      chain: event.target.value,
    });
  };
  const handleTextChange = (event) => {
    if (event.target.value.startsWith("0x")) {
      setForm({
        ...postForm,
        userWalletAddress: event.target.value,
      });
    } else {
      queryENSForETHAddress(event.target.value).then((address) => {
        setForm({
          ...postForm,
          userWalletAddress: address,
        });
      });
    }
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    console.log(value[0].id);
    setForm({ ...postForm, questionId: value[0].id });
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
            <MenuItem value={"matic"}>Polygon</MenuItem>
            <MenuItem value={"gnosis"}>Gnosis</MenuItem>
            <MenuItem value={"moonbeam"}>Moonbeam</MenuItem>
            <MenuItem value={"cronos"}>Cronos</MenuItem>
            <MenuItem value={"shardeum"}>Shardeum</MenuItem>
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
      <br />
      <br />
      {showResult &&
        <>

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Link to the contract address
          </a>

          <div className="label">
            <Button onClick={handleClick}>
              Copy the call data text
            </Button>
          </div>
          <div className="container">



            <div className="copy-text">
              <ShowMoreText

                lines={3}
                more="Show more"
                less="Show less"
                className="content-css"
                anchorClass="show-more-less-clickable"

                expanded={false}

                truncatedEndingComponent={"... "}
              >
                callData
              </ShowMoreText>

            </div>

          </div>

        </>

      }

    </>
  );
}
