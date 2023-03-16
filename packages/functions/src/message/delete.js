import { deleteMessage } from "@chatapp/core/src/database/db-message";

export async function main(event, context) {
    try {
      const { id } = event.pathParameters;
      await deleteMessage(id);
    
      return ({
        statusCode: 200,
        body: JSON.stringify({
          message: "from delete message"
        }),
      });
    } catch(error) {
      console.log("###ERROR on deleteMessage: ", error.message || error);
      return({
        error: true,
        message: "ERROR on deleteMessage"
      });
    }
  }
  