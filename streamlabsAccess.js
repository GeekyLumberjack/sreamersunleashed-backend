import dynamoDb from "./libs/dynamodb-lib";
import handler from "./libs/handler-lib";

var AWS = require('aws-sdk');
  const ssm = new AWS.SSM();
  const clientSecretPromise = ssm.getParameter({
    Name: 'client_secret',
    WithDecryption: true
  }).promise();

async function getAccessToken(code) {
  var axios = require("axios");
  const secret = await clientSecretPromise;
  const res = await axios.post('https://streamlabs.com/api/v1.0/token?grant_type=authorization_code&client_id=OTgPYBs7dsnSJN6yph3HlYDpjCyEx4q5lXyLskds&client_secret='+secret+'&redirect_uri=streamersunleashed.com&code='+code);
  console.log(res);
  return{body:JSON.stringify(res)};
}


export const main = handler( async (event, context) => {
  const data = JSON.parse(event.body);
  const access = await getAccessToken(data.code);
  var params = {
    TableName: `customerTable`,
    Key:{
      "walletAddress":data.walletAddress
    },
    ExpressionAttributeValues:{
      ":c1" : access.access_token,
      ":c2": access.token_type,
      ":c3": access.refresh_token
    },
    UpdateExpression:"set access_token = :c1, token_type = :c2, refresh_token = :c3"

  };

  try {
    const result = await dynamoDb.update(params); // Return the matching list of items in response body
    return {code: true, result:result};
  } catch (e) {
    if(e.code === 'ConditionalCheckFailedException'){
      return{ code: true};
    }
    console.log(e);
    return { code: false };
  }
});