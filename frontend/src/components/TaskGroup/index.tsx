import * as React from 'react';
import styles from './taskgroup.module.css';
import { createSelector } from '@reduxjs/toolkit';
import { useGetTasksQuery } from '../../redux/apis/tasksEndpoints';
import LoadingSpinner from '../LoadingSpinner';
import Task, { ITask, TaskStatus } from '../Task';

interface TaskGroupProps {
    groupTitle: string,
    tasks?: ITask[]
}

const makeSelectTasks = () =>
    createSelector(
        (state?: ITask[]) => state,
        (_: any, filter: string) => filter,
        (tasks, filter: string) => tasks?.filter((task) => { return TaskStatus[task.status] === filter }));

const TaskGroup = ({ groupTitle }: TaskGroupProps) => {

    const [isMinimized, setIsMinimized] = React.useState(true);

    const selectTasks = React.useMemo(makeSelectTasks, []);

    // const tasks = useSelector((state: IRootState) => selectTasks(state, groupTitle), shallowEqual);

    // const { data } = useGetTaskQuery('KCKVyfSCOJZOZmCHbIGlx');

    // React.useEffect(() => {
    //     console.log(data)
    // }, [data])

    const { tasks = [], isFetching, isLoading } = useGetTasksQuery(undefined, {
        selectFromResult: ({ data, isFetching, isLoading }) => ({
            tasks: selectTasks(data, groupTitle),
            isFetching,
            isLoading
        }),
    });

    return (
        <div className='w-full max-w-md h-fit flex flex-col gap-4 md:max-w-lg'>
            <div className='flex justify-between items-center'>
                <h1 className='text-white m-0 text-2xl font-semibold'>{groupTitle}</h1>
                <button className='bg-transparent outline-hidden border-none text-[#2881D9] font-normal' onClick={() => setIsMinimized(!isMinimized)}> {isMinimized ? 'View All' : 'Hide All'} </button>
            </div>
            <div className={`${isMinimized ? styles.minimized : ''}  w-full h-full flex flex-col gap-8 items-center`}>
                {isLoading ?
                    <LoadingSpinner /> :
                    tasks.map((task) => <Task key={task.id} {...task} />)
                }
            </div>
        </div>
    );
}

export default TaskGroup;