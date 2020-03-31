import gql from "graphql-tag";

export const GETBYSLUG = gql`
  query findOneBySlug($slug: String!) {
    findOneBySlug(slug: $slug) {
        title
        deletedAt
      }
    }
`;


export const UPDATECATEGORY = gql`
  mutation updateCategory($input: CategoryUpdateInput!, $title: String!) {
    updateCategory(input: $input, title: $title) {
      title
    }
  }
`;

export const REMOVECATEGORY = gql`
  mutation removeCategory($title: String!) {
    removeCategory(title: $title) {
      title
    }
  }
`;

export const RECOVERCATEGORY = gql`
  mutation recoverCategory($title: String!) {
    recoverCategory(title: $title) {
      title
    }
  }
`;