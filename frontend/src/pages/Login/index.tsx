import * as React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleAuthProvider } from 'firebase/auth';
import capybara from '../../images/capybara-pomo.png';
import { useDispatch, useSelector } from 'react-redux';
import { googleSignIn, signIn, signInUser } from '../../redux/slices/authSlice';
import { IRootState } from '../../redux/store';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useSignInUserMutation, useSignInWithGoogleMutation, useSignUpUserMutation } from '../../redux/apis/authEndpoints';

const Login = () => {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [register, setRegister] = React.useState(false);

    const [noUserError, setNoUserError] = React.useState("");

    const [login, data] = useSignInUserMutation();
    const [googleLogin, googleLoginData] = useSignInWithGoogleMutation();
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

    const signInWithEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(signIn(res))

        } catch (err) {
            const error = err as FetchBaseQueryError | SerializedError
            console.log(err)
        }
    }

    const signInWithGoogle = async () => {
        try {
            const res = await googleLogin().unwrap();
            dispatch(signIn(res));
        } catch (err) {
            const error = err as FetchBaseQueryError | SerializedError;

        }

    }

    React.useEffect(() => {
        console.log(data)
        if (data.error !== undefined) {
            setNoUserError('Invalid email or password');
        }
    }, [data])

    return (
        <div className='w-full h-screen flex justify-center relative'>
            {data.isLoading &&
                <div className='text-white absolute text-xl flex items-center justify-center bg-black opacity-50 h-screen w-screen'>
                    <h1> Loading... </h1>
                </div>
            }
            <div className='w-full h-fit flex flex-col items-center justify-center p-4 px-8 gap-14 md:max-w-xl'>
                {/* Capybara */}
                <div className='w-full flex justify-center mt-12'>
                    <img src={capybara} alt='A capybara head image' className='w-[40%] max-w-[12rem]' />
                </div>

                {/* Sign in Info */}
                <div className='w-full flex flex-col items-center gap-12'>
                    <div className='w-full flex flex-col gap-4'>
                        <h1 className='text-white font-bold text-3xl mt-[-1rem]'>Sign {register ? "Up" : "In"}</h1>
                        <form className='w-full flex flex-col gap-4' onSubmit={register ? signUpWithEmail : signInWithEmail}>
                            <input className='h-14 outline-none border-2 bg-transparent border-[#292C2D] px-2 text-white placeholder:text-[#4C5053] text-xl'
                                placeholder='Email' type='email' value={email} required onChange={(e) => setEmail(e.currentTarget.value)} />
                            <input className='h-14 outline-none border-2 bg-transparent border-[#292C2D] px-2 text-white placeholder:text-[#4C5053] text-xl'
                                placeholder='Password' type='password' value={password} required onChange={(e) => setPassword(e.currentTarget.value)} />
                            <Link className='ml-auto text-[#464646]' to={'/reset'}> Forgot Password </Link>
                            <span className='text-red-600 text-xs mt-[-1rem]'> {noUserError} </span>
                            <input className='w-full h-14 bg-[#2881D9] text-white text-xl font-semibold' type='submit' value={`Sign ${register ? "Up" : "In"}`} />

                        </form>
                    </div>
                </div>

                {/* Other sign in options */}
                <div className='w-full h-full flex flex-col items-center gap-8 pb-16'>
                    <div className='w-full flex items-center gap-2'>
                        <div className='w-full border-t-[1px] border-t-[#707070] flex-[0.5]' />
                        <p className='w-full text-center text-white flex-[1]'> Or Sign {register ? "Up" : "In"} With</p>
                        <div className='w-full border-t-[1px] border-t-[#707070] flex-[0.5]' />
                    </div>
                    <button className='flex items-center text-white gap-8 bg-[#0943a2] px-6 py-2' onClick={signInWithGoogle}> <FcGoogle size={40} /> Sign {register ? 'up' : 'in'} with google </button>
                    <div className='w-full flex gap-4 items-center justify-center mt-auto'>
                        <p className='text-white'> {register ? "Already have an account?" : "Don't have an account?"} </p>
                        <p className='text-[#2881D9]' onClick={() => setRegister(!register)}> Sign {register ? "In" : "Up"} </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;