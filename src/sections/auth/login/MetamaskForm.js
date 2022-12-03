import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Link, Stack, TextField, FormControl, MenuItem, Select, Checkbox, OutlinedInput, InputLabel, ListItemText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Camera from 'react-html5-camera-photo';

import 'react-html5-camera-photo/build/css/index.css';
import { da } from 'date-fns/locale';

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

export function MetamaskForm() {
    const navigate = useNavigate();

    const [postMForm, setMForm] = useState({
        walleAddress: "0x9dC36499A0aB380eeaC69De651811B68beb0a783",
        selfieBase64String: "",

    });

    const url = "https://api.app.knowallet.xyz/users/";

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
        } catch (error) {
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


            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                <Checkbox name="remember" label="Remember me" />
                <Link variant="subtitle2" underline="hover">
                    I agree the terms and conditions
                </Link>
            </Stack>


            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
                Submit Details for KYC
            </LoadingButton>
        </>
    );
}
