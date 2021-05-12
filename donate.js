import dynamoDb from "./libs/dynamodb-lib";
import handler from "./libs/handler-lib";

export const main = handler( async (event, context) => {
  const data = JSON.parse(event.body);
  params = {
    TableName: `customerTable`,
    Key:{
      "walletAddress":data.walletAddress
    },
    KeyConditionExpression: "walletAddress = :wa",
    ExpressionAttributeValues:{
      ":wa" : data.walletAddress
    },
    ProjectionExpression:"code"

  };
  try{
    const hasCode = await dynamoDb.get(params);
    const options = {mehtod:'POST'}
    const url = 'https://streamlabs.com/api/v1.0/donations?name='+data.name+'&identifier='+data.walletAddress+'&amount='+data.amount+'&currency='+data.currency+'&access_token'+hasCode.Item.code
    const donate = fetch(url, options)
          .then(res => console.log(res.json()))
    return ({Donation: true})      
    
  } catch (e) {
    console.log(e);
    return { Donation: false };
  }
});