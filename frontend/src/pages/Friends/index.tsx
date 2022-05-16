import Post from '../../components/Post';

const Friends = () => {
    return (
        <div className='w-full grid justify-center py-8 grid-cols-3 justify-items-center lg:pt-16'>
            <div className='col-span-3 max-w-xl w-full'>
                <Post clapped={false} datePosted='' id='' text='' />
            </div>

        </div>
    );
}

export default Friends;