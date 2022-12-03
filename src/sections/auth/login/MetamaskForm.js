import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Link, Stack, TextField, FormControl, MenuItem, Select, Checkbox, OutlinedInput, InputLabel, ListItemText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { CameraFeed } from '../../CameraFeed/CameraFeed';

import '../../CameraFeed/camera.css';

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

    const url = "http://ec2-13-233-6-217.ap-south-1.compute.amazonaws.com:3000/users";

    const createPost = async (post) => {
        try {
            const res = await axios.post(url, post, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                }
            });
            console.log(res);
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createPost(postMForm);
    };

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
        setMForm({ ...postMForm, selfieBase64String: base64 });
        setMForm({ ...postMForm, passportBase64String: base64 });
    };

    // const handleClick = () => {
    //     navigate('/dashboard', { replace: true });
    // };
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

                <TextField name="text" label="Name" />
                <TextField name="text" label="Age" />
                <TextField name="text" label="DOB" />

            </Stack>

            <div className="App">
                <h1>Image capture test</h1>
                <p>Capture image from USB webcamera and upload to form</p>

            </div>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                <Checkbox name="remember" label="Remember me" />
                <Link variant="subtitle2" underline="hover">
                    I agree the terms and conditions
                </Link>
            </Stack>
            <input
                type="file"
                label="Image"
                name="selfieBase64String"
                accept=".jpeg, .png, .jpg"
                onChange={(e) => handleFileUpload(e)}
            />


            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
                Submit Details for KYC
            </LoadingButton>
        </>
    );
}
