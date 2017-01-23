const usersApi = {

    async login(object, options){
        let {email, password}  = options.query;

        // const userInfo = await UserAccountModel.findOne({"": email});

        return {
            message : 'Login Successful',
            token   : "token",
            email   : email,
            password: password
        };
    },
};

export default usersApi;