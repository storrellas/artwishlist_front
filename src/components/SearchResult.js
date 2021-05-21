import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import { useParams } from "react-router-dom";


import './Search.scss';

// Axios
import axios from 'axios';

// Redux
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
  };
}


const mapStateToProps = (state) => {
  return {};
}

export const SEARCH_MODE = { LANDING: 1, PATTERN: 2, IMAGE: 3 }
class SearchResult extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoadingList: false,
      imagePreviewHover: false,
      imagesBaseUrl: '',
      paintingList: [],  
      searchMode: SEARCH_MODE.LANDING,    
    }

    this.scrollRef = React.createRef();

    this.scrollTopMax = 0;

    this.offset = 0;
    this.size = 8;
  }


  async performSearchPattern(searchPattern, reset = false){
    try{
      this.setState({ 
        isLoadingList: true, 
        searchMode: SEARCH_MODE.PATTERN,
        searchPattern: ''
      })

      // Launch request
      let url = `${process.env.REACT_APP_API_URL}/api/aw_lots/_search?`;
      url = `${url}q=${searchPattern}&size=${this.size}&offset=${this.offset}`; 
      const response = await axios.get(url)

      // Append to existing paintingList
      let paintingList = reset?[]:this.state.paintingList
      paintingList = paintingList.concat(response.data.results)

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
    console.log("performSearchImage ")

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
      console.log("imagePreview ")
      this.handleImagePreviewUpdate()
    }

    if( prevProps.launchSearchPattern !== this.props.launchSearchPattern ){
      console.log("launchSearchPattern ")
      this.performSearchPattern(this.props.launchSearchPattern, true)      
    }

  }

  async componentDidMount(){

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const pattern = urlParams.get('pattern')
    if( pattern ){
      this.performSearchPattern(pattern) 
      this.setState({searchPattern: pattern, searchMode: SEARCH_MODE.PATTERN, painting: []})
    }else if( this.props.imagePreview ){
      this.handleImagePreviewUpdate()
    }else{
      this.props.history.push('/')
    }
    
  }

  onYReachEnd(){
    // const scrollTop = this.scrollRef.scrollTop;
    // let docHeight = this.scrollRef.scrollHeight;
    // let clientHeight = this.scrollRef.clientHeight;
    // let scrollPercent = scrollTop *100 / (docHeight - clientHeight);

    // Grab next page
    if( this.scrollRef.scrollTop > 0){
      if( this.state.searchMode === SEARCH_MODE.PATTERN && this.state.isLoadingList === false ) {
        // Move it a bit top to avoid researching
        this.scrollRef.scrollTop = this.scrollRef.scrollTop * 0.7;
        
        const pattern = this.props.launchSearchPattern?
                        this.props.launchSearchPattern:this.searchPattern;

        this.performSearchPattern(pattern) 
      }else{
        // Do nothing
      }
        
    }
  }

  render() {
    let { isLoadingList, paintingList, searchMode } = this.state;
    const { imagesBaseUrl } = this.state;

    const showEmptySearch = paintingList.length===0&&
                            isLoadingList===false&&
                            searchMode!==SEARCH_MODE.LANDING;

    const imagePreview = this.props.imagePreview?
                    this.props.imagePreview:this.state.imagePreview;

    // Classes to move icon    
    const imageSelected = this.props.imagePreview !== undefined && 
                          searchMode == SEARCH_MODE.IMAGE; 
    let imgClass = imageSelected?
                    "h-100 img-painting-border img-search-left":
                    "h-100 img-search";

    const containerClass = imageSelected?
        "w-100 img-search-container p-3":
        'd-none'


    const heightResult = this.state.searchMode == SEARCH_MODE.PATTERN?'75vh':'60vh'

    return (
      <>
      <section className={imageSelected?"img-search-section top bottom":"img-search-section top"}>
        <Container className="h-100" style={{ padding: 0 }}>

            <div className={containerClass}>
              <div className="w-100 text-left p-1"
                style={{ color: '#444444', fontWeight: 'bold' }}>
                Your uploaded image:
              </div>
              <img className={imgClass}
                alt="background" src={imagePreview}
                onClick={(e) => this.onUploadClick()}
                style={{ maxHeight: imageSelected ? "70px" : "300px", cursor: 'pointer' }}
                ref={this.imgPreviewRef} />
              <input className="d-none" type="file"
                ref={this.inputRef}
                onChange={(e) => this.handleImagePreview(e)} />
            </div>
            </Container>
      </section>          
      <section style={{ background: '#F3F3F3', flexGrow: 1 }}>
        <Container style={{ padding: 0 }}>
            <div className="d-none">
              <Filtering />
            </div>
            {isLoadingList ?
              <div className="w-100 text-center mt-3">Loading ...</div>
              : ''}
            {showEmptySearch ? <EmptySearch /> : ''}
            {paintingList.length > 0 ?
              <div className="mt-3" style={{ height: heightResult }}>
                <PerfectScrollbar
                  className="w-100"
                  onYReachEnd={(e) => this.onYReachEnd()}
                  style={{ padding: '0 1em 0 1em' }}
                  containerRef={(ref) => this.scrollRef = ref} >
                  <Row>
                    {paintingList.map((item, id) =>
                      <Col className="mt-3" key={id} md="3">
                        <Card imagesBaseUrl={imagesBaseUrl} painting={item} />
                      </Col>
                    )}
                  </Row>
                </PerfectScrollbar>
              </div>
              : ''}
          
        </Container>
      </section>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchResult));
