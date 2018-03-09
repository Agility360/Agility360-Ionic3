//import { configOverridesGenerated } from './config-overrides-generated'

//==============================================
// Default configurations
//==============================================
/*
// from Ionic I app

const aws_app_analytics = 'enable';
const aws_cognito_identity_pool_id = 'us-east-1:bdf9951a-fe82-47f6-8599-4fbe7ab74bfc';
const aws_cognito_region = 'us-east-1';
const aws_content_delivery = 'enable';
const aws_content_delivery_bucket = 'clientengagementapp-hosting-mobilehub-1363944817';
const aws_content_delivery_bucket_region = 'us-east-1';
const aws_content_delivery_cloudfront = 'enable';
const aws_content_delivery_cloudfront_domain = 'd1s3rwkbgrvc9r.cloudfront.net';
const aws_dynamodb = 'enable';
const aws_dynamodb_all_tables_region = 'us-east-1';
const aws_dynamodb_table_schemas = '[{"tableName":"ionic-mobile-hub-tasks","attributes":[{"name":"userId","type":"S"},{"name":"taskId","type":"S"},{"name":"category","type":"S"},{"name":"created","type":"N"},{"name":"description","type":"S"}],"indexes":[{"indexName":"DateSorted","hashKey":"userId","rangeKey":"created"}],"region":"us-east-1","hashKey":"userId","rangeKey":"taskId"}]';
const aws_mobile_analytics_app_id = '401e68d49b1b4bf8a38a29a3e6412715';
const aws_project_id = '1ef212e7-b846-4b49-aaf9-75f676768aef';
const aws_project_name = 'client-engagement-app';
const aws_project_region = 'us-east-1';
const aws_resource_name_prefix = 'clientengagementapp-mobilehub-1363944817';
const aws_sign_in_enabled = 'enable';
const aws_user_files = 'enable';
const aws_user_files_s3_bucket = 'clientengagementapp-userfiles-mobilehub-1363944817';
const aws_user_files_s3_bucket_region = 'us-east-1';
const aws_user_pools = 'enable';
const aws_user_pools_id = 'us-east-1_DB4QsAHuf';
const aws_user_pools_mfa_type = 'OFF';
const aws_user_pools_web_client_id = '5ksv9pmv1270se9e8prpaejdal';
const aws_user_settings = 'enable';
*/

const Config = {

  USER_POOL_ID:               'us-east-1_DB4QsAHuf', //
  USER_POOL_DOMAIN_NAME:      'clientengagementapp-mobilehub-1363944817.auth.us-east-1.amazoncognito.com',
  USER_POOL_DOMAIN_PREFIX:    'clientengagementapp-mobilehub-1363944817', //
  CLIENT_ID:                  '5ksv9pmv1270se9e8prpaejdal', //
  IDENTITY_POOL_ID:           'us-east-1:bdf9951a-fe82-47f6-8599-4fbe7ab74bfc', //
  REGION:                     'us-east-1',  // Your AWS region where you setup your Cognito User Pool and Federated Identities

  PROFILE_IMAGES_S3_BUCKET:   'clientengagementapp-userfiles-mobilehub-1363944817', //

  API_ENDPOINT:               'https://api.agility360app.net/beta/',

  DEVELOPER_MODE:             false, // enable to automatically login
  CODE_VERSION:               '1.0.0',
  DEFAULT_USERNAMES:          ['user1', 'admin1'] // default users cannot change their passwords

};

//==============================================

// Merge in the values from the auto-generated config.
// If there are are conflicts, then the values from the
// auto-generated config will override
//function mergeConfigurations() {
//  for (let attributeName of Object.keys(configOverridesGenerated)) {
//    Config[attributeName] = configOverridesGenerated[attributeName];
//  }
//}

//mergeConfigurations();

export { Config }
