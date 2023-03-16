// import * as db from "../helper/db.js";
import { createMessage } from "@chatapp/core/src/database/db-message";

export async function main(event, context) {
    try {
      const { chatId, content } = JSON.parse(event.body);
      const newMessage = await createMessage(chatId, content);
    
      return ({
        statusCode: 200,
        body: JSON.stringify({
          message: newMessage
        }),
      });
    } catch(error) {
      console.log("###ERROR on addMessage: ", error.message || error);
      return({
        error: true,
        message: "ERROR on addMessage"
      });
    }
  }
  