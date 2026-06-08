const createPostSchema = {
    name: {
        required: true,
        type: "string",
    },
    description: {
        required: true,
        type: "string",
    },
    age: {
        required: true,
        type: "number",
        min: 1,
        max: 150,
    },
};

const updatePostSchema = {
    name: {
        type: "string",
    },
    description: {
        type: "string",
    },
    age: {
        type: "number",
        min: 1,
        max: 150,
    },
};

export {
    createPostSchema,
    updatePostSchema
};
