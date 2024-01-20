const reducer = (state, action) => {
    switch (action.type) {
        case 'get-all-comments':
            return [...action.payload];
        case 'add-comment':
            return [action.payload, ...state];
        case 'delete-comment':
            state = state.filter((el) => el._id !== action.payload);
            return [...state];
        default:
            return state;
    }
};

export default reducer;
