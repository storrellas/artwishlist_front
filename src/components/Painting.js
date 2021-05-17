import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

// Axios
import axios from 'axios';

// Redux
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    paintingId: state.paintingId,
  };
}

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
      // Grab paintingId
      const id = this.props.paintingId;

      let url = `${process.env.REACT_APP_API_URL}/api/aw_lots/${id}`;
      const response = await axios.get(url)
      const data = response.data;

      // Here get path or get /api/aw_lots/image/{image_pk}
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
      console.log("FAILED", error)

    }  
  }


  render() {
    const { image } = this.state;

    return (

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
    );
  }
}


export default connect(mapStateToProps, null)(withRouter(Painting));
