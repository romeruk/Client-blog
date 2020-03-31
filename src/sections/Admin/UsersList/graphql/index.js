import gql from "graphql-tag";

export const RECOVERUSER = gql`
  mutation recoverUser($email: String!) {
    recoverUser(email: $email) {
        firstName
        lastName
        email
    }
  }
`;

export const REMOVEUSER = gql`
  mutation removeUser($email: String!) {
    removeUser(email: $email) {
        firstName
        lastName
        email
    }
  }
`;


export const GETUSERS = gql`
  query findAllUsers($limit: Float!, $page: Float!) {
    findAllUsers(limit: $limit, page: $page) {
      total
      users {
        firstName
        lastName
        email
        role
        verified
        deletedAt
      }
    }
  }
`;