import dynamoDb from "./libs/dynamodb-lib";

import handler from "./libs/handler-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  var params ={TableName: `customerTable`,
    Item: {
      "walletAddress":data.walletAddress.props
    },
    ConditionExpression: 'attribute_not_exists(walletAddress)',
  };

  try {
    const result = await dynamoDb.put(params); // Return the matching list of items in response body

    return {code: false, result:result};
  } catch (e) {
    console.log(e);
      if(e.code === 'ConditionalCheckFailedException'){
        try{
          params = {
            TableName: `customerTable`,
            Key:{
              walletAddress: {
                "S": data.walletAddress.props
              }
            },
            ProjectionExpression:"code"

          }
          const hasCode = await dynamoDb.get(params);
          return { code:true, hasCode:hasCode};
        }
        catch(er){
          return {code:false};
        }
      }
      console.log(e);
      return { code: false };
  }
});