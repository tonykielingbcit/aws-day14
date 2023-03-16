import { deleteChat } from "@chatapp/core/src/database/db-chat";

export async function main(event, context) {
    try {
      const { id } = event.pathParameters;
      await deleteChat(id);
    
      return ({
        statusCode: 200,
        body: JSON.stringify({
          message: "from delete"
        }),
      });
    } catch(error) {
      console.log("###ERROR on deleteChat: ", error.message || error);
      return({
        error: true,
        message: "ERROR on deleteChat"
      });
    }
  }
  