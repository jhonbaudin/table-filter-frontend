import { combineReducers } from "redux";
import { tasksReducer, selectedTask } from "./tasksReducer.js";

const reducers = combineReducers({
    allTasks: tasksReducer,
    task: selectedTask
});

export default reducers;