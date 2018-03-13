//==============================================
// Default configurations
//==============================================

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



export { Config }
