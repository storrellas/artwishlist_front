import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import './Landing.scss';



// Redux
import { performSearch, MODE, showDetail } from "../redux";
import { connect } from "react-redux";

// Assets
import factureLogo from '../assets/facture_logo.svg';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'


// Project imports
import Search from '../components/Search'
import Painting from '../components/Painting';

const mapStateToProps = (state) => {
  return {
    mode: state.mode,
    paintingId: state.paintingId
  };
}


const mapDispatchToProps = (dispatch) => {
  return {
      performSearch: (payload) => dispatch(performSearch(payload)),
      showDetail: (payload) => dispatch(showDetail(payload))
  };
}

class Landing extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      searchPattern: '',
      mode: MODE.SEARCH,
      paintingId: 0,
    }
  }

  handleKeyDown(e){    
    if (e.keyCode === 13)
      this.performSearch()    
  }

  performSearch(){
    const { searchPattern } = this.state;
    this.props.performSearch({mode: MODE.SEARCH, searchPattern: searchPattern})
  }

  componentDidUpdate(prevProps, prevState){
    if( prevProps.mode !== this.props.mode){
      this.setState({
        paintingId: this.props.paintingId,
        mode: this.props.mode
      })
    }
  }

  componentDidMount(){

    // Grab ME oid
    const { match: { params } } = this.props;
    const paintingId = params.id;
    if( paintingId !== undefined )
      this.props.showDetail({mode: MODE.DETAIL, paintingId: paintingId})
    

  }

  render() {
    const { mode, paintingId } = this.state;
    console.log("ReRender")

    return (
      <Container>
        <Row style={{ margin: '3em 0 1em 0'}}>
          <Col md={5}>
            <img height="50" alt="logo" className="mt-3" src={factureLogo}></img>
          </Col>
          <Col  md={7} className="d-flex justify-content-center align-items-center">            
            <div className="search-input mt-3 w-100">
              <div>
                <FontAwesomeIcon icon={faSearch}
                              onClick={(e) => this.performSearch()} />
              </div>
              <input type="text" 
                  placeholder="Search by artist"
                  onChange={e => this.setState({ searchPattern: e.target.value })}
                  onKeyDown={e => this.handleKeyDown(e)} />
            </div>
          </Col>
        </Row>

        <div style={{ height: '75vh'}}>
          {mode === MODE.SEARCH?
          <Search />
          :
          <Painting paintingId={paintingId} />
          }
        </div>
      </Container>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Landing));
