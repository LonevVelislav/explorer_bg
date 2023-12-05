const reducer = (state, action) => {
    switch (action.type) {
        case 'get-all-comments':
            return [...action.payload];
        case 'add-comment':
            return [action.payload, ...state];
        default:
            return state;
    }
};

export default reducer;
