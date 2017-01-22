const usersApi = {

    login(object, options){
        let {email, password}  = object;

        return {
            message: 'Login Successful',
            token  : "token"
        };
    }
};

export default usersApi;