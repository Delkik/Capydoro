import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITask, TaskStatus } from "../../components/Task";

interface TaskState {
    tasks: ITask[]
}

const initialState: TaskState = {
    tasks: []
}

const taskSlice = createSlice({
    initialState: initialState,
    name: 'taskSlice',
    reducers: {
        addTask: (state: TaskState, { payload }: PayloadAction<ITask>) => {
            state.tasks.push(payload);
        },
        updateTask: (state: TaskState, { payload }: PayloadAction<ITask>) => {
            state.tasks = state.tasks.map((task) => {
                if (task.id === payload.id) {
                    return payload;
                }
                return task;
            });
        },
        changeTaskStatus: (state: TaskState, { payload }: PayloadAction<{ taskId: string, newStatus: TaskStatus }>) => {
            let taskWithId = state.tasks.find((val) => val.id === payload.taskId);

            if (taskWithId) {
                taskWithId.status = payload.newStatus;
            }
        }
    }
});

export const { addTask, changeTaskStatus, updateTask } = taskSlice.actions;

export default taskSlice.reducer;