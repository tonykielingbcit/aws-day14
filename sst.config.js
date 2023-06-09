import { API } from "./stacks/ApiStack";
import { FrontendStack } from "./stacks/FrontendStack";
import { MediaAssets } from "./stacks/MediaStack";

export default {
  config(_input) {
    return {
      name: "chatapp-v3",
      region: "us-west-2",
    };
  },
  stacks(app) {
    app.stack(MediaAssets).stack(API).stack(FrontendStack)
  }
}
