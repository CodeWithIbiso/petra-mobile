import {gql} from '@apollo/client';

export const LOGIN = gql`
  mutation SignIn($input: UserSignInInput!) {
    signIn(input: $input) {
      code
      message
      user {
        id
        image
        firstname
        lastname
        username
        email
        password
        emailVerified
        verificationCode
        verificationCodeExpiry
        paswordResetCode
        passwordResetCodeExpiry
        publicKey
        secretKey
        createdAt
      }
      token
    }
  }
`;

export const REGISTER = gql`
  mutation SignUp($input: UserInput!) {
    signUp(input: $input) {
      user {
        id
        image
        firstname
        lastname
        username
        email
        password
        emailVerified
        verificationCode
        verificationCodeExpiry
        paswordResetCode
        passwordResetCodeExpiry
        publicKey
        secretKey
        createdAt
      }
      code
      token
      message
    }
  }
`;

export const SET_USER_CREDENTIALS = gql`
  mutation SetUserCredentials($publicKey: String!, $secretKey: String!) {
    setUserCredentials(publicKey: $publicKey, secretKey: $secretKey) {
      user {
        id
        image
        firstname
        lastname
        username
        email
        password
        emailVerified
        verificationCode
        verificationCodeExpiry
        paswordResetCode
        passwordResetCodeExpiry
        publicKey
        secretKey
        createdAt
      }
      code
      token
      message
    }
  }
`;
