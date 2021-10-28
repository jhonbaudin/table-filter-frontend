import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectedTask, removeSelectedTask } from '../redux/actions/tasksActions.js'
import { Link } from "react-router-dom";

const TaskDetail = () => {

    const [show, setShow] = useState(false);
    const [msg, setMsg] = useState('');
    const [error, setError] = useState([]);
    const task = useSelector((state) => state.task)
    const { taskId } = useParams();
    const dispatch = useDispatch();
    const handleSave = () => { updateTask(task); };

    const fetchTaskDetail = async () => {
        const response = await axios
            .get(`http://localhost:8000/api/v1/tasks/${taskId}`)
            .catch((err) => {
                console.log(err)
            })
        dispatch(selectedTask(response.data))
    }

    const updateTask = async (task) => {
        const response = await axios
            .put(`http://localhost:8000/api/v1/tasks/${task.id}`, {
                name: task.name,
                completed: task.completed,
            })
            .then((data) => {
                setMsg(data.data.message)
                setError([])
            })
            .catch((err) => {
                setError([err.response.data.errors])
                setMsg(err.response.data.message)
            })
            .finally(() => {
                setShow(true);
                setTimeout(() => {
                    setShow(false)

                }, 5000);
            })

        fetchTaskDetail();
    }

    useEffect(() => {
        if (taskId && taskId !== "") {
            fetchTaskDetail();
        } return () => {
            dispatch(removeSelectedTask())
        }
    }, [taskId]);

    const renderListError = Object.entries(error.length ? error[0] : []).map((e) => {
        return (<p>{e[1].join(',')}</p>)
    });

    return (
        <div className="ui container" style={{ "marginTop": "50px" }}>
            {!Object.keys(task).length ? <div>Loading...</div> : (
                <div className="ui form">

                    {show &&
                        <div className="ui info message" style={{ "marginBottom": "20px" }}>
                            <i className="close icon"></i>
                            <div className="header">
                                {msg}
                            </div>
                            {renderListError}
                        </div>}

                    <div className="two fields">
                        <div className="field">
                            <label>Name</label>
                            <input type="text" placeholder="Name" onChange={(e) => task.name = e.target.value} defaultValue={task.name || ''} />
                        </div>
                        <div className="field">
                            <label>Status</label>
                            <select className="ui fluid dropdown" onChange={(e) => task.completed = e.target.value} defaultValue={task.completed || 0} >
                                <option value="0">On hold</option>
                                <option value="1">Completed</option>
                            </select>
                        </div>
                    </div>
                    <div className="two fields">
                        <div className="field">
                            <label>Created at</label>
                            <input type="datetime" readOnly value={task.created_at || 0} />
                        </div>
                        <div className="field">
                            <label>Updated at</label>
                            <input type="datetime" readOnly value={task.updated_at || 0} />
                        </div>
                    </div>
                    <Link to={`/`}><div className="ui button secondary" tabIndex="0">Back</div></Link>
                    <div onClick={handleSave} className="ui button primary" tabIndex="0">Save</div>
                </div>
            )}
        </div>
    )

}

export default TaskDetail;
