import * as iam from "aws-cdk-lib/aws-iam";
import { Api, Cognito, use } from "sst/constructs";
import { MediaAssets } from "./MediaStack.js";

export function API({ stack }) {
    const { bucket } = use(MediaAssets);
  // Create auth provider
  const auth = new Cognito(stack, "Auth", {
    login: ["email", "username"],
  });

  const api = new Api(stack, "api", {
    defaults: {
        authorizer: "iam",
        function: {
            environment: {
                DATABASE_URL: process.env.DATABASE_URL,
            },
        },
    },
    routes: {
      "GET /chats": {
          function: "packages/functions/src/chat/get.main",
          authorizer: "none"
      },
      "POST /newChat": "packages/functions/src/chat/add.main", 
      "DELETE /chat/{id}": "packages/functions/src/chat/delete.main", 
      "PUT /chat": "packages/functions/src/chat/update.main", 
    //   "GET /messages/{chatId}": "packages/functions/src/message/get.main",

      "GET /messages/{chatId}": {
        function: "packages/functions/src/message/get.main",
        authorizer: "none"
      },
      "POST /newMessage": "packages/functions/src/message/add.main", 
      "DELETE /message/{id}": "packages/functions/src/message/delete.main", 
      "PUT /message": "packages/functions/src/message/update.main"
    },
  });
  
    // Allow authenticated users invoke API
    // and CRUD images
    auth.attachPermissionsForAuthUsers(stack, [
        api,
        new iam.PolicyStatement({
          actions: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
          effect: iam.Effect.ALLOW,
          resources: [
            bucket.bucketArn + "/public/*",
            bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
            bucket.bucketArn + "/protected/${cognito-identity.amazonaws.com:sub}/*",
          ]
        }),
        new iam.PolicyStatement({
          actions: ["s3:GetObject"],
          effect: iam.Effect.ALLOW,
          resources: [
            bucket.bucketArn + "/protected/*",
          ]
        })
    ]);


    // Allow unauthenticated users to access images
    auth.attachPermissionsForUnauthUsers(stack, [
        new iam.PolicyStatement({
            actions: ["s3:GetObject"],
            effect: iam.Effect.ALLOW,
            resources: [
                bucket.bucketArn + "/public/*",
                bucket.bucketArn + "/protected/*",
            ]
        })
    ]);

    stack.addOutputs({
        ApiEndpoint: api.url,
        UserPoolId: auth.userPoolId,
        IdentityPoolId: auth.cognitoIdentityPoolId ?? "",
        UserPoolClientId: auth.userPoolClientId,
    });
    
  return { api, auth };
}
