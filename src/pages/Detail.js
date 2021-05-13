import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { InputGroup, FormControl } from 'react-bootstrap';

// Assets
import factureLogo from '../assets/facture_logo.svg';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

class Detail extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {
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

        <Row>
          <Col>
          asdfasdf
          </Col>
        </Row>

      </Container>
    );
  }
}


export default Detail;
