import { Bucket } from "sst/constructs";
import cdk from "aws-cdk-lib";

export function MediaAssets({ stack, app }) {
  const bucket = new Bucket(stack, "Uploads", {
    // this object says that whenever I destroy the project by sst, it will also remove the S3 bucket for that
    // usually it it is set to destory everything in dev env, but prod does not
    // for that need to set a variable he did not remember - for now it is good
    cdk: {
      bucket: {
        autoDeleteObjects: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    },
    cors: [
      {
        maxAge: "1 day",
        // it should be set for the domain name the real system is working with
        // but for now, just leave *
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
      },
    ],
  });

  stack.addOutputs({
    BucketName: bucket.bucketName,
  });

  return {
    bucket
  }
}
