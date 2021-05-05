import dynamoDb from "./libs/dynamodb-lib";

import handler from "./libs/handler-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  var params ={TableName: `customerTable`,

    ConditionExpression: 'attribute_not_exists(:wa)',
    ExpressionAttributeValues:{
      ":wa":data.walletAddress.props
    }
  };

  try {
    const result = await dynamoDb.query(params); // Return the matching list of items in response body

    return result.Items;
  } catch (e) {
    console.log(e);

    try{
        params['ConditionExpression'] = 'attribute_exists(code)';
        const hasCode = await dynamoDb.put(params);
        return { status:true, hasCode:hasCode};


    }
    catch(er){
        console.log(er);
        return { status: false };

    }
  }
});