const registerUserSchema = {
    username: {
        required: true,
        type: "string",
        minLength: 1,
        maxLength: 30,
    },
    email: {
        required: true,
        type: "email",
    },
    password: {
        required: true,
        type: "string",
        minLength: 6,
        maxLength: 50,
    },
};

const loginUserSchema = {
    email: {
        required: true,
        type: "email",
    },
    password: {
        required: true,
        type: "string",
        minLength: 6,
        maxLength: 50,
    },
};

export {
    registerUserSchema,
    loginUserSchema
};
