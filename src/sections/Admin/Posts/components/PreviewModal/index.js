import React from 'react'
import { Button, Modal } from "react-bootstrap";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";

const activeOrDisactivate = gql`
  mutation activeOrDisActivePost($title: String!) {
    activeOrDisActivePost(title: $title) {
      title
    }
  }
`
export const PreviewModal = ({ showModal, handleCloseOpenModal, post, refetch }) => {
  const { title, content, isActive } = post;
  const [handleStatus] = useMutation(activeOrDisactivate);

  const handlePostStatus = async () => {
    try {
      await handleStatus({
        variables: {
          title
        }
      })
      refetch();
      handleCloseOpenModal();
      toast("Status succesfully changed", {
        type: "success"
      });
    } catch (error) {
      toast(`Error! ${error.message}`, {
        type: "error"
      });
    }
  }



  return (
    <>
      <Modal show={showModal} onHide={handleCloseOpenModal} dialogClassName="modal-100w">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{
            __html: content
          }}></div>
        </Modal.Body>
        <Modal.Footer>
          {
            isActive ? (
              <Button variant="secondary" onClick={handlePostStatus}>
                Disable Post
              </Button>
            ) : (
                <Button variant="secondary" onClick={handlePostStatus}>
                  Activate Post
                </Button>
              )
          }
        </Modal.Footer>
      </Modal>
    </>
  );
}