import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
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
      const { match: { params } } = this.props;
      const paintingId = params.id;

      let url = `${process.env.REACT_APP_API_URL}/api/aw_lots/${paintingId}`;
      const response = await axios.get(url)
      const data = response.data;


      // Get Image from API
      let image = `${process.env.REACT_APP_API_URL}/api/aw_lots/image/${data.images[0].pk}`
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
    console.log("REndering detail")
    return (
      <section className="img-search-section top"
        style={{ flexGrow: 1 }}>
        <Container style={{ padding: 0 }}>
          <Row className="painting" style={{ padding: '4em 3em 0 3em' }} >
            <Col md={6} className="detail-painting-img">
              <img alt="painting" src={image} style={{ maxHeight: '100%', maxWidth: '100%' }}></img>
            </Col>
            <Col md={6} style={{ minHeight: '70vh' }}>

              <div style={{ color: 'grey' }}>Catalogue Raisonne</div>

              <div className="font-weight-bold" style={{ fontSize: '24px' }}>
                {this.state.artist}
              </div>
              <div className="font-weight-bold">{this.state.title}, 1955</div>
              <div className="mt-3">{this.state.materials}</div>
              <div>{this.state.size}</div>
              <div>paintingList</div>

              <div className="mt-3" style={{ fontSize: '12px' }}>
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
      </section>
    );
  }
}


export default connect(mapStateToProps, null)(withRouter(Painting));
