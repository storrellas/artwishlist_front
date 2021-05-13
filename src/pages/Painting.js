import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { InputGroup, FormControl } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

// Assets
import factureLogo from '../assets/facture_logo.svg';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

// Axios
import axios from 'axios';

class Painting extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      title: '',
      artist: '',
      image: '',
      materials: '',
      url: '',
      signature: '',
      collection: '',
      description: ''
    }
  }

  async componentDidMount(){

    
    try{
      // Grab ME oid
      const { match: { params } } = this.props;
      const id = params.id;

      let url = `${process.env.REACT_APP_API_URL}/api/aw_lots/${id}`;
      const response = await axios.get(url)
      const data = response.data;

      console.log("data ", response.data)
      let image = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
      if(data.images.length >0 ){
        image = data.images[0].url; 
      }
      const size = `${data.size_height} x ${data.size_width} (${data.size_unit})`
      this.setState({ 
        title: data.title,
        artist: data.artist,
        image: image,
        size: size,
        materials: data.materials,
        url: data.url,
        signature: data.misc,
        collection: data.collection,
        description: data.description
      })
    }catch(error){
      console.log("FAILED")

    }  

    
  }

  render() {
    const { image } = this.state;

    console.log("ReRender")

    console.log("ReRender", this.state.painting)


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

        <Row className="painting" style={{ padding: '4em 3em 0 3em'}} >
          <Col md className="text-center" style={{ minHeight: '70vh' }}>
            <img alt="paintin" src={image}></img>
          </Col>
          <Col md style={{ minHeight: '70vh' }}>
            
            <div style={{ color: 'grey' }}>Catalogue Raisonne</div>
            
            <div className="font-weight-bold" style={{ fontSize: '24px'}}>
              {this.state.artist}
            </div>
            <div className="font-weight-bold">{this.state.title}, 1955</div>
            <div className="mt-3">{this.state.materials}</div>
            <div>{this.state.size}</div>
            <div>paintingList</div> 

            <div className="mt-3" style={{ fontSize: '12px'}}>
              <div className="mt-3" style={{ color: 'grey' }}>Signature</div>
              <div>{this.state.signature}</div>
              
              <div className="mt-3" style={{ color: 'grey' }}>Provenance</div>
              <div>{this.state.collection}</div>

              <div className="mt-3" style={{ color: 'grey' }}>Literature</div>
              <div>{this.state.description}</div>
              
            </div>

 
            <div className="mt-3" style={{ color: 'grey' }}>Source</div>

            <div className="mt-3" style={{ color: 'grey' }}>URL</div>
            <div>{this.state.url}</div>
            
          </Col>
        </Row>

      </Container>
    );
  }
}


export default withRouter(Painting);
