import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TaskComponent from "./TaskComponent.js";
import { setTasks } from '../redux/actions/tasksActions.js'
import axios from "axios";

const TaskList = () => {
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);

    const fetchTasks = async (payload = {}) => {
        const response = await axios
            .get("http://localhost:8000/api/v1/tasks", { params: { page: payload.page ? payload.page : 1, limit: payload.limit ? payload.limit : 15, search: payload.search ? payload.page : '', completed: payload.completed ? payload.completed : '' } })
            .catch((err) => {
                console.log(err)
            })
        dispatch(setTasks(response.data))
    }

    const deleteTask = async (taskId) => {
        await axios
            .delete(`http://localhost:8000/api/v1/tasks/${taskId}`)
            .catch((err) => {
                console.log(err)
            }).finally(() => {
                setShow(true);
                setTimeout(() => {
                    setShow(false)

                }, 5000);
            })
        fetchTasks();

    }
    useEffect(() => {
        fetchTasks();
    });
    return (
        <div style={{ "marginTop": "80px" }}>
            {show &&
                <div className="ui positive message" style={{ "marginBottom": "20px" }}>
                    <i className="close icon"></i>
                    <div className="header">
                        Task Deleted Succesfully!
                    </div>
                </div>
            }
            <TaskComponent deleteTask={deleteTask} fetchTasks={fetchTasks} />
        </div >
    )
}

export default TaskList;
