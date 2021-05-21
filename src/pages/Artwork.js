import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

// Axios
import axios from 'axios';

// Redux
import { connect } from "react-redux";

// Project imports
import { getSourceStr, getSource, ARTWORK_TYPE } from '../shared/utils'

const mapStateToProps = (state) => {
  return {
    paintingId: state.paintingId,
  };
}

class Painting extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
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
      let image = ''
      if(data.images && data.images.length > 0)
        image = `${process.env.REACT_APP_API_URL}/api/aw_lots/image/${data.images[0].pk}`
      let size = ''

      // Compute size
      if(data.size_height && data.size_width && data.size_unit)
        size = `${data.size_height} x ${data.size_width} (${data.size_unit})`

      // Compute sales
      let sales_prices = ''
      if( data.sales_prices && data.sales_prices.length > 0){
        sales_prices = `${parseInt(data.sales_prices[0][0]).toLocaleString()} ${data.sales_prices[0][1]}`
      }
      let sales_estimate = ''
      if( data.estimate && data.estimate.length >= 1){
        sales_estimate = `Est. ${data.estimate[0][0]}-${data.estimate[0][1]} ${data.estimate[0][2]}`
      }

      this.setState({ 
        title: data.title,
        artist: data.artist,
        image: image,
        size: size,
        materials: data.materials,
        url: data.url,
        signature: data.misc,
        collection: data.collection,
        description: data.description,
        source_type: data.source_type,
        year_of_work_verbose: data.year_of_work_verbose,
        sales_prices: sales_prices,
        sales_estimate: sales_estimate,
        sales_house: data.house || '',
        sales_date: data.date || '',
        provenance: data.provenance,
        inscriptions: data.inscriptions,
        literature: data.literature
      })

    }catch(error){
      console.log("FAILED", error)
    }  
  }

  render() {
    const { image } = this.state;
    console.log("Rendering detail", this.state)

    // Get Source
    let source = getSource(this.state.source_type)
    const sourceStr = getSourceStr(source)

    return (
      <section className="img-search-section top" 
        style={{ flexGrow: 1 }}>
        <Container style={{ padding: 0, paddingBottom: '1em' }}>
          <Row className="painting" style={{ padding: '4em 3em 0 3em' }} >
            <Col md={6} className="detail-painting-img">
              <img alt="painting" src={image} style={{ maxHeight: '100%', maxWidth: '100%' }}></img>
            </Col>
            <Col md={6} style={{ minHeight: '70vh' }}>

              <div style={{ color: 'grey' }}>{sourceStr}</div>

              <div style={{ fontSize: '24px' }}>
                {this.state.artist}
              </div>
              <div>{this.state.title} {this.state.year_of_work_verbose}</div>
              <div className="mt-3">{this.state.materials}</div>
              

              <div className="mt-3 font-weight-bold">
                <div style={{ fontSize: '18px'}}>{this.state.sales_prices}</div>
                <div>{this.state.size}</div>
                <div>{this.state.sales_estimate}</div>
                <div>{this.state.house}</div>
                <div>{this.state.date}</div>
              </div>


              <div>{this.state.collection}</div>

              <div className="mt-3 text-justify" style={{ fontSize: '12px' }}>
                {/* <div className="mt-3" style={{ color: 'grey' }}>Signature</div>
                <div>{this.state.signature}</div> */}

                {this.state.inscriptions?
                  <>
                    <div className="mt-3" style={{ color: 'grey' }}>Inscriptions</div>
                    <div>{this.state.inscriptions}</div>
                  </>
                :''}
                {this.state.description?
                  <>
                    <div className="mt-3" style={{ color: 'grey' }}>Description</div>
                    <div>{this.state.description}</div>
                  </>
                :''}

                {this.state.provenance?
                  <>
                    <div className="mt-3" style={{ color: 'grey' }}>Provenance</div>
                    <div>{this.state.provenance}</div>
                  </>
                :''}

                {this.state.literature?
                  <>
                    <div className="mt-3" style={{ color: 'grey' }}>Literature</div>
                    <div>{this.state.literature}</div>
                  </>
                :''}

              </div>

              {source === ARTWORK_TYPE.AUCTION?
                <div  style={{ fontSize: '12px' }}>
                  {/* <div className="mt-3" style={{ color: 'grey' }}>Source</div> */}
                  <div className="mt-3" style={{ color: 'grey' }}>URL</div>
                  <div>{this.state.url}</div>
                </div>
              :''}

              {source === ARTWORK_TYPE.CATALOGUE_RAISSONE?
                <div  style={{ fontSize: '12px' }}>
                  {/* <div className="mt-3" style={{ color: 'grey' }}>Source</div> */}
                  <div className="mt-3" style={{ color: 'grey' }}>URL</div>
                  <div>{this.state.url}</div>
                </div>
              :''}

              {source === ARTWORK_TYPE.ONLINE?
                <div  style={{ fontSize: '12px' }}>
                  {/* <div className="mt-3" style={{ color: 'grey' }}>Source</div> */}
                </div>
              :''}

            </Col>
          </Row>
        </Container>
      </section>
    );
  }
}


export default connect(mapStateToProps, null)(withRouter(Painting));
