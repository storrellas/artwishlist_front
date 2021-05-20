import React from 'react';
import { withRouter } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap';

// Redux
import { connect } from "react-redux";

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const mapDispatchToProps = (dispatch) => {
  return {};
}


class Filtering extends React.Component {

  constructor(props){
    super(props)
    this.state = {}    
  }

  render(){


    return (
      <>
        <Row className="filtering" style={{ padding: '0 15px 0 15px'}}>
          <Col>
            <div className="title w-100 text-left">Filters</div>
          </Col>
        </Row>
        <Row className="filtering" style={{ padding: '0 15px 0 15px'}}>

          <Col className="mt-3" md={2}>
            <select>
              <option>Category</option>
              <option>Paintings</option>
              <option>Works On Paper</option>
              <option>Prints</option>

              <option>Sculpture</option>
              <option>Phtographs</option>
              <option>Other</option>
              <option>Painting</option>

              <option>Photography</option>
              <option>Design</option>
              <option>Drawings</option>
              <option>Video</option>
              <option>Installation</option>
              <option>...</option>
            </select>
          </Col>
          <Col className="mt-3" md={2}>              
            <select>
              <option>Source Type</option>
              <option>AUCTION</option>
              <option>CAT RAIS</option>
              <option>ONLINE</option>
              <option>MUSEUM</option>
              <option>PRIVATE COLLECTION</option>
            </select>
          </Col>
          <Col className="mt-3" md={2}>              
            <select>
              <option>Auction Sales</option>
              <option>Option1</option>
              <option>Option1</option>
              <option>Option1</option>
            </select>
          </Col>
          <Col className="mt-3" md={2}>              
            <select>
              <option>Other</option>
              <option>Option1</option>
              <option>Option1</option>
              <option>Option1</option>
            </select>
          </Col>

          <Col className="mt-3" md={2}>
            <div className="filtering-input w-100">
              <div>
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <input type="text" 
                  placeholder="Search by artist"
                  onChange={e => this.setState({ searchPattern: e.target.value })}
                  onKeyDown={e => this.handleKeyDown(e)} />
            </div>
          </Col>

          <Col className="mt-3" md={2}>
            <div className="w-100 d-flex">
              <select>
                <option>Price (High to Low)</option>
                <option>Price (Low to High)</option>
                <option>Title (High to Low)</option>
                <option>Title (Low to High)</option>
                <option>Auction Date (High to Low)</option>
                <option>Auction Date (Low to High)</option>
                <option>Year of work (High to Low)</option>
                <option>Year of work (Low to High)</option>
              </select>
            </div>
          </Col>
        </Row>
      </>
    )
  }

}


export default connect(null, mapDispatchToProps)(withRouter(Filtering));
