import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Config} from '../config/config'
import {Logger} from './logger.service';
import * as sjcl from '../assets/vendor/sjcl';
import { DEBUG_MODE } from '../shared/constants';

declare const AWS: any;
declare const AWSCognito: any;

export enum UserState {
  SignedOut = 0,
  SignedIn = 1,
  PendingConfirmation = 2,
  InvalidCredentials = 3
}

export interface IUserRegistration {
  email?: string;
  givenName?: string;
  familyName?: string;
  username?: string;
  password?: string;
}

export interface IUserLogin {
  username?: string;
  password?: string;
}

interface IUserAttribute {
  Name: string;
  Value: string;
}

@Injectable()
export class CognitoUtil {

  private static _USER_POOL_ID = Config['USER_POOL_ID'];
  private static _USER_POOL_DOMAIN_NAME = Config['USER_POOL_DOMAIN_NAME'];
  private static _CLIENT_ID: string = Config['CLIENT_ID'];
  private static _IDENTITY_POOL_ID: string = Config['IDENTITY_POOL_ID'];
  private static _REGION: string = Config['REGION'];
  private static _MOBILE_REDIRECT_URI = 'spacefinder://callback'
  private static _WEB_REDIRECT_URI = 'http://localhost:8100'
  private static _RESPONSE_TYPE = 'code';

  public static getRegion(): string {
    if (DEBUG_MODE) console.log('CognitoUtil.getRegion()');
    return CognitoUtil._REGION;
  }

  public static getHostedUiLoginMobileUrl(): string {
    if (DEBUG_MODE) console.log('CognitoUtil.getHostedUiLoginMobileUrl()');
    return 'https://' + CognitoUtil._USER_POOL_DOMAIN_NAME + '/login?redirect_uri=' + CognitoUtil._MOBILE_REDIRECT_URI + '&response_type=' + CognitoUtil._RESPONSE_TYPE + '&client_id=' + CognitoUtil._CLIENT_ID;
  }

  public static getHostedUiLoginWebUrl(): any {
    if (DEBUG_MODE) console.log('CognitoUtil.getHostedUiLoginWebUrl()');
    return 'https://' + CognitoUtil._USER_POOL_DOMAIN_NAME + '/login?redirect_uri=' + CognitoUtil._WEB_REDIRECT_URI + '&response_type=' + CognitoUtil._RESPONSE_TYPE + '&client_id=' + CognitoUtil._CLIENT_ID;
  }

  private static getHostedUiTokenUrl(): string {
    if (DEBUG_MODE) console.log('CognitoUtil.getHostedUiTokenUrl()');
    return 'https://' + CognitoUtil._USER_POOL_DOMAIN_NAME + '/oauth2/token'
  }

  public static getIdTokenFromAuthCode(authCode, platform: string, http: Http): Promise<any> {
    if (DEBUG_MODE) console.log('CognitoUtil.getIdTokenFromAuthCode()');
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      let requestRedirectUri;
      switch (platform) {
        case 'mobile':
          requestRedirectUri = CognitoUtil._MOBILE_REDIRECT_URI;
          break;
        case 'web':
          requestRedirectUri = CognitoUtil._WEB_REDIRECT_URI;
          break;
      }
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let body =
        'grant_type=authorization_code&' +
        'client_id=' + CognitoUtil._CLIENT_ID + '&' +
        'redirect_uri=' + requestRedirectUri + '&' +
        'code=' + authCode;
      http.post(CognitoUtil.getHostedUiTokenUrl(), body, {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
          //TODO: Catch any post error
        });
    });
  }

  public static getClientId(): string {
    if (DEBUG_MODE) console.log('CognitoUtil.getClientId()');
    return CognitoUtil._CLIENT_ID;
  }

  public static getIdentityPoolId(): string {
    if (DEBUG_MODE) console.log('CognitoUtil.getIdentityPoolId()');
    return CognitoUtil._IDENTITY_POOL_ID;
  }

  public static getUserPoolId(): string {
    if (DEBUG_MODE) console.log('CognitoUtil.getUserPoolId()');
    return CognitoUtil._USER_POOL_ID;
  }

  public static getCognitoIdentityId(): string {
    if (DEBUG_MODE) console.log('CognitoUtil.getCognitoIdentityId()');
    return AWS.config.credentials.identityId;
  }

  public static getUsername(): string {
    if (DEBUG_MODE) console.log('CognitoUtil.getUsername()');
    // Retrieve username from local storage. Return null if it does not exist
    return LocalStorage.get('userName');
  }

  public static setUsername(username: string) {
    if (DEBUG_MODE) console.log('CognitoUtil.setUsername()');
    LocalStorage.set('userName', username);
  }

  public static getUserId(): string {
    // Retrieve user ID from local storage. Return null if it does not exist
    if (DEBUG_MODE) console.log('CognitoUtil.getUserId()');
    return LocalStorage.get('userId');
  }

  public static setCandidate(candidate: object) {
    if (CognitoUtil.isSignedIn()) {
      if (DEBUG_MODE) console.log('CognitoUtil.setCandidate()', candidate);
      LocalStorage.setObject('candidate', candidate);
    }
  }

  public static getCandidate(): object {
    if (CognitoUtil.isSignedIn()) {
      if (DEBUG_MODE) console.log('CognitoUtil.getCandidate()');
      return LocalStorage.getObject('candidate');
    }
    return {};
  }

  public static setCandidateProfileImageUrl(url: string) {
    if (CognitoUtil.isSignedIn()) {
      if (DEBUG_MODE) console.log('CognitoUtil.setCandidateProfileImageUrl()', url);
      LocalStorage.set('candidateProfileImageUrl', url);
    }
  }

  public static getCandidateProfileImageUrl(): string {
    if (CognitoUtil.isSignedIn()) {
      //if (DEBUG_MODE) console.log('CognitoUtil.getCandidateProfileImageUrl()');
      return LocalStorage.get('candidateProfileImageUrl');
    }
    return null;
  }


  public static getUserProfile(): Object {
    // Retrieve user profile attributes from local storage
    if (DEBUG_MODE) console.log('CognitoUtil.getUserProfile()');
    return LocalStorage.getObject('userProfile');
  }

  public static getUserGroup(): string {
    if (DEBUG_MODE) console.log('CognitoUtil.getUserGroup()');
    // Retrieve the user group from the local storage
    return LocalStorage.get("userGroup");
  }

  public static isSignedIn(): boolean {
//    if (DEBUG_MODE) console.log('CognitoUtil.isSignedIn()');

    if (AWS.config.credentials) {
      return (this.getUserState() == UserState.SignedIn);
    }
    return false;
  }
  public static getUserState(): UserState {
//    if (DEBUG_MODE) console.log('CognitoUtil.getUserState()');
    // Retrieve user state from local storage. Return null if it does not exist
    switch (parseInt(LocalStorage.get('userState'))) {
      case 0:
        return UserState.SignedOut;
      case 1:
        return UserState.SignedIn;
      case 2:
        return UserState.PendingConfirmation;
      case 3:
        return UserState.InvalidCredentials;
      default:
        return null;
    }
  };

  public static setUserState(userState: UserState) {
    if (DEBUG_MODE) console.log('CognitoUtil.setUserState()');
    LocalStorage.set('userState', JSON.stringify(userState));
  }

  public static getUserPool() {
    if (DEBUG_MODE) console.log('CognitoUtil.getUserPool()');
    // Initialize Cognito User Pool
    let poolData: Object = {
      UserPoolId: CognitoUtil._USER_POOL_ID,
      ClientId: CognitoUtil._CLIENT_ID
    };
    AWSCognito.config.region = CognitoUtil._REGION;
    AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: CognitoUtil._IDENTITY_POOL_ID
    });

    // Initialize AWS config object with dummy keys - required if unauthenticated access is not enabled for identity pool
    AWSCognito.config.update({accessKeyId: 'dummyvalue', secretAccessKey: 'dummyvalue'});
    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
  }

  public static getCognitoUser() {
    if (DEBUG_MODE) console.log('CognitoUtil.getCognitoUser()');
    let username = LocalStorage.get('userName');

    let userData = {
      Username: username,
      Pool: CognitoUtil.getUserPool()
    };
    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
  }

  public static getCurrentUser() {
    if (DEBUG_MODE) console.log('CognitoUtil.getCurrentUser()');
    return CognitoUtil.getUserPool().getCurrentUser();
  }
}

@Injectable()
export class UserRegistrationService {

  public static signUp(signUpData: IUserRegistration): Promise<void> {
    if (DEBUG_MODE) console.log('UserRegistrationService.signUp()');

    let attributeList: IUserAttribute[] = [];

    let dataEmail: IUserAttribute = {
      Name: 'email',
      Value: signUpData.email
    };

    let dataGivenName: IUserAttribute = {
      Name: 'given_name',
      Value: signUpData.givenName
    };

    let dataFamilyName: IUserAttribute = {
      Name: 'family_name',
      Value: signUpData.familyName
    };

    let attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
    let attributeGivenName = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataGivenName);
    let attributeFamilyName = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataFamilyName);

    attributeList.push(attributeEmail);
    attributeList.push(attributeGivenName);
    attributeList.push(attributeFamilyName);

    let promise: Promise<void> = new Promise<void>((resolve, reject) => {
      CognitoUtil.getUserPool().signUp(signUpData.username, signUpData.password, attributeList, undefined, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        console.log('Username is ' + result.user.getUsername());
        console.log('Sign-up successful!');

        // Update user state to 'pendingConfirmation'
        CognitoUtil.setUsername(signUpData.username);
        CognitoUtil.setUserState(UserState.PendingConfirmation);

        // Sign-up successful. Callback without error.
        resolve();
      });
    });
    return promise;
  }

  public static confirmSignUp(confirmationCode: string): Promise<void> {
    if (DEBUG_MODE) console.log('UserRegistrationService.confirmSignUp()');
    let cognitoUser = CognitoUtil.getCognitoUser();
    let promise: Promise<void> = new Promise<void>((resolve, reject) => {
      cognitoUser.confirmRegistration(confirmationCode, true, (err: Error, data: any) => {
        if (err) {
          reject(err);
          return;
        }
        CognitoUtil.setUserState(UserState.SignedIn);
        resolve(data);
      });
    });
    return promise;
  }

  public static resendConfirmationCode(): Promise<void> {
    if (DEBUG_MODE) console.log('UserRegistrationService.resendConfirmationCode()');
    let cognitoParams = {
      ClientId: CognitoUtil.getClientId(),
      Username: CognitoUtil.getUsername()
    };

    let promise: Promise<void> = new Promise<void>((resolve, reject) => {
      new AWSCognito.CognitoIdentityServiceProvider().resendConfirmationCode(cognitoParams, (err: Error, data: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
    return promise;
  }
}

@Injectable()
export class UserLoginService {
  private static _userTokens = {
    accessToken: undefined,
    idToken: undefined,
    refreshToken: undefined
  };

  public static getAccessToken() {
    if (DEBUG_MODE) console.log('UserLoginService.getAccessToken()');
    let accessToken: string = UserLoginService._userTokens.accessToken;
    if (!accessToken) {
      // retrieve from Local Storage if it exists
      accessToken = LocalStorage.get('userTokens.accessToken');
      UserLoginService._userTokens.accessToken = accessToken;
    }
    return accessToken;
  };

  public static getIdToken() {
    if (DEBUG_MODE) console.log('UserLoginService.getIdToken()');
    let idToken: string = UserLoginService._userTokens.idToken;
    if (!idToken) {
      // retrieve from Local Storage if it exists
      idToken = LocalStorage.get('userTokens.idToken');
      UserLoginService._userTokens.idToken = idToken;
    }
    return idToken;
  };

  public static getRefreshToken() {
    if (DEBUG_MODE) console.log('UserLoginService.getRefreshToken()');
    let refreshToken: string = UserLoginService._userTokens.refreshToken;
    if (!refreshToken) {
      // retrieve from Local Storage if it exists
      refreshToken = LocalStorage.get('userTokens.refreshToken');
      UserLoginService._userTokens.refreshToken = refreshToken;
    }
    return refreshToken;
  }

  public static getAwsAccessKey() {
    if (DEBUG_MODE) console.log('UserLoginService.getAwsAccessKey()');
    if (AWS.config.credentials == null) {
      return LocalStorage.get('userTokens.awsAccessKeyId');
    }
    return AWS.config.credentials.accessKeyId || LocalStorage.get('userTokens.awsAccessKeyId');
  }

  public static getAwsSecretAccessKey() {
    if (DEBUG_MODE) console.log('UserLoginService.getAwsSecretAccessKey()');
    return AWS.config.credentials.secretAccessKey || LocalStorage.get('userTokens.awsSecretAccessKey');
  }

  public static getAwsSessionToken() {
    if (DEBUG_MODE) console.log('UserLoginService.getAwsSessionToken()');
    return AWS.config.credentials.sessionToken || LocalStorage.get('userTokens.awsSessionToken');
  }

  private static clearUserState() {
    if (DEBUG_MODE) console.log('UserLoginService.clearUserState()');
    // Clear user tokens
    UserLoginService._userTokens = {
      accessToken: undefined,
      idToken: undefined,
      refreshToken: undefined
    };

    LocalStorage.set('userTokens.accessToken', null);
    LocalStorage.set('userTokens.idToken', null);
    LocalStorage.set('userTokens.refreshToken', null);
    LocalStorage.set('userTokens.awsAccessKeyId', null);
    LocalStorage.set('userTokens.awsSecretAccessKey', null);
    LocalStorage.set('userTokens.awsSessionToken', null);

    // Clear user state
    CognitoUtil.setUserState(UserState.SignedOut);

    // Clear user profile attributes
    LocalStorage.set('userProfile', null);

    // Clear username and user ID attributes
    LocalStorage.set('userId', null);
    LocalStorage.set('userName', null);

    //Clear user profile image URL
    LocalStorage.set('candidateProfileImageUrl', null);

  };

  public static signIn(userLogin: IUserLogin): Promise<void> {
    if (DEBUG_MODE) console.log('UserLoginService.signIn()');
    let authenticationData = {
      Username: userLogin.username,
      Password: userLogin.password
    };

    let authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
    CognitoUtil.setUsername(userLogin.username);
    if (DEBUG_MODE) console.log('Authenticating user ' + userLogin.username);

    let cognitoUser = CognitoUtil.getCognitoUser();
    let promise: Promise<void> = new Promise<void>((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          UserLoginService.completeSignIn(result.getAccessToken().getJwtToken(),result.getIdToken().getJwtToken(),result.getRefreshToken().getToken()).then(() => {
            resolve();
          }).catch((err) => {
            reject(err);
          });
        },
        onFailure: function (err) {
          // Check for user not confirmed exception
          if (err.code === 'UserNotConfirmedException') {
            // Set user state to pending confirmation
            CognitoUtil.setUserState(UserState.PendingConfirmation);
          } else {
            CognitoUtil.setUserState(UserState.InvalidCredentials);
          }
          reject(err);
        }
      });
    });
    return promise;
  }

  public static completeSignIn(accessToken: string, idToken: string, refreshToken: string): Promise<void> {
    if (DEBUG_MODE) console.log('UserLoginService.completeSignIn()');
    let promise: Promise<void> = new Promise<void>((resolve, reject) => {
      // Save user tokens to local state
      UserLoginService._userTokens.accessToken = accessToken;
      UserLoginService._userTokens.idToken = idToken;
      UserLoginService._userTokens.refreshToken = refreshToken;

      LocalStorage.set('userTokens.idToken', UserLoginService._userTokens.idToken);
      if (DEBUG_MODE) console.log('%cCognito User Pools Identity Token: ', Logger.LeadInStyle, UserLoginService.getIdToken());
      LocalStorage.set('userTokens.accessToken', UserLoginService._userTokens.accessToken);
      if (DEBUG_MODE) console.log('%cCognito User Pools Access Token: ', Logger.LeadInStyle, UserLoginService.getAccessToken());
      LocalStorage.set('userTokens.refreshToken', UserLoginService._userTokens.refreshToken);
      if (DEBUG_MODE) console.log('%cCognito User Pools Refresh Token: ', Logger.LeadInStyle, UserLoginService.getRefreshToken());

      /*
      Extract the user group from the identity token.
      First, get the identity token payload and then perform a Base64 decoding
      so you can later extract the user group.
      */
      let idTokenPayload = UserLoginService._userTokens.idToken.split('.')[1];
      let idTokenDecoded = JSON.parse(sjcl.codec.utf8String.fromBits(sjcl.codec.base64url.toBits(idTokenPayload)));
      CognitoUtil.setUsername(idTokenDecoded["cognito:username"]);
      let userName = idTokenDecoded["cognito:username"];
      let userGroup = idTokenDecoded["cognito:groups"];
      if (userGroup && userGroup.length > 0) {
        LocalStorage.set('userGroup', userGroup);
      } else {
        /*
          The user group is set only for the pre-defined users. By default
          we assign them to client group.
        */
        userGroup = 'clientGroup';
        LocalStorage.set('userGroup', userGroup[0]);
      }
      if (DEBUG_MODE) console.log('%cCognito User Pools User Groups: ' + '%c%s belongs to group %s', Logger.LeadInStyle, "black",
        userName, userGroup[0]);

      // Set user state to authenticated
      CognitoUtil.setUserState(UserState.SignedIn);

      // Read user attributes and write to console
      if (DEBUG_MODE) console.log('%cCognito User Pools User Attributes: ', Logger.LeadInStyle, idTokenDecoded);
      // Write user profile attributes to local storage
      LocalStorage.setObject('userProfile', idTokenDecoded);

      UserLoginService.getAwsCredentials().then(() => {
        LocalStorage.set('userId', CognitoUtil.getCognitoIdentityId());
        if (DEBUG_MODE) console.log('%cCognito Identity ID: ', Logger.LeadInStyle, CognitoUtil.getCognitoIdentityId());
        LocalStorage.set('userTokens.awsAccessKeyId', AWS.config.credentials.accessKeyId);
        if (DEBUG_MODE) console.log('%cAWS Access Key ID: ', Logger.LeadInStyle, AWS.config.credentials.accessKeyId);
        LocalStorage.set('userTokens.awsSecretAccessKey', AWS.config.credentials.secretAccessKey);
        if (DEBUG_MODE) console.log('%cAWS Secret Access Key: ', Logger.LeadInStyle, AWS.config.credentials.secretAccessKey);
        LocalStorage.set('userTokens.awsSessionToken', AWS.config.credentials.sessionToken);
        if (DEBUG_MODE) console.log('%cAWS Session Token: ', Logger.LeadInStyle, AWS.config.credentials.sessionToken);

        // Resolve promise if all is successful
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
    return promise;
  }

  public static signOut() {
    if (DEBUG_MODE) console.log('UserLoginService.signOut()');
    // Clear local user state
    UserLoginService.clearUserState();
    // Logout from Cognito service
    CognitoUtil.getCognitoUser().signOut();
    AWS.config.credentials.clearCachedId();
  }

  public static globalSignOut() {
    if (DEBUG_MODE) console.log('UserLoginService.globalSignOut()');
    // Clear local user state
    UserLoginService.clearUserState();
    // Logout from Cognito service
    CognitoUtil.getCognitoUser().globalSignOut();
    AWS.config.credentials.clearCachedId();
  }

  public static changePassword(previousPassword: string, proposedPassword: string): Promise<void> {
    if (DEBUG_MODE) console.log('UserLoginService.changePassword()');
    let promise: Promise<void> = new Promise<void>((resolve, reject) => {
      // first, load the valid tokens cached in the local store, if they are available
      // see: https://github.com/aws/amazon-cognito-identity-js/issues/71
      let cognitoUser = CognitoUtil.getCognitoUser();
      cognitoUser.getSession((err: Error, session: any) => {
        if (err) {
          reject(err);
          return;
        }
        cognitoUser.changePassword(previousPassword, proposedPassword, (err: Error, result: any) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        });
      });
    });
    return promise;
  }

  public static forgotPassword(username: string): Promise<void> {
    if (DEBUG_MODE) console.log('UserLoginService.forgotPassword()');
    // Set target username
    CognitoUtil.setUsername(username);

    // Get Cognito User with session
    let cognitoUser = CognitoUtil.getCognitoUser();

    let promise: Promise<void> = new Promise<void>((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: (result) => {
          console.log('Initiated reset password for username ' + username);
          resolve(result);
        },
        onFailure: (err) => {
          console.log('Failed to initiate reset password for username ' + username);
          reject(err);
          return;
        }
      });
    });
    return promise;
  }

  public static confirmForgotPassword(username: string, verificationCode: string, password: string): Promise<void> {
    if (DEBUG_MODE) console.log('UserLoginService.confirmForgotPassword()');
    // Set target username
    CognitoUtil.setUsername(username);

    // Get Cognito User with session
    let cognitoUser = CognitoUtil.getCognitoUser();

    let promise: Promise<void> = new Promise<void>((resolve, reject) => {
      cognitoUser.confirmPassword(verificationCode, password, {
        onSuccess: (result) => {
          console.log('Password successfully reset for username ' + username);
          resolve(result);
        },
        onFailure: (err) => {
          console.log('Password was not reset for username ' + username);
          console.log(`Error: ${err.name}. ${err.message}`);
          reject(err);
          return;
        }
      });
    });
    return promise;
  }

  public static getAwsCredentials(): Promise<void> {
    if (DEBUG_MODE) console.log('UserLoginService.getAwsCredentials()');
    let promise: Promise<void> = new Promise<void>((resolve, reject) => {
      // TODO: Integrate this method as needed into the overall module
      // Add the User's Id token to the Cognito credentials login map
      let logins = {};
      logins['cognito-idp.' + CognitoUtil.getRegion() + '.amazonaws.com/' + CognitoUtil.getUserPoolId()] = LocalStorage.get('userTokens.idToken');;

      // Set Cognito Identity Pool details
      AWS.config.region = CognitoUtil.getRegion();
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: CognitoUtil.getIdentityPoolId()
      });

      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: CognitoUtil.getIdentityPoolId(),
        Logins: logins
      });

      // Call refresh method to authenticate user and get new temp AWS credentials
      if (AWS.config.credentials.needsRefresh()) {
        AWS.config.credentials.clearCachedId();
        AWS.config.credentials.get((err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      } else {
        AWS.config.credentials.get((err) => {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }
          resolve();
        });
      }
    });
    return promise;
  }

  // Added by mcdaniel, march-2018
  public static deleteUser(): Promise<void> {
    Logger.banner("Delete Account");

    let promise: Promise<void> = new Promise<void>((resolve, reject) => {
      // first, load the valid tokens cached in the local store, if they are available
      // see: https://github.com/aws/amazon-cognito-identity-js/issues/71
      let cognitoUser = CognitoUtil.getCognitoUser();
      cognitoUser.getSession((err: Error, session: any) => {
        if (err) {
          if (DEBUG_MODE) console.log('UserProfileService.getUserAttributes() - cognitoUser.getSession() - error', Logger.LeadInErrorStyle, err);
          reject(err);
          return;
        }
        cognitoUser.deleteUser( (err: Error, result: any) => {
          if (err) {
            if (DEBUG_MODE) console.log('UserProfileService.getUserAttributes() - cognitoUser.DeleteUser() - error', Logger.LeadInErrorStyle, err);
            reject(err);
            return;
          }

          if (DEBUG_MODE) console.log('UserProfileService.getUserAttributes() - cognitoUser.DeleteUser() - success', Logger.LeadInStyle, result);
          resolve(result);
        });
      });
    });
    return promise;
  }


}

export class UserProfileService {
  public static getUserAttributes() {
    if (DEBUG_MODE) console.log('UserProfileService.getUserAttributes()');
    let promise: Promise<Object> = new Promise<Object>((resolve, reject) => {
      let cognitoUser = CognitoUtil.getCognitoUser();
      cognitoUser.getSession((err: Error, session: any) => {
        if (err) {
          reject(err);
          return;
        }
        cognitoUser.getUserAttributes((err: Error, result: any) => {
          if (err) {
            reject(err);
            return;
          }
          let userAttributes = {};
          for (var i = 0; i < result.length; i++) {
            userAttributes[result[i].getName()] = result[i].getValue();
          }
          console.log('%cCognito User Pools User Attributes: ', Logger.LeadInStyle, userAttributes);
          // Write user profile attributes to local storage
          LocalStorage.setObject('userProfile', userAttributes);
          resolve(userAttributes);
        });
      })
    });
    return promise;
  }
}

@Injectable()
export class LocalStorage {

  private static getLocalStorage() {
    let storage = window.localStorage || localStorage;
    if (!localStorage) {
      throw new Error('Browser does not support local storage');
    }
    return storage;
  }

  public static set(key: string, value: string): void {
    LocalStorage.getLocalStorage().setItem(key, value);
  }

  public static get(key: string): string {
    return LocalStorage.getLocalStorage().getItem(key);
  }

  public static setObject(key: string, value: any): void {
    LocalStorage.set(key, JSON.stringify(value));
  }

  public static getObject(key: string): any {
    return JSON.parse(LocalStorage.get(key) || '{}');
  }

  public static remove(key: string): any {
    LocalStorage.getLocalStorage().removeItem(key);
  }
}
export const LOCAL_STORAGE_PROVIDERS: any[] = [
  {provide: LocalStorage, useClass: LocalStorage}
];
