import { ActionTypes } from "../contants/action-types";

const initialState = {
    tasks: [],
    pages: {}
}

export const tasksReducer = (state = initialState, { type, payload }) => {

    switch (type) {
        case ActionTypes.SET_TASKS:
            return {
                ...state, tasks: payload.data, pages: {
                    current: payload.current_page,
                    first_url: payload.first_page_url,
                    last: payload.last_page,
                    last_url: payload.last_page_url,
                    links: payload.links,
                    next_url: payload.next_page_url,
                    prev_url: payload.prev_page_url,
                }
            };
        default:
            return state;
    }

}

export const selectedTask = (state = {}, { type, payload }) => {

    switch (type) {
        case ActionTypes.SELECTED_TASK:
            return {
                ...state, ...payload
            };
        case ActionTypes.REMOVE_SELECTED_TASK:
            return {

            };
        default:
            return state;
    }

}
