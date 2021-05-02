import * as dynamoDbLib from "./libs/dynamodb-lib";

import handler from "./libs/handler-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  var params ={TableName: `customerTable`,
    Item:{walletAddress:data.address},
    ConditionExpression: 'attribute_not_exists(walletAddress)'
  };

  try {
    const result = await dynamoDbLib.get(params); // Return the matching list of items in response body

    return result.Items;
  } catch (e) {
    console.log(e);

    try{
        params['ConditionExpression'] = 'attribute_exists(code)'
        const hasCode = await dynamoDbLib.put(params);
        return { status:true };


    }
    catch(er){
        console.log(er);
        return { status: false };

    }
  }
});