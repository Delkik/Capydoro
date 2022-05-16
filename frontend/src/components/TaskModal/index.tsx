import * as React from 'react';
import styles from './taskmodal.module.css';
import { FiCalendar, FiClock } from 'react-icons/fi';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { TaskStatus } from '../Task';
import { useDispatch } from 'react-redux';
import { addTask, updateTask } from '../../redux/slices/taskSlice';
import { nanoid } from '@reduxjs/toolkit';
import { TaskModalContext } from '../../App';
import { useDeleteTaskMutation, useNewTaskMutation, useUpdateTaskMutation } from '../../redux/apis/tasksEndpoints';
import { MdDelete } from 'react-icons/md';
import LoadingSpinner from '../LoadingSpinner';

const CustomDateInput = React.forwardRef(({ onClick, id, onChange, value }: React.HTMLProps<HTMLInputElement>, ref: React.Ref<HTMLInputElement>) => {
    return (
        <div className='w-full bg-transparent border-2 border-[#474D4E] h-[3rem] rounded-md flex items-center px-2 gap-4' onClick={onClick} id={id} onChange={onChange} ref={ref} >
            <FiCalendar size={25} color='#454C4F' />
            {value}
        </div>
    )
});

const CustomTimeInput = React.forwardRef(({ onClick, id, onChange, value }: React.HTMLProps<HTMLInputElement>, ref: React.Ref<HTMLInputElement>) => {
    return (
        <div className='w-full bg-transparent border-2 border-[#474D4E] h-[3rem] rounded-md flex items-center px-2 gap-4' onClick={onClick} id={id} onChange={onChange} ref={ref} >
            <FiClock size={25} color='#454C4F' />
            {value}
        </div>
    )
});

export interface TaskModalProps {
    id?: string,
    text?: string,
    date?: string,
    time?: string,
    status?: TaskStatus,
    typeOfModal?: string
}

const TaskModal = ({ id, text = "", date, time, status = TaskStatus['Not Started'], typeOfModal = 'create' }: TaskModalProps) => {

    const [taskText, setTaskText] = React.useState(text);
    const [taskDate, setTaskDate] = React.useState<string>(date ? date : "");
    const [taskTime, setTaskTime] = React.useState<string>(time ? time : "");
    const [taskStatus, setTaskStatus] = React.useState(status);

    const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);

    const { setViewTaskModal } = React.useContext(TaskModalContext!);

    const [newTask, result] = useNewTaskMutation();
    const [updateTask] = useUpdateTaskMutation();
    const [deleteTask, { isLoading }] = useDeleteTaskMutation();

    const createNewTask = () => {
        const task = { id: nanoid(), text: taskText, dueDate: taskDate, dueTime: taskTime, status: taskStatus };
        newTask(task);
        setViewTaskModal!(false);
    }

    const updateTaskValues = () => {
        console.log(`Modal is updating: ${id}`);
        const task = { id: id!, text: taskText, dueDate: taskDate, dueTime: taskTime, status: taskStatus };
        updateTask(task)
        setViewTaskModal!(false);
    }

    const deleteThisTask = () => {
        setShowConfirmDelete(false);
        deleteTask(id!).unwrap().finally(() => {
            setTimeout(() => {
                setViewTaskModal!(false);
            }, 250)
        });
    }

    return (
        <div className='max-w-md w-screen bg-[#1C1E1F] max-h-[42rem] h-screen flex flex-col px-4 py-4 pt-8 z-10 animate-modalSlideIn relative transition-transform lg:px-8 lg:max-w-2xl'>
            {isLoading &&
                <div className='w-full h-full bg-black bg-opacity-40 absolute top-0 left-0 flex items-center justify-center flex-col'>
                    <h1 className='text-white text-2xl z-10'> Deleting </h1>
                    <LoadingSpinner />
                </div>
            }

            {showConfirmDelete &&
                <div className='w-full h-full bg-black bg-opacity-50 absolute top-0 left-0 flex items-center justify-center flex-col'>
                    <div className='w-10/12 h-10/12 bg-[#151718] z-10 flex items-center justify-center flex-col p-8 gap-4 text-center'>
                        <h1 className='text-white text-2xl'> Delete Task? </h1>
                        <p className='text-white text-md'> Are you sure you want to delete this task? </p>
                        <p className='text-white text-md'> You can't undo this action. </p>
                        <div className='flex justify-between w-full gap-4'>
                            <button className='flex-1 rounded-md p-1 border-2 border-[#1D2021] text-white' onClick={() => setShowConfirmDelete(false)}> Cancel </button>
                            <button className='flex flex-1 items-center justify-center bg-red-600 rounded-md p-1 text-white font-semibold gap-2' onClick={deleteThisTask} ><MdDelete size={30} color="white" /> Delete </button>
                        </div>
                    </div>
                </div>
            }

            <div className='w-full flex items-center justify-center'>
                <h1 className='text-white text-2xl font-semibold mx-auto'> {typeOfModal === 'create' ? 'Create a' : 'Update'} task </h1>
                {id && <button className='bg-red-600 rounded-md p-1' onClick={() => setShowConfirmDelete(true)}> <MdDelete size={30} color="white" /> </button>}
            </div>
            <div className='h-full w-full flex flex-col gap-8 mt-4 text-[#596367] text-base'>
                <div className='flex flex-col'>
                    <h6> Task Title </h6>
                    <textarea className='bg-[#2E3234] mt-2 resize-none text-white outline-none focus:outline-[#596367] focus:outline-[1px] min-h-[5rem] rounded-md p-2' required value={taskText} onChange={(e) => setTaskText(e.currentTarget.value)}></textarea>
                </div>

                <div className='flex flex-col w-full'>
                    <h6> Date & Time </h6>
                    <div className='flex flex-row justify-between w-full mt-2'>
                        <ReactDatePicker id={"test"} wrapperClassName='!w-full flex-1 max-w-[45%]' customInput={<CustomDateInput />} value={taskDate} onChange={(date) => setTaskDate(date ? date.toLocaleDateString() : "")} />
                        <div className='w-8 lg:w-16' />
                        <ReactDatePicker id={"test"} wrapperClassName='!w-full flex-1 max-w-[45%]' showTimeSelect showTimeSelectOnly dateFormat="h:mm aa" customInput={<CustomTimeInput />} timeIntervals={15} value={taskTime} onChange={(time) => setTaskTime(time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "")} />
                    </div>
                </div>

                <div className='flex flex-col w-full'>
                    <h6> Status of Task </h6>
                    <div className='flex flex-row justify-between gap-8 mt-4'>
                        <button className={`${taskStatus === TaskStatus['Not Started'] ? styles.active : styles.inactive} flex items-center justify-center w-40 p-3 rounded-md`} onClick={() => setTaskStatus(TaskStatus['Not Started'])}>
                            Not Started
                        </button>

                        <button className={`${taskStatus === TaskStatus.Ongoing ? styles.active : styles.inactive} flex items-center justify-center w-40 p-3 rounded-md`} onClick={() => setTaskStatus(TaskStatus.Ongoing)}>
                            Ongoing
                        </button>

                        <button className={`${taskStatus === TaskStatus.Complete ? styles.active : styles.inactive} flex items-center justify-center w-40 p-3 rounded-md`} onClick={() => setTaskStatus(TaskStatus.Complete)}>
                            Complete
                        </button>
                    </div>
                </div>

                <div className='flex justify-center border-t-2 border-t-[#2E3234] w-full p-12 mt-12' onClick={() => id ? updateTaskValues() : createNewTask()}>
                    <button className='flex items-center justify-center text-white bg-[#2881D9] w-full h-14 rounded-lg text-xl lg:text-2xl'> Save </button>
                </div>

            </div>

        </div>
    );
}

export default TaskModal;