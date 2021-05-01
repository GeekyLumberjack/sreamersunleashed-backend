import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import config from './config';
export const main = handler( async (event, context) {
  const data = JSON.parse(event.body);
  var params ={TableName: `customerTable`,
    Item:{code:data.code}
  };

  try {
    const result = await dynamoDbLib.call("put", params); // Return the matching list of items in response body

    return success(result.Items);
  } catch (e) {
    console.log(e);
    return failure({
      status: false
    });
  }
});