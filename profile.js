import dynamoDb from "./libs/dynamodb-lib";

import handler from "./libs/handler-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  var params ={TableName: `customerTable`,
    Item: {
      "walletAddress":data.walletAddress
    },
    ConditionExpression: 'attribute_not_exists(walletAddress)',
  };

  try {
    const result = await dynamoDb.put(params); // Return the matching list of items in response body

    return {code: false, result:result};
  } catch (e) {
      if(e.code === 'ConditionalCheckFailedException'){
        try{
          params = {
            TableName: `customerTable`,
            Key:{
              "walletAddress":data.walletAddress
            },
            KeyConditionExpression: "walletAddress = :wa",
            ExpressionAttributeValues:{
              ":wa" : data.walletAddress
            },
            ProjectionExpression:"access_token,tokenMap"

          };
          const hasCode = await dynamoDb.get(params);
          if(hasCode.Item.access_token){
            return { code:true, hasCode:hasCode};
          }else{
            return { code:false, hasCode:hasCode};
          }
        }
        catch(er){
          console.log(er);
          return {code:false};
        }
      }
      console.log(e);
      return { code: false };
  }
});