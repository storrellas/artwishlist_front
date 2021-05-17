import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { InputGroup, FormControl } from 'react-bootstrap';
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
      qParameter: '',
      mode: MODE.SEARCH,
      paintingId: 0,
    }
  }

  handleKeyDown(e){    
    if (e.keyCode === 13)
      this.performSearch()    
  }

  performSearch(){
    const { qParameter } = this.state;
    this.props.performSearch({mode: MODE.SEARCH, searchPattern: qParameter})
  }

  componentDidUpdate(prevState, prevProps){
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
        <Row style={{ marginTop: '3em'}}>
          <Col className="mt-3">
            <img height="50" alt="logo" src={factureLogo}></img>
          </Col>
        </Row>

        <Row>
          <Col style={{ marginTop: '3em'}}>
            
            <div style={{ padding: '0 20% 0 20%'}}>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Search by artist"                  
                  style={{ borderRadius: '10px 0 0 10px ' }}
                  onChange={e => this.setState({ qParameter: e.target.value })}
                  onKeyDown={e => this.handleKeyDown(e)} />
                <InputGroup.Append >
                  <InputGroup.Text style={{ background: 'white', borderRadius: ' 0 10px 10px 0', cursor: 'pointer'}}>
                    <FontAwesomeIcon icon={faSearch}
                            onClick={(e) => this.performSearch()} />
                  </InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </div>

          </Col>
        </Row>
        <div style={{ height: '70vh'}}>
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
