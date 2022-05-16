import * as React from 'react';
import { AiOutlineLoading } from 'react-icons/ai';

const LoadingSpinner = () => {
    return (
        <div className='w-fit h-fit'>
            <AiOutlineLoading className='animate-spin' size={40} color={'white'} />
        </div>
    );
}

export default LoadingSpinner;