const [
    SET_AUTH,
    CLEAR_AUTH
] = [
    Symbol(),
    Symbol()
];

function setAuth(authInfo) {
    return {
        type: SET_AUTH,
        payload: authInfo
    }
}

function clearAuth() {
    return {
        type: CLEAR_AUTH
    }
}

export {
    SET_AUTH,
    CLEAR_AUTH,
    setAuth,
    clearAuth
}