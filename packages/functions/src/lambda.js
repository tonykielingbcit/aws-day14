// import { Time } from "@chatapp/core/time";

export async function handler(event, context) {
  // const time = new Time();
  return {
    statusCode: 200,
    body: JSON.stringify({
      // time: "Time rn is: " + time.now(),
      message: "Hello from chatapp!!!"
    }),
  };
}
