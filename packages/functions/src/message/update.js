import { updateMessage } from "@chatapp/core/src/database/db-message";

export async function main(event, context) {
    try {
      const { id, content } = JSON.parse(event.body);
      const res = await updateMessage(id, content);
    
      return ({
        statusCode: 200,
        body: JSON.stringify({
          message: res
        }),
      });
    } catch(error) {
      console.log("###ERROR on updateMessage: ", error.message || error);
      return({
        error: true,
        message: "ERROR on updateMessage"
      });
    }
  }
  