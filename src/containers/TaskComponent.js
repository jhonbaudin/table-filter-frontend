import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Confirm, Modal } from 'semantic-ui-react'
import axios from "axios";

const TaskComponent = (props) => {
    const { deleteTask, fetchTasks } = props;
    const [show, setShow] = useState(false)
    const [showResponse, setShowResponse] = useState(false)
    const [open, setOpen] = useState(false)
    const [completed, setCompleted] = useState(0)
    const [completedFilter, setCompletedFilter] = useState(0)
    const [searchFilter, setSearchFilter] = useState('')
    const [name, setName] = useState('')
    const [msg, setMsg] = useState('');
    const [error, setError] = useState([]);
    const [id, setId] = useState(0)
    const handleConfirm = () => { deleteTask(id); setShow(false) };
    const handleCancel = () => { setShow(false) };
    const tasks = useSelector((state) => state.allTasks);

    const saveTask = async (task) => {
        await axios
            .post(`http://localhost:8000/api/v1/tasks`, {
                name: name,
                completed: completed,
            })
            .then((data) => {
                setMsg(data.data.message)
                setError([])
                fetchTasks();
            })
            .catch((err) => {
                setError([err.response.data.errors])
                setMsg(err.response.data.message)
            })
            .finally(() => {
                setShowResponse(true);
                setTimeout(() => {
                    setShowResponse(false)
                    setOpen(false);
                }, 5000);
            })

    }

    const renderList = tasks.tasks.map((task) => {
        return (<tr key={task.id}>
            <td>
                <h2 className="ui center aligned header">{task.id}</h2>
            </td>
            <td className="single line">
                {task.name}
            </td>
            <td>
                {task.completed === 1 ? 'YES' : 'NO'}
            </td>
            <td className="right aligned">
                {task.created_at}
            </td>
            <td>{task.updated_at}</td>
            <td>
                <Link to={`/task/${task.id}`}><button className="ui labeled button"><i className="edit blue icon"></i></button></Link>
                <Button className="ui labeled button" onClick={() => { setShow(true); setId(task.id) }}><i className="trash red icon"></i></Button>
            </td>
        </tr>)

    })

    const renderListError = Object.entries(error.length ? error[0] : []).map((e) => {
        return (<p>{e[1].join(',')}</p>)
    });

    return (
        <div className="ui grid container">


            <div class="ui form">
                <div class="four fields">
                    <div class="field">
                        <label>Filter by name</label>
                        <input type="text" onChange={(e) => setSearchFilter(e.target.value)} />
                    </div>
                    <div class="field">
                        <label>Filter by state</label>
                        <select className="ui fluid dropdown" onChange={(e) => setCompletedFilter(e.target.value)}>
                            <option value="">All</option>
                            <option value="0">On hold</option>
                            <option value="1">Completed</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>Click to search</label>
                        <Button className="ui secondary button" onClick={() => fetchTasks({ page: tasks.pages.current - 1, search: searchFilter, completed: completedFilter })}>Search Tasks</Button>
                    </div>
                    <div class="field">
                        <label>Click to create</label>
                        <Modal
                            onClose={() => setOpen(false)}
                            onOpen={() => setOpen(true)}
                            open={open}
                            trigger={<Button className="ui primary button">Create Task</Button>}
                        >
                            <Modal.Header>Creating a task</Modal.Header>
                            <Modal.Content>
                                {showResponse &&
                                    <div className="ui info message" style={{ "marginBottom": "20px" }}>
                                        <i className="close icon"></i>
                                        <div className="header">
                                            {msg}
                                        </div>
                                        {renderListError}
                                    </div>}
                                <div className="ui form">
                                    <div className="two fields">
                                        <div className="field">
                                            <label>Name</label>
                                            <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <div className="field">
                                            <label>Status</label>
                                            <select className="ui fluid dropdown" onChange={(e) => setCompleted(e.target.value)} defaultValue={0} >
                                                <option value="0">On hold</option>
                                                <option value="1">Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color='black' onClick={() => { setOpen(false); setName(''); setCompleted(0) }}>
                                    Close
                                </Button>
                                <Button
                                    onClick={() => { saveTask() }}
                                    positive
                                >Save</Button>
                            </Modal.Actions>
                        </Modal>
                    </div>
                </div>
            </div>



            <table className="ui celled padded table">
                <thead>
                    <tr><th className="single line">ID</th>
                        <th className="single line">Name</th>
                        <th className="single line">Completed</th>
                        <th className="single line">Created</th>
                        <th className="single line">Updated</th>
                        <th className="single line">Actions</th>
                    </tr></thead>
                <tbody>
                    {renderList}
                </tbody>
                <tfoot>
                    <tr><th colSpan="6">
                        <div className="ui right floated pagination menu">
                            <button className="icon item" style={{ border: '0', cursor: 'pointer' }} onClick={() => fetchTasks({ page: tasks.pages.current - 1, search: searchFilter, completed: completedFilter })}><i className="left chevron icon"></i></button>

                            <button className="icon item" style={{ border: '0', cursor: 'pointer' }} onClick={() => fetchTasks({ page: 1, search: searchFilter, completed: completedFilter })}>1</button>

                            <button className="ui primary button" style={{ border: '0' }} ><div className="ui input"><input style={{ width: '60px', height: '35px' }} type="number" onChange={(e) => fetchTasks({ page: e.target.value, search: searchFilter, completed: completedFilter })} value={tasks.pages.current} /></div></button>

                            <button className="icon item" style={{ border: '0', cursor: 'pointer' }} onClick={() => fetchTasks({ page: tasks.pages.last, search: searchFilter, completed: completedFilter })}>{tasks.pages.last}</button>

                            <button className="icon item" style={{ border: '0', cursor: 'pointer' }} onClick={() => fetchTasks({ page: tasks.pages.current + 1, search: searchFilter, completed: completedFilter })}><i className="right chevron icon"></i></button>
                        </div>
                    </th>
                    </tr></tfoot>
            </table>

            <Confirm
                content="Are you sure you want to delete this task? this action can't be undone!"
                open={show}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
        </div >
    )

}

export default TaskComponent;
