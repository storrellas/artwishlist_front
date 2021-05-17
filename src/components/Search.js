import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

// Axios
import axios from 'axios';

// Redux
import { connect } from "react-redux";

// Assets
import upload from '../assets/upload.svg';
import uploadHover from '../assets/upload_hover.svg';

// AnimateHeight
import AnimateHeight from 'react-animate-height';

// Perfect scrollbar
import PerfectScrollbar from 'react-perfect-scrollbar';

// Project imports
import Card from '../components/Card';



const mapStateToProps = (state) => {
  return {    
    searchPattern: state.searchPattern,
  };
}

class Search extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      searchPattern: '',
      imagePreview: upload,
      searchFull: true,
      listShow: false,
      imagePreviewHover: false,
      paintingList: [],
    }
    this.inputRef = React.createRef();
    this.imgPreviewRef = React.createRef();

    this.scrollRef = React.createRef();

    this.isImageSearch = false;
    this.scrollTopMax = 0;

    this.offset = 0;
    this.size = 1;
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
          searchFull: false, 
          listShow: true, 
          paintingList: paintingList})
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
      searchFull: false, 
      listShow: true, 
      paintingList: response.data.results})
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
      this.performSearchPattern()
    }
    
  }

  onYReachEnd(){
    // const scrollTop = this.scrollRef.scrollTop;
    // let docHeight = this.scrollRef.scrollHeight;
    // let clientHeight = this.scrollRef.clientHeight;
    // let scrollPercent = scrollTop *100 / (docHeight - clientHeight);

    // Grab next page
    if( this.scrollRef.scrollTop > 0){
      console.log("launching this")
      this.performSearchPattern() 
    }
  }

  render() {
    
    const { searchFull, listShow, paintingList } = this.state;
    const { imagePreview } = this.state;

    // Classes to move icon
    let imgClass = "";
    if( this.isImageSearch ){
      imgClass = "h-100 img-painting-border img-search-left"
    }else{
      if( searchFull ){
        imgClass = "h-100 img-search"
      }else{
        imgClass = "h-100 img-search img-search-left"
      }
      
    }

    return (
        <>
          <AnimateHeight
            duration={ 500 }
            height={ searchFull? '100%': '20%' } // see props documentation below
            className="d-flex justify-content-center align-items-center" 
            contentClassName="animated-search">
              <img className={imgClass}
                alt="background" src={imagePreview}                               
                onMouseEnter={(e) => this.handleImageMouseEnter() } 
                onMouseLeave={(e) => this.handleImageMouseLeave()}
                onClick={ (e) => this.inputRef.current.click()}
                style={{ maxHeight: "300px", cursor: 'pointer' }}
                
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
            height={ listShow? '80%': '0%' } // see props documentation below
            className="d-flex flex-column justify-content-center align-items-center" 
            contentClassName="animated-list"
          >
            <PerfectScrollbar 
              className="w-100" 
              onYReachEnd={(e) => this.onYReachEnd()}
              style={{ padding: '0 1em 0 1em'}}
              containerRef={(ref) => this.scrollRef= ref} >
              <Row>
                {paintingList.map( (item, id) => 
                  <Col className="mt-3" key={id} md="3">
                    <Card painting={item} />
                  </Col>
                )}
              </Row>
            </PerfectScrollbar>
          </AnimateHeight>


        </>

    );
  }
}

export default connect(mapStateToProps, null)(withRouter(Search));
