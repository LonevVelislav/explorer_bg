const likesReducer = (state, action) => {
    switch (action.type) {
        case 'get-all-likes':
            return [...action.payload];
        case 'add-like':
            return [state, ...action.payload];
        default:
            return state;
    }
};

export default likesReducer;
