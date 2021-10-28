import {ActionTypes} from '../contants/action-types.js'

export const setTasks = (tasks) => {
    return {
        type: ActionTypes.SET_TASKS,
        payload: tasks
    }
}

export const selectedTask = (task) => {
    return {
        type: ActionTypes.SELECTED_TASK,
        payload: task
    }
}

export const removeSelectedTask = (task) => {
    return {
        type: ActionTypes.REMOVE_SELECTED_TASK,
    }
}