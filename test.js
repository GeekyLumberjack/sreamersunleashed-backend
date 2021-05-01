//import * as dynamoDbLib from "./libs/dynamodb-lib";
//import { success, failure } from "./libs/response-lib";
import handler from "./libs/handler-lib";
//import config from './config';
export const main = handler( async (event, context) => {
  const data = JSON.parse(event.body);
  

  try {

    return {status: true};
  } catch (e) {
    console.log(e);
    return { status: false };
  }
});