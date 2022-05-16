import * as React from 'react';
import { FiClock } from 'react-icons/fi';
import { TaskModalContext } from '../../App';
import styles from './task.module.css';

export enum TaskStatus {
    'Not Started',
    'Ongoing',
    'Complete',
}

export interface ITask {
    id: string,
    text: string,
    dueDate: string,
    dueTime: string,
    status: TaskStatus
}

const statusColors = {
    0: '#D92828',
    1: '#D98C28',
    2: '#3AD928'
}

const Task = ({ id, dueDate, dueTime, status, text }: ITask) => {


    // const [taskInfo, setTaskInfo] = React.useState<Partial<ITask>>({});

    const style = { '--statusColor': statusColors[status] } as React.CSSProperties;
    const { setViewTaskModal, setTaskModalProps } = React.useContext(TaskModalContext!);

    const openTask = () => {
        setViewTaskModal!(true);
        console.log(`Task trying to update: ${id}`);
        setTaskModalProps!({ id, date: dueDate, time: dueTime, status, text, typeOfModal: 'update' });
    }

    // React.useEffect(() => {
    //     if (data) {
    //         setdata);
    //     }
    // }, [data])

    return (
        <div className='w-full bg-[#1C1E1F] flex flex-col justify-center items-center py-3 px-4 gap-4 rounded-md cursor-pointer' onClick={openTask}>
            <div className='w-full flex items-center justify-between'>
                <h2 className='max-w-[15rem] text-white text-xl font-semibold m-0 text-ellipsis whitespace-nowrap overflow-hidden'> {text} </h2>
                <div className={`${styles.status} w-2 h-2 rounded-full`} style={style} />
            </div>

            <div className='w-full flex items-center gap-4 text-[#737A7E] text-[0.825rem]'>
                <FiClock size={20} color={'#737A7E'} />
                <p className='m-0'> {(dueDate !== "" ? dueDate : "") + " " + (dueTime !== "" ? dueTime : "")} </p>
            </div>
        </div>
    );
}

export default Task;