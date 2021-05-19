import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import './Search.scss';

// Axios
import axios from 'axios';

// Redux
import { connect } from "react-redux";


// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

// Assets
import upload from '../assets/upload.svg';
import uploadHover from '../assets/upload_hover.svg';

// AnimateHeight
import AnimateHeight from 'react-animate-height';

// Perfect scrollbar
import PerfectScrollbar from 'react-perfect-scrollbar';

// Project imports
import Card from '../components/Card';

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

const mapStateToProps = (state) => {
  return {    
    searchPattern: state.searchPattern,
  };
}

export const SEARCH_MODE = { PATTERN: 1, IMAGE: 2 }
class Search extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      searchPattern: '',
      imagePreview: upload,
      listShow: false,
      imagePreviewHover: false,
      imagesBaseUrl: '',
      paintingList: [],
      searchMode: undefined
    }
    this.inputRef = React.createRef();
    this.imgPreviewRef = React.createRef();

    this.scrollRef = React.createRef();

    this.isImageSearch = false;
    this.scrollTopMax = 0;

    this.offset = 0;
    this.size = 8;
  }


  async performSearchPattern(){
    try{      
      const searchPattern = this.props.searchPattern;

      let url = `${process.env.REACT_APP_API_URL}/api/aw_lots/_search?`;
      url = `${url}q=${searchPattern}&size=${this.size}&offset=${this.offset}`; 
      const response = await axios.get(url)


      // Append to existing paintingList
      const paintingList = this.state.paintingList.concat(response.data.results)
      // Set offset for the next time
      this.offset = this.offset + this.size;
      this.setState({
          listShow: true, 
          imagesBaseUrl: response.data.images_base_url,
          paintingList: paintingList,
          searchMode: SEARCH_MODE.PATTERN})
    }catch(error){
      console.log("FAILED", error)
    }  
  }

  async performSearchImage(file){
    // Mark we are searching
    this.isImageSearch = true;

    const formData = new FormData();
    formData.append('upload', file);
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/aw_lots/_image_search`, formData, {})

    // Set PaintingList
    this.setState({
      imagePreview: URL.createObjectURL(file),
      listShow: true, 
      imagesBaseUrl: response.data.images_base_url,
      paintingList: response.data.results,
      searchMode: SEARCH_MODE.IMAGE})
  }

  handleDragLeave(event){
    event.stopPropagation()
    event.preventDefault()
    // If we have an image do not proceed
    if( this.isImageSearch ) return;
      
    // Set upload back to normal
    this.setState({ imagePreview: upload})
  };
  handleDragOver(event){
    event.stopPropagation()
    event.preventDefault()
  };
  handleDragEnter(event){
    event.stopPropagation()
    event.preventDefault()
    // If we have an image do not proceed
    if( this.isImageSearch ) return;
    
    // Set upload hover
    this.setState({ imagePreview: uploadHover})
  };

  async handleDrop(event){
    event.stopPropagation()
    event.preventDefault()


    let fileList = []
    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for(const item of event.dataTransfer.items){
        if (item.kind === 'file') {
          const file = item.getAsFile();
          fileList.push(file)
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for(const file of event.dataTransfer.files ){
        fileList.push(file)
      }
    }

    // Image search
    if( fileList.length > 0 ){
      const file = fileList[0]      
      this.imgPreviewRef.current.src = URL.createObjectURL(file)
      this.performSearchImage(file)
    }
  };

  async handleImagePreview(e){
    const [file] = this.inputRef.current.files;
    if(file){
      this.imgPreviewRef.current.src = URL.createObjectURL(file)

      // Send image to service
      this.performSearchImage(file)
    }
      
  }

  handleImageMouseEnter(){
    // If we have an image do not proceed
    if( this.isImageSearch ) return;

    const [file] = this.inputRef.current.files;
    if(file){
      // Do nothing as file is selected
      this.setState({ imagePreviewHover: true })
    }else{
      this.setState({ imagePreview: uploadHover })
    }
  } 

  handleImageMouseLeave(){
    // If we have an image do not proceed
    if( this.isImageSearch ) return;

    const [file] = this.inputRef.current.files;
    if(file){
      this.setState({ imagePreviewHover: false })
    }else{
      this.setState({ imagePreview: upload})
    }
  } 

  componentDidUpdate(prevProps, prevState){
    if( prevProps.searchPattern !== this.props.searchPattern){
      this.offset = 0
      this.setState({paintingList: []})
      this.performSearchPattern()
    }
    

    if( prevProps.triggerUpload !== this.props.triggerUpload){
      this.inputRef.current.click()
    }

  }

  onYReachEnd(){
    // const scrollTop = this.scrollRef.scrollTop;
    // let docHeight = this.scrollRef.scrollHeight;
    // let clientHeight = this.scrollRef.clientHeight;
    // let scrollPercent = scrollTop *100 / (docHeight - clientHeight);

    // Grab next page
    if( this.scrollRef.scrollTop > 0){
      this.performSearchPattern() 
    }
  }

  render() {
    console.log("ReRendering Search")
    const { listShow, paintingList } = this.state;
    const { imagePreview, imagesBaseUrl } = this.state;
    const { searchMode } = this.state;

    // Classes to move icon
    let imgClass = "";
    if( this.isImageSearch ){
      imgClass = "h-100 img-painting-border img-search-left"
    }else{
      if( listShow ){
        imgClass = "h-100 img-search img-search-left"
      }else{
        imgClass = "h-100 img-search"
      }
    }

    
    let listShowHeightImage = '20%';
    let listShowHeightResults = '80%';
    if( searchMode == SEARCH_MODE.PATTERN){
      listShowHeightImage = '0%';
      listShowHeightResults = '100%'
    }


    return (
        <>
          <AnimateHeight
            duration={ 500 }
            height={ listShow === false? '100%': listShowHeightImage } // see props documentation below
            className="d-flex justify-content-center align-items-center" 
            contentClassName="animated-search">
              <div className={listShow?"w-100 text-left p-1":"d-none"}
              style={{ color: '#444444', fontWeight: 'bold'}}>
                Your uploaded image:
              </div>
              <img className={imgClass}
                alt="background" src={imagePreview}                               
                onMouseEnter={(e) => this.handleImageMouseEnter() } 
                onMouseLeave={(e) => this.handleImageMouseLeave()}
                onClick={ (e) => this.inputRef.current.click()}
                style={{ maxHeight: listShow?"90px":"300px", cursor: 'pointer' }}
                
                // DnD
                onDragEnter={(e) => this.handleDragEnter(e)}
                onDragLeave={(e) => this.handleDragLeave(e)}
                onDragOver={(e) => this.handleDragOver(e)}
                onDrop={(e) => this.handleDrop (e)} 
                
                ref={this.imgPreviewRef} />
              <input className="d-none" type="file" ref={this.inputRef} onChange={(e) => this.handleImagePreview(e)}/>
          </AnimateHeight>



          <AnimateHeight
            duration={ 500 }
            height={ listShow? listShowHeightResults: '0%' } // see props documentation below
            style={{ padding: '0 0 1em 0'}}
            contentClassName="animated-list"
          >
            <Row className="filtering" style={{ padding: '0 15px 0 15px'}}>
              <Col>
                <div className="title w-100 text-left">Filters</div>
              </Col>
            </Row>
            <Row className="filtering" style={{ padding: '0 15px 0 15px'}}>

              <Col className="mt-3" md={2}>
                <select>
                  <option>Category</option>
                  <option>Paintings</option>
                  <option>Works On Paper</option>
                  <option>Prints</option>

                  <option>Sculpture</option>
                  <option>Phtographs</option>
                  <option>Other</option>
                  <option>Painting</option>

                  <option>Photography</option>
                  <option>Design</option>
                  <option>Drawings</option>
                  <option>Video</option>
                  <option>Installation</option>
                  <option>...</option>
                </select>
              </Col>
              <Col className="mt-3" md={2}>              
                <select>
                  <option>Source Type</option>
                  <option>AUCTION</option>
                  <option>CAT RAIS</option>
                  <option>ONLINE</option>
                  <option>MUSEUM</option>
                  <option>PRIVATE COLLECTION</option>
                </select>
              </Col>
              <Col className="mt-3" md={2}>              
                <select>
                  <option>Auction Sales</option>
                  <option>Option1</option>
                  <option>Option1</option>
                  <option>Option1</option>
                </select>
              </Col>
              <Col className="mt-3" md={2}>              
                <select>
                  <option>Other</option>
                  <option>Option1</option>
                  <option>Option1</option>
                  <option>Option1</option>
                </select>
              </Col>

              <Col className="mt-3" md={2}>
                <div className="filtering-input w-100">
                  <div>
                    <FontAwesomeIcon icon={faSearch}
                                  onClick={(e) => this.performSearch()} />
                  </div>
                  <input type="text" 
                      placeholder="Search by artist"
                      onChange={e => this.setState({ searchPattern: e.target.value })}
                      onKeyDown={e => this.handleKeyDown(e)} />
                </div>
              </Col>

              <Col className="mt-3" md={2}>
                <div className="w-100 d-flex">
                  <select>
                    <option>Price (High to Low)</option>
                    <option>Price (Low to High)</option>
                    <option>Title (High to Low)</option>
                    <option>Title (Low to High)</option>
                    <option>Auction Date (High to Low)</option>
                    <option>Auction Date (Low to High)</option>
                    <option>Year of work (High to Low)</option>
                    <option>Year of work (Low to High)</option>
                  </select>
                </div>
              </Col>
            </Row>

            {paintingList.length===0?<EmptySearch />:''}
            {paintingList.length>0?
            <div className="mt-3" style={{ height: '85%'}}>
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
          </AnimateHeight>
        </>

    );
  }
}

export default connect(mapStateToProps, null)(withRouter(Search));
