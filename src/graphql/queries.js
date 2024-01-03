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

export const RESEND_EMAIL_VERIFICATION = gql`
  mutation ResendVerificationCode {
    resendVerificationCode {
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
export const VERIFY_EMAIL = gql`
  mutation VerifyUserAccount($verificationCode: Int!) {
    verifyUserAccount(verificationCode: $verificationCode) {
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

export const REQUEST_PASSWORD_RESET = gql`
  mutation ForgotPasswordRequest($input: passwordResetRequestInput) {
    forgotPasswordRequest(input: $input) {
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

export const RESET_PASSWORD = gql`
  mutation ResetPassword($input: resetPasswordInput) {
    resetPassword(input: $input) {
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

export const CREATE_UPDATE_SPOT = gql`
  mutation CreateOrUpdateSpot($input: SpotInput) {
    createOrUpdateSpot(input: $input) {
      spot {
        id
        creator
        contactNumber
        publicKey
        title
        location {
          name
          latitude
          longitude
        }
        category
        about
        description
        categories {
          name
          image
        }
        popularCategories {
          name
          image
          price
          currency
        }
        image
        video
        rating
        likes
        likesCount
        views
        viewsCount
      }
      code
      token
      message
    }
  }
`;

export const GET_USER_SPOTS = gql`
  query GetUserSpots($creator: ID!) {
    getUserSpots(creator: $creator) {
      id
      creator
      contactNumber
      publicKey
      title
      location {
        name
        latitude
        longitude
      }
      category
      about
      description
      categories {
        name
        image
      }
      popularCategories {
        name
        image
        price
        currency
      }
      image
      video
      rating
      likes
      likesCount
      views
      viewsCount
    }
  }
`;

export const DELETE_SPOTS = gql`
  mutation DeleteSpots($input: SpotIdsInput) {
    deleteSpots(input: $input) {
      code
      token
      message
    }
  }
`;

export const GET_POPULAR_SPOTS = gql`
  query GetPopularSpots {
    getPopularSpots {
      id
      creator
      contactNumber
      publicKey
      title
      location {
        name
        latitude
        longitude
      }
      category
      about
      description
      categories {
        name
        image
      }
      popularCategories {
        name
        image
        price
        currency
      }
      image
      video
      rating
      likes
      likesCount
      views
      viewsCount
    }
  }
`;

export const GET_SPOTS = gql`
  query GetSpots {
    getSpots {
      id
      creator
      contactNumber
      publicKey
      title
      location {
        name
        latitude
        longitude
      }
      category
      about
      description
      categories {
        name
        image
      }
      popularCategories {
        name
        image
        price
        currency
      }
      image
      video
      rating
      likes
      likesCount
      views
      viewsCount
    }
  }
`;

export const UPLOAD_FILE = gql`
  mutation Mutation($input: FileInput) {
    uploadFile(input: $input) {
      message
      url
      code
      token
    }
  }
`;
