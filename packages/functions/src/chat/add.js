// import * as db from "../helper/db.js";
import { createChat } from "@chatapp/core/src/database/db-chat";

export async function main(event, context) {
    try {
      // console.log("newChat::: ", event)
      const { name } = JSON.parse(event.body);
      // console.log("----------body: ", name)
      // const { name } = (event.body);
      const newChat = await createChat(name);
      // console.log("newChat::: ", newChat)
    
      return ({
        statusCode: 200,
        body: JSON.stringify({
          message: newChat
        }),
      });
    } catch(error) {
      console.log("###ERROR on addChat: ", error.message || error);
      return({
        error: true,
        message: "ERROR on addChat"
      });
    }
  }
  