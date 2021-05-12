import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { InputGroup, FormControl } from 'react-bootstrap';

import './Landing.scss';

// Axios
import axios from 'axios';


// Assets
import factureLogo from '../assets/facture_logo.svg';
import upload from '../assets/upload.svg';
import uploadHover from '../assets/upload_hover.svg';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import AnimateHeight from 'react-animate-height';

const Card = (props) => {
  const dummyImageUrl = "http://www.artnet.com/WebServices/images/ll933731llgG4ECfDrCWBHBAD/pablo-picasso-television:-gymnastique-au-sol,-avec-spectateurs,-from-the-347-series.jpg"

  
  const { painting } = props;
  console.log("props ", props.painting)

  return (
    <div style={{ border: '1px solid #AAAAAA'}}>
      <div className="text-center font-weight-bold" 
        style={{ background: '#AAAAAA', color: 'white', padding: '0.5em 0 0.5em 0'}}>
          Catalogue Raisonne
      </div>
      <div style={{ padding: '1em 20% 1em 20%', background: '#DDDDDD'}}>
        <img className="w-100" alt="dummyImage" src={dummyImageUrl}></img>
      </div>
      <div className="p-3" style={{ fontSize: '12px', height: '300px', overflowY: 'scroll'}}>
        <div>
          <b>{painting.artist[0]}</b>
        </div>
        <div style={{ color: 'grey'}}>
          <div>{painting.title[0]} (Version 'O'), {painting.year_v[0]}</div>
          <div>114 x 146.4 cm (44.88 x 57.64 in)</div>
          <div>Paintings</div>
        </div>
        <div>
          <b>Nr. 345</b>
        </div>
        <div style={{ color: 'grey'}}>
          Baer (1994) Picasso peintre-graveur.
          Catalogue raisonné de l'oeuvre
        </div>
        <a href="/">Download PDF</a>
      </div>
    </div>
  )
}

class Landing extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      qParameter: '',
      searchImage: upload,
      searchFull: true,
      listShow: false,
      paintingList: []
    }
  }

  handleKeyDown(e){    
    if (e.keyCode === 13)
      this.performSearch(e)
  }

  async performSearch(){
    try{
      const { qParameter, searchFull, listShow } = this.state;

      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/aw_lots/_search?q=${qParameter}&size=10&offset=20`)
      console.log("repsonse ", response.data)

      
      this.setState({
          searchFull: false, 
          listShow: true, 
          paintingList: response.data.results})
    }catch(error){
      console.log("FAILED")

    }  
  }

  render() {
    
    const { searchFull, listShow, searchImage, paintingList } = this.state;
    console.log("ReRender")


    const cardList = new Array(10).fill(0);
    console.log("cardList ", cardList )
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
                  <InputGroup.Text style={{ background: 'white', borderRadius: ' 0 10px 10px 0'}}>
                    <FontAwesomeIcon icon={faSearch}
                            onClick={(e) => alert("Perform search")} />
                  </InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </div>

          </Col>
        </Row>
        <div style={{ height: '70vh'}}>
          <AnimateHeight
            id='example-panel'
            duration={ 500 }
            height={ searchFull? '100%': '20%' } // see props documentation below
            className="d-flex flex-column justify-content-center align-items-center" 
            contentClassName="animated-search"
          >
            <img className="h-100" alt="background" src={searchImage}
                            onMouseEnter={(e) => this.setState({ searchImage: uploadHover}) } 
                            onMouseLeave={(e) => this.setState({ searchImage: upload})}
                            style={{ maxHeight: "300px" }}></img>
          </AnimateHeight>


          <AnimateHeight
            id='example-panel'
            duration={ 500 }
            height={ listShow? '80%': '0%' } // see props documentation below
            className="d-flex flex-column justify-content-center align-items-center" 
            contentClassName="animated-list"
          >
              <div className="d-flex justify-content-center flex-wrap w-100 h-100 p-3" 
                style={{ overflowY: 'scroll'}}>

                {paintingList.map( (item, id) => 
                  <div key={id} style={{ width: '20%', margin: '1em'}}>
                    <Card painting={item} />
                  </div>
                )}
              </div>
            
          </AnimateHeight>


        </div>




      </Container>
    );
  }
}


export default Landing;
