import * as React from 'react';
import { FiBell, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSignOutUserMutation } from '../../redux/apis/authEndpoints';
import Navbar from '../Navbar';
import styles from './header.module.css';

const Header = () => {
    const [showProfile, setShowProfile] = React.useState(false);

    const navigate = useNavigate();

    const [signOut] = useSignOutUserMutation();

    const signOutUser = () => {
        let result = signOut().unwrap().finally(() => {
            navigate('/login')

        });
        console.log(result)
    }

    return (
        <div className='sticky top-0 flex w-full h-fit justify-between items-center z-[1] bg-[#151718] py-2 px-0 lg:bg-[#1D2021] lg:py-0 lg:px-8 lg:col-span-1'>
            <div className='w-10 h-10 rounded-full border-2 border-solid border-[#2881D9] relative' onClick={() => setShowProfile(!showProfile)}>
                <img />

                {showProfile &&

                    <div className={`absolute w-96 h-screen bg-[#1C1E1F] top-16 z-10 transition-{left} ${showProfile && "animate-profileSlideIn"} flex flex-col p-4`}>
                        <button className='bg-[#2881D9] w-full p-4 m-auto text-white text-lg font-semibold' onClick={signOutUser}>Sign out</button>
                    </div>
                }

            </div>

            <div className='w-2/5 lg:block'>
                <Navbar />
            </div>

            <div className='flex flex-row gap-8'>
                <FiBell size={35} color="#414344" style={{ strokeWidth: 1.5 }} />
                <FiSettings size={35} color="#414344" style={{ strokeWidth: 1.5 }} />
            </div>
        </div>
    );
}

export default Header;