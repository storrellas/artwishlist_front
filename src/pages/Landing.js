import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { InputGroup, FormControl } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import './Landing.scss';



// Redux
import { performSearch, MODE } from "../redux";
import { connect } from "react-redux";

// Assets
import factureLogo from '../assets/facture_logo.svg';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'


// Project imports
import Search from '../components/Search'
import PaintingDetail from '../components/PaintingDetail';

const mapStateToProps = (state) => {
  return {
    mode: state.mode,
    paintingId: state.paintingId,
  };
}


const mapDispatchToProps = (dispatch) => {
  return {
      performSearch: (payload) => dispatch(performSearch(payload))
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
    if (e.keyCode === 13){
      this.performSearch()
    }      
  }

  performSearch(){
    const { qParameter } = this.state;
    this.props.performSearch({mode: MODE.SEARCH, searchPattern: qParameter})
  }

  componentDidUpdate(){
    
    if( this.state.paintingId !== this.props.paintingId ||
        this.state.mode !== this.props.mode){
          console.log("component did update - Landing", this.props.mode, this.props.paintingId)
          this.setState({
            paintingId: this.props.paintingId,
            mode: this.props.mode
          })
    }
    
  }

  render() {
    const { mode } = this.state;
    console.log("ReRender", mode)

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
          {mode==MODE.SEARCH?
          <Search />
          :
          <PaintingDetail paintingId={7122497} />
          }
        </div>
      </Container>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Landing));
