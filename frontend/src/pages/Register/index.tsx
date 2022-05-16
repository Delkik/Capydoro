import * as React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { GoogleAuthProvider } from 'firebase/auth';
import capybara from '../../images/capybara-pomo.png';
import { useDispatch } from 'react-redux';
import { signIn, signInUser, signUpUser } from '../../redux/slices/authSlice';
import { useSignUpUserMutation } from '../../redux/apis/authEndpoints';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

const Register = () => {
    const [name, setName] = React.useState("");
    const [displayName, setDisplayName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [signUp] = useSignUpUserMutation();

    const dispatch = useDispatch();

    const signUpWithEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Called")
        try {
            const res = await signUp({ email, password }).unwrap();
            dispatch(signIn(res));
        } catch (err) {
            const error = err as FetchBaseQueryError | SerializedError;

        }
    }

    return (
        <div className='w-full h-screen flex justify-center'>
            <div className='w-full h-fit flex flex-col items-center justify-center p-4 px-8 gap-14 md:max-w-xl'>
                {/* Capybara */}
                <div className='w-full flex justify-center mt-12'>
                    <img src={capybara} alt='A capybara head image' className='w-[40%] max-w-[12rem]' />
                </div>

                {/* Sign up Info */}
                <div className='w-full flex flex-col items-center gap-12'>
                    <div className='w-full flex flex-col gap-4'>
                        <form className='w-full flex flex-col gap-4' onSubmit={signUpWithEmail}>
                            {/* <input className='h-14 outline-none border-2 bg-transparent border-[#292C2D] px-2 text-white placeholder:text-[#4C5053] text-xl'
                            placeholder='Name' type='text' required onChange={(e) => setName(e.currentTarget.value)} />
                        <input className='h-14 outline-none border-2 bg-transparent border-[#292C2D] px-2 text-white placeholder:text-[#4C5053] text-xl'
                            placeholder='Display Name' type='text' required onChange={(e) => setDisplayName(e.currentTarget.value)} /> */}
                            <input className='h-14 outline-none border-2 bg-transparent border-[#292C2D] px-2 text-white placeholder:text-[#4C5053] text-xl'
                                placeholder='Email' type='email' required onChange={(e) => setEmail(e.currentTarget.value)} />
                            <input className='h-14 outline-none border-2 bg-transparent border-[#292C2D] px-2 text-white placeholder:text-[#4C5053] text-xl'
                                placeholder='Password' type='password' required onChange={(e) => setPassword(e.currentTarget.value)} />
                            <input className='w-full h-14 bg-[#2881D9] text-white text-xl font-semibold' type='submit' value={"Sign Up"} />

                        </form>
                    </div>
                </div>

                {/* Other sign in options */}
                <div className='w-full h-full flex flex-col items-center gap-8 pb-16'>
                    <div className='w-full flex items-center gap-2'>
                        <div className='w-full border-t-[1px] border-t-[#707070]' />
                        <p className='w-full text-center text-white'> Or Sign In With </p>
                        <div className='w-full border-t-[1px] border-t-[#707070]' />
                    </div>
                    <button className='flex items-center text-white gap-8 bg-[#0943a2] px-6 py-2'> <FcGoogle size={40} /> Sign up with google </button>
                    <div className='w-full flex gap-4 items-center justify-center mt-auto'>
                        <p className='text-white'> Already have an account? </p>
                        <Link className='text-[#2881D9]' to={'/login'}> Sign In </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;