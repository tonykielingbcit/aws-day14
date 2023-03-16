import { Api } from "sst/constructs";

export function API({ stack }) {
  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          DATABASE_URL: process.env.DATABASE_URL,
        },
      },
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "GET /test": "packages/functions/src/newfunction.handler",
      "GET /test/main": "packages/functions/src/newfunction.main",
      "GET /chats": "packages/functions/src/chat/get.main",
      "POST /newChat": "packages/functions/src/chat/add.main", 
      "DELETE /chat/{id}": "packages/functions/src/chat/delete.main", 
      "PUT /chat": "packages/functions/src/chat/update.main", 
      "GET /messages/{chatId}": "packages/functions/src/message/get.main",
      "POST /newMessage": "packages/functions/src/message/add.main", 
      "DELETE /message/{id}": "packages/functions/src/message/delete.main", 
      "PUT /message": "packages/functions/src/message/update.main"
    },
  });
  
  stack.addOutputs({
    ApiEndpoint: api.url,
    // test: "this is a test text",
  });

  return { api };
}
