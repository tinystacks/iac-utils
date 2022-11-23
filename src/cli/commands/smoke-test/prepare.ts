import { IacFormat } from "../../types";

function prepareCdk () {
  // cdk diff
  // parse diff
  // extract resources with action types
}

function prepareTf () {
  // terraform plan -out=tfplan
  // terraform show -no-color -json tfplan > plan.json
  // extract resources with action types
}

function prepareForSmokeTest (format: IacFormat) {
  if (format === IacFormat.awsCdk) {
    prepareCdk();
  }
  if (format === IacFormat.tf) {
    prepareTf();
  }
  return;
}

export {
  prepareForSmokeTest
};