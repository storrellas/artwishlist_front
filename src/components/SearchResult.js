import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import './Search.scss';

// Axios
import axios from 'axios';

// Redux
import { setMode, MODE } from "../redux";
import { connect } from "react-redux";

// Perfect scrollbar
import PerfectScrollbar from 'react-perfect-scrollbar';

// Project imports
import Card from '../components/Card';
import Filtering from '../components/Filtering';

const EmptySearch = (props) => {

  return (
    <Row className="mt-3" style={{ padding: '0 15px 0 15px'}}>
      <Col>
        <h2 className="w-100 text-left">
          No artwork was found
        </h2>
        <h5 className="w-100 text-left">
          Please try again by cropping the image or alternatively use the textual search
        </h5>
      </Col>
    </Row>

  )
}

const mapDispatchToProps = (dispatch) => {
  return {
      setMode: (payload) => dispatch(setMode(payload)),
  };
}


const mapStateToProps = (state) => {
  return {};
}

export const SEARCH_MODE = { PATTERN: 1, IMAGE: 2 }
class SearchResult extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoadingList: false,
      imagePreviewHover: false,
      imagesBaseUrl: '',
      paintingList: [],      
    }

    this.scrollRef = React.createRef();

    this.scrollTopMax = 0;

    this.offset = 0;
    this.size = 8;
  }


  async performSearchPattern(searchPattern){
    try{            
      this.setState({ 
        isLoadingList: true, 
        searchMode: SEARCH_MODE.PATTERN
      })

      // Launch request
      let url = `${process.env.REACT_APP_API_URL}/api/aw_lots/_search?`;
      url = `${url}q=${searchPattern}&size=${this.size}&offset=${this.offset}`; 
      const response = await axios.get(url)


      // Append to existing paintingList
      const paintingList = this.state.paintingList.concat(response.data.results)
      // Set offset for the next time
      this.offset = this.offset + this.size;
      this.setState({ 
          isLoadingList: false, 
          imagesBaseUrl: response.data.images_base_url,
          paintingList: paintingList})
    }catch(error){
      console.log("FAILED", error)
    }  
  }

  async performSearchImage(file){
    this.props.setMode({ mode: MODE.SEARCH })
    this.setState({ 
      isLoadingList: true, 
      paintingList: [],
      searchMode: SEARCH_MODE.IMAGE
    })

    const formData = new FormData();
    formData.append('upload', file);
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/aw_lots/_image_search`, formData, {})

    // Set PaintingList
    this.setState({
      isLoadingList: false,
      imagesBaseUrl: response.data.images_base_url,
      paintingList: response.data.results})
  }

  async handleImagePreviewUpdate(){

    // Get file locally
    const file = await fetch(this.props.imagePreview).then(r => r.blob());

    // Send image to service
    this.performSearchImage(file)
  }

  async componentDidUpdate(prevProps, prevState){    
    if( prevProps.imagePreview !== this.props.imagePreview ){
      this.handleImagePreviewUpdate()
    }

    if( prevProps.launchSearchPattern !== this.props.launchSearchPattern ){
      this.performSearchPattern(this.props.launchSearchPattern)      
    }
  }

  onYReachEnd(){
    // const scrollTop = this.scrollRef.scrollTop;
    // let docHeight = this.scrollRef.scrollHeight;
    // let clientHeight = this.scrollRef.clientHeight;
    // let scrollPercent = scrollTop *100 / (docHeight - clientHeight);

    // Grab next page
    if( this.scrollRef.scrollTop > 0){
      if( SEARCH_MODE.PATTERN ) {
        // Move it a bit top to avoid researching
        this.scrollRef.scrollTop = this.scrollRef - 50;

        this.performSearchPattern(this.props.launchSearchPattern) 
      }else{
        // Do nothing
      }
        
    }
  }

  render() {
    const { isLoadingList, paintingList } = this.state;
    const { imagesBaseUrl } = this.state;

    return (
        <>
          <div className="d-none">
            <Filtering />
          </div>
          {isLoadingList?
          <div className="w-100 text-center mt-3">Loading ...</div>
          :''}
          {paintingList.length===0&&isLoadingList===false&&this.props.mode!==MODE.LANDING?<EmptySearch />:''}
          {paintingList.length>0?
          <div className="mt-3" style={{ height: '90%'}}>
            <PerfectScrollbar 
              className="w-100" 
              onYReachEnd={(e) => this.onYReachEnd()}
              style={{ padding: '0 1em 0 1em'}}
              containerRef={(ref) => this.scrollRef= ref} >
              <Row>
                {paintingList.map( (item, id) => 
                  <Col className="mt-3" key={id} md="3">
                    <Card imagesBaseUrl={imagesBaseUrl} painting={item} />
                  </Col>
                )}
              </Row>
            </PerfectScrollbar>
          </div>
          :''}
        </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchResult));
