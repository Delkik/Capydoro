import * as React from 'react';
import { MdAdd } from 'react-icons/md';
import Level from '../../components/Level';
import TaskGroup from '../../components/TaskGroup';
import ReactModal from 'react-modal';
import TaskModal, { TaskModalProps } from '../../components/TaskModal';
import { TaskModalContext } from '../../App';

ReactModal.setAppElement('#root')

const Home = () => {

    const { viewTaskModal, setViewTaskModal, setTaskModalProps, taskModalProps } = React.useContext(TaskModalContext!);


    const createNewTask = () => {
        setViewTaskModal!(true);
        setTaskModalProps!({});
    }

    return (
        <div className='w-full h-full grid grid-cols-1 grid-rows-[20rem 1fr] justify-items-center pb-32 lg:grid-cols-3 lg:col-span-1 lg:row-span-1 lg:pt-16 lg:pb-0'>
            <Modal taskModalProps={taskModalProps!} viewTaskModal={viewTaskModal!} toggleModal={(val) => setViewTaskModal!(val)} />
            <Level />
            <Groups />

            <button className='w-3/5 h-12 bg-blue-600 justify-center items-center gap-4 text-xl text-white outline-none border-none hidden lg:flex' onClick={createNewTask}>
                <MdAdd size={35} color="white" /> Add Task
            </button>
        </div>
    );
}

interface ModalProps {
    viewTaskModal: boolean,
    toggleModal: (val: boolean) => void,
    taskModalProps: TaskModalProps
}

const Modal = React.memo(({ viewTaskModal, toggleModal, taskModalProps }: ModalProps) => {
    // const { data } = useGetTaskQuery(taskModalProps.id!);
    return (
        <ReactModal isOpen={viewTaskModal} preventScroll closeTimeoutMS={100} shouldCloseOnOverlayClick onRequestClose={() => toggleModal(false)} shouldCloseOnEsc
            contentElement={(props, children) => <div {...props}>{children} </div>}>
            <TaskModal {...taskModalProps} />
        </ReactModal>
    )
});

const Groups = React.memo(() => {
    return (
        <div className='w-full h-full flex flex-col items-center gap-8 row-span-2 lg:col-start-2 lg:row-span-1'>
            <TaskGroup groupTitle='Not Started' />
            <TaskGroup groupTitle='Ongoing' />
            <TaskGroup groupTitle='Complete' />
        </div>
    )
});

export default Home;