import React from 'react'
import { useQuery } from "@apollo/react-hooks";
import { Nav } from 'react-bootstrap';
import gql from 'graphql-tag';
import { X } from 'react-bootstrap-icons';
import { LoadingComponent } from '../../../../lib';

const GETALLCATEGORIES = gql`
  query getAllCategories {
    getAllCategories {
      title
    }
  }
`

export const FilterBar = React.forwardRef(({ activeSidebar, handleSideBar, activeCategories, handleCategories }, ref) => {
  const { loading, error, data } = useQuery(GETALLCATEGORIES, {
    fetchPolicy: "cache-and-network"
  });


  if (loading) return (
    <Nav ref={ref} className={`${activeSidebar ? "flex-column active" : "flex-column"}`} id="sidebar">
      <div className="d-flex justify-content-end mb-3">
        <X onClick={handleSideBar} size={35} />
      </div>
    loading filter
    </Nav>
  )
  if (error) return (
    <Nav ref={ref} className={`${activeSidebar ? "flex-column active" : "flex-column"}`} id="sidebar">
      <div className="d-flex justify-content-end mb-3">
        <X onClick={handleSideBar} size={35} />
      </div>
      Error loading filter
    </Nav>
  );

  const categories = data.getAllCategories;

  return (
    <Nav ref={ref} className={`${activeSidebar ? "flex-column active" : "flex-column"}`} id="sidebar">
      <div className="d-flex justify-content-end mb-3">
        <X onClick={handleSideBar} size={35} />
      </div>
      {
        categories.map((category) => (
          <div key={category.title} className="custom-control custom-checkbox">
            <input checked={activeCategories.includes(category.title)} onChange={() => handleCategories(category.title)} type="checkbox" className="custom-control-input" id={category.title} disabled="" />
            <label className="custom-control-label" htmlFor={category.title}>{category.title}</label>
          </div>
        ))
      }
    </Nav>
  )
});
