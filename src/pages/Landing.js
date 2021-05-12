import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { InputGroup, FormControl } from 'react-bootstrap';

import './Landing.scss';

// Axios
import axios from 'axios';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons'

class Landing extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      qParameter: ''
    }
  }

  handleKeyDown(e){    
    if (e.keyCode === 13)
      this.performSearch(e)
  }

  async performSearch(){
    const { qParameter } = this.state;

    
    try{
      const { qParameter } = this.state;
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/aw_lots/_search?q=${qParameter}&size=10`)
      console.log("repsonse ", response.data)
      /*
      const options = {
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
      }
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/aw_lots/_search?q=${qParameter}`, options);
      if (response.ok) { // if HTTP-status is 200-299
        // get the response body (the method explained below)
        let json = await response.json();
        const data = await response.json()
        console.log("response ", json)
      } else {
        alert("HTTP-Error: " + response.status);
      }
      /**/



    }catch(error){
      console.log("FAILED")

    }  
    /**/
    /*
    const options = {
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
    }
    fetch(`${process.env.REACT_APP_API_URL}/api/aw_lots/_search?q=${qParameter}`, options)
      .then( response => {
        console.log("ok ", response)
        if (!response.ok) { throw response }
          console.log( "response ", response.json() )  //we only get here if there is no error
      })
      .catch( err => {
        console.log("err", err.text() )
      })
    /**/

  }

  render() {
    console.log("ReRender")
    return (
      <Container>
        <Row style={{ marginTop: '3em'}}>
          <Col className="mt-3">
            <div style={{ fontSize: '40px'}}>Facture</div>
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
                  <InputGroup.Text style={{ background: 'white', borderRadius: ' 0 10px 10px 0'}}>
                    <FontAwesomeIcon icon={faSearch}
                            onClick={(e) => alert("Perform search")} />
                  </InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </div>

          </Col>
        </Row>
        <Row>
          <Col className="mt-3 d-flex justify-content-center align-items-center" 
            style={{ background: '#EEEEEE', borderRadius: '5px', height: '70vh', padding: "0", margin: "0"}}>
            <div className="d-flex btn-search flex-column justify-content-center align-items-center" 
              style={{ width: '300px', height: '300px', fontSize:'14px', borderRadius: '50%'}}>
                <div>
                  <FontAwesomeIcon icon={faPlus}
                            onClick={(e) => alert("Perform search")} style={{ fontSize: '140px' }}/>
                </div>
                <div className="font-weight-bold">Upload Image</div>
            </div>
          
          </Col>
        </Row>
      </Container>
    );
  }
}


export default Landing;
