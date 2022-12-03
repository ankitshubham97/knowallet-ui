import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Link, Stack, TextField, FormControl, MenuItem, Select, Checkbox, OutlinedInput, InputLabel, ListItemText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { da } from 'date-fns/locale';

import { ToastContainer, toast } from 'material-react-toastify';
import { url } from '../../../constants';


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


export function MetamaskForm() {

    const [form, showForm] = useState(false);

    useEffect(() => {

        async function fetchData() {
            try {
                const res = await axios.get(`${url}users\0x9dC36499A0aB380eeaC69De651811B68beb0a783`, {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    }
                });

                if (res.data.code === 400) {
                    showForm(true);
                } else {
                    toast.success("You are verified", { position: toast.POSITION.TOP_CENTER });
                    showForm(false);
                }


            } catch (error) {

                toast.error("An error occured", { position: toast.POSITION.TOP_CENTER });
                console.log(error.message);
                showForm(true);
            }
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const navigate = useNavigate();

    const [postMForm, setMForm] = useState({
        walleAddress: "0x9dC36499A0aB380eeaC69De651811B68beb0a783",
        selfieBase64String: "",

    });

    const handleSubmit = async (e) => {
        console.log("called here")
        console.log(postMForm);
        e.preventDefault();
        try {
            console.log("inside this")
            const res = await axios.post(url, postMForm, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                }
            });
            console.log(res);
            if (res.data.code === 500) {
                toast.error("KYC verification failed", { position: toast.POSITION.TOP_CENTER });
                showForm(true);
            } else {
                toast.success("Your account is now KYC verified", { position: toast.POSITION.TOP_CENTER });
                showForm(false);
            }

        } catch (error) {
            toast.error("KYC verification failed", { position: toast.POSITION.TOP_CENTER });
            console.log(error.message);
        }
        console.log("done here")

        //   createPost(postMForm);
    };
    const handleTakePhoto = async (dataUri) => {

        console.log(dataUri);
        setMForm({ ...postMForm, selfieBase64String: dataUri });


    }

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        console.log(base64);
        //   setMForm({ ...postMForm, selfieBase64String: base64 });
        setMForm({ ...postMForm, passportBase64String: base64 });
    };


    return (
        form ?
            <>
                <Stack spacing={3}>

                    <div className="App">

                        <p>Capture image from USB webcamera and upload to form</p>
                        <Camera
                            onTakePhoto={(dataUri) => handleTakePhoto(dataUri)}
                        />
                    </div>

                </Stack>
                <input
                    type="file"
                    label="Image"
                    name="selfieBase64String"
                    accept=".jpeg, .png, .jpg"
                    onChange={(e) => handleFileUpload(e)}
                />


                <Stack direction="row" alignItems="center" sx={{ my: 2 }}>
                    <Checkbox name="remember" label="Remember me" />
                    <Link variant="subtitle2" underline="hover">
                        I agree to the terms and conditions
                    </Link>
                </Stack>


                <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
                    Register for KYC
                </LoadingButton>
            </> :
            <>
                <h1>You are already verified</h1>
            </>
    );
}
