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
    id: 1,
    name: 'Is Age above 18?',

  },
  {
    id: 2,
    name: 'Is user from Asia?',
  },
];

export function LoginForm() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const account = GetAccount();
  const [loading, setLoading] = useState(false);
  const [postForm, setForm] = useState({
    userWalletAddress: "",
    requestorWalletAddress: account.props.children,
    questionId: 1,
    chain: "matic"
  });

  const [showResult, setShowResult] = useState(false);
  const [variantName, setVariantName] = useState([]);
  const [callData, setCallData] = useState("");
  const [chainName, setChainName] = useState("");
  const [contract, setContract] = useState("");
  const [chainLink, setChainLink] = useState("");
  const [networkName, setNetworkName] = useState("matic");
  const [question, setQuestion] = useState(1);
  const [link, setLink] = useState("");
  const renderSwitch = (param) => {
    switch (param) {
      case 'matic':
        return 'https://mumbai.polygonscan.com/address/';
      case 'gnosis':
        return 'https://gnosisscan.io/address/';
      case 'shardeum':
        return 'https://explorer-liberty10.shardeum.org/account/';
      case 'cronos':
        return 'https://testnet.cronoscan.com/address/';
      case 'moonbeam':
        return 'https://moonbase-blockscout.testnet.moonbeam.network/address/';
      default:
        return 'foo';
    }
  }
  const handleSubmit = async (e) => {
    setLoading(true);
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
      if (res.data.code !== 200) {
        toast.error(res.data.error, {
          position: toast.POSITION.TOP_CENTER, className: 'toast-message'
        })
      }
      else {
        toast.success("Verification is successful", { position: toast.POSITION.TOP_CENTER });
        setCallData(res.data.data.calldata);
        setChainName(res.data.data.network);
        setContract(res.data.data.contractAddress);
        const linkTemp = `${renderSwitch(res.data.data.network)}${res.data.data.contractAddress}`;
        setLink(linkTemp);
        console.log(res.data.data.calldata);
        console.log(res.data.data.network);
        console.log(res.data.data.contractAddress);
        setShowResult(true);
        console.log(res.data.data.network);

      }
    } catch (error) {
      toast.error("Verification is unsuccessful, Please try again", { position: toast.POSITION.TOP_CENTER }, {
        style: {
          minWidth: '250px',
        }
      });
      console.log(error.message);
    }
    setLoading(false);

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
  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
    setForm({
      ...postForm,
      questionId: event.target.value,
    });
  };
  const handleTextChange = async (event) => {
    console.log(event.target.value);
    if (event.target.value.endsWith(".eth")) {


      queryENSForETHAddress(event.target.value).then((address) => {
        setForm({
          ...postForm,
          userWalletAddress: address,
        });
      });
    } else if (event.target.value.startsWith("0x")) {
      await setForm({
        ...postForm,
        userWalletAddress: event.target.value,
      });
      console.log("============================")
      console.log(postForm);
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="text" label="Wallet address" onChange={handleTextChange} />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label1">Question</InputLabel>
          <Select
            labelId="demo-simple-select-label1"
            id="demo-simple-select1"
            value={question}
            label="Question"
            onChange={handleQuestionChange}
          >
            <MenuItem value={1}>Is age above 18?</MenuItem>
            <MenuItem value={2}>Is user's country in sanction list</MenuItem>

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
        {loading ? "Loading..." : "Verify"}
      </LoadingButton>
      <br />
      <br />
      {showResult &&
        <>

          <a href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Link to the contract address
          </a>

          <div className="container">



            <div className="copy-text">
              <ShowMoreText

                lines={6}
                more="Show more"
                less="Show less"
                className="content-css"
                anchorClass="show-more-less-clickable"

                expanded={false}

                truncatedEndingComponent={"... "}
              >
                {callData}
              </ShowMoreText>
              <Button onClick={handleClick}>
                Copy
              </Button>
            </div>

          </div>

        </>

      }

    </>
  );
}
