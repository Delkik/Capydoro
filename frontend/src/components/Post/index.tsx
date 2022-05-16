import * as React from 'react';
import Clap from './Clap';
import test from '../../images/capybara-pomo.png'
import styles from './post.module.css';

interface IPost {
    id: string,
    datePosted: string,
    text: string
    clapped: boolean,
}

const Post = ({ id, datePosted, text, clapped }: IPost) => {

    const [reacted, setReacted] = React.useState<boolean>(clapped);

    return (
        <div className='w-full h-auto bg-[#1C1E1F] flex py-2 px-4 justify-between items-center rounded-lg md:py-4'>
            <div className='w-fit max-w-[85%] h-fit flex flex-col gap-2 mb-6'>
                <div className='flex gap-4 items-center'>
                    <div className='w-8 h-8 border-2 border-[#2881D9] rounded-full overflow-hidden'>
                        <img src={test} />
                    </div>
                    <div>
                        <h2 className='text-white font-semibold text-base md:text-xl'>
                            James Doe
                        </h2>
                        <p className='text-[#616161] text-sm font-normal -mt-[2px]'> Jan 1, 2022 </p>
                    </div>
                </div>
                <div className='text-white font-semibold text-base md:text-lg'>
                    <h1>
                        James just started a new assignment!
                    </h1>
                </div>
            </div>
            <div className='w-fit h-fit flex flex-col justify-center items-center gap-1'>
                <button className={`${reacted ? styles.clap : styles.not_clapped} w-10 h-10 rounded-full flex items-center justify-center border-none outline-hidden md:w-14 md:h-14`} onClick={() => setReacted(!reacted)}>
                    <Clap className='w-3/5 h-3/5' />
                </button>
                <p className='text-white text-base'> 0 </p>
            </div>
        </div>
    );
}

export default Post;