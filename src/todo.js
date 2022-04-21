const { nanoid } = require("nanoid");

const headers = {
    "Content-Type": "application/json"
};

const todos = [];

exports.handler = async (event, context) => {
    const { requestContext: { http: { method } } } = event;
    
    let response;

    if(method === "GET"){
        response = {
            "statusCode": 200,
            "body": JSON.stringify({
                todos
            })
        };
    }else if(method === "POST"){
        const id = `todo-${nanoid(16)}`;
        const { title } = JSON.parse(event.body);
        const now = new Date().toISOString();

        todos.push({
            id,
            title,
            status: false,
            created_at: now,
            updated_at: now
        });

        response = {
            "statusCode": 201,
            "body": JSON.stringify({
                todoId: id
            })
        };
    }else if(method === "PUT"){
        const { id } = event.queryStringParameters;
        const now = new Date().toISOString();

        const index = todos.findIndex(todo => todo.id === id);

        if(index !== -1){
            todos[index] = {
                ...todos[index],
                status: true,
                updated_at: now
            }
    
            response = {
                "statusCode": 200,
                "body": JSON.stringify({
                    todo: todos[index]
                })
            }
        }else{
            response = {
                "statusCode": 200,
                "body": JSON.stringify({
                    message: "Gagal Update, Todo tidak ditemukan"
                })
            }
        }
    }else if(method === "DELETE"){
        const { id } = event.queryStringParameters;
        
        const index = todos.findIndex(todo => todo.id === id);

        if(index !== -1){
            todos.splice(index,1);

            response = {
                "statusCode": 200,
                "body": JSON.stringify({
                    message: "Berhasil hapus Todo"
                })
            }
        }else{
            response = {
                "statusCode": 404,
                "body": JSON.stringify({
                    message: "Gagal hapus Todo"
                })
            }
        }
    }

    return {
        "statusCode": response.statusCode,
        headers,
        "body": response.body
    };
}