import { useState } from 'react';
import isEmail from 'validator/lib/isEmail';

export default function useRegisterForm(submitHandler, initValues) {
    const [values, setValues] = useState(initValues);
    const [currentPassword, setCurrentPassword] = useState('');

    const onChange = (e) => {
        setValues((state) => ({
            ...state,
            [e.target.name]: e.target.value,
            [e.target['password']]: currentPassword,
        }));

        if (e.target.name === 'username') {
            e.target.value.length > 10 || e.target.value.length < 1
                ? (e.target.style.background = '#ef233c')
                : (e.target.style.background = '#28b487');
        }

        if (e.target.name === 'email') {
            !isEmail(e.target.value)
                ? (e.target.style.background = '#ef233c')
                : (e.target.style.background = '#28b487');
        }
        if (e.target.name === 'password') {
            setCurrentPassword(e.target.value);
            e.target.value.length < 5
                ? (e.target.style.background = '#ef233c')
                : (e.target.style.background = '#28b487');
        }
        if (e.target.name === 'confirmPassword') {
            currentPassword === e.target.value
                ? (e.target.style.background = '#28b487')
                : (e.target.style.background = '#ef233c');
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();

        submitHandler(values);
    };

    return {
        values,
        onChange,
        onSubmit,
    };
}
