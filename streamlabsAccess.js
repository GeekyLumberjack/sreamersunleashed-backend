import dynamoDb from "./libs/dynamodb-lib";
import handler from "./libs/handler-lib";


async function getAccessToken(code) {
  var AWS = require('aws-sdk');
  var region = "us-east-2";
  var secretName = "client_secret";
  var secret;
   
  var client = new AWS.SecretsManager({
    region: region
  });
  client.getSecretValue({SecretId: secretName}, function(err, data) {
    if (err) {
        if (err.code === 'DecryptionFailureException')
            // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InternalServiceErrorException')
            // An error occurred on the server side.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidParameterException')
            // You provided an invalid value for a parameter.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidRequestException')
            // You provided a parameter value that is not valid for the current state of the resource.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'ResourceNotFoundException')
            // We can't find the resource that you asked for.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
    }
    else {
        // Decrypts secret using the associated KMS CMK.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ('SecretString' in data) {
            secret = data.SecretString;
        }
    }
  });
  var axios = require("axios");
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