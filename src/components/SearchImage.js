import React from 'react';
import { Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import './Search.scss';

// Redux
import { connect } from "react-redux";

// Assets
import upload from '../assets/upload.svg';
import uploadHover from '../assets/upload_hover.svg';

const mapDispatchToProps = (dispatch) => {
  return {};
}

const mapStateToProps = (state) => {
  return {};
}

class SearchImage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      imagePreview: upload,
      imageSelected: false,
    }
    this.inputRef = React.createRef();
    this.imgPreviewRef = React.createRef();
  }

  handleDragLeave(event){
    event.stopPropagation()
    event.preventDefault()
    // If we have an image do not proceed
    if( this.isImageSearch ) return;
      
    // Set upload back to normal
    this.setState({ imagePreview: upload })
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
      const imagePreview = URL.createObjectURL(file);
      this.imgPreviewRef.current.src = imagePreview
      //this.performSearchImage(file)
      this.props.onImageChanged( imagePreview )
      this.setState({ imageSelected: true })
    }
  };

  onUploadClick(){
    this.inputRef.current.click()
  }

  async handleImagePreview(e){
    const [file] = this.inputRef.current.files;
    if(file){
      const imagePreview = URL.createObjectURL(file);
      this.imgPreviewRef.current.src = URL.createObjectURL(file)

      // Send image to service
      //this.performSearchImage(file)
      this.props.onImageChanged( imagePreview )
      this.setState({ imageSelected: true })
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

  componentDidUpdate(prevProps, prevState){}

  render() {
    const imagePreview = this.props.imagePreview?
                    this.props.imagePreview:this.state.imagePreview;

    // Classes to move icon    
    const imageSelected = this.state.imageSelected || this.props.imagePreview !== undefined; 
    let imgClass = imageSelected?
                    "h-100 img-painting-border img-search-left":
                    "h-100 img-search";

    const containerClass = imageSelected?
        "w-100 h-100 img-search-container p-3":
        'w-100 d-flex justify-content-center p-3 mt-3'


    return (
      <section className="img-search-section top"
        style={{ background: '#F3F3F3', flexGrow: 1 }}>
        <Container style={{ padding: 0 }}>

          <div className="animated-search" style={{ height: '75vh' }}>

            <div
              className={containerClass}>
              <div className={imageSelected ? "w-100 text-left p-1" : "d-none"}
                style={{ color: '#444444', fontWeight: 'bold' }}>
                Your uploaded image:
          </div>
              <img className={imgClass}
                alt="background" src={imagePreview}
                onMouseEnter={(e) => this.handleImageMouseEnter()}
                onMouseLeave={(e) => this.handleImageMouseLeave()}
                onClick={(e) => this.onUploadClick()}
                style={{ maxHeight: imageSelected ? "70px" : "300px", cursor: 'pointer' }}

                // DnD
                onDragEnter={(e) => this.handleDragEnter(e)}
                onDragLeave={(e) => this.handleDragLeave(e)}
                onDragOver={(e) => this.handleDragOver(e)}
                onDrop={(e) => this.handleDrop(e)}

                ref={this.imgPreviewRef} />
              <input className="d-none" type="file"
                ref={this.inputRef}
                onChange={(e) => this.handleImagePreview(e)} />
            </div>
          </div>
        </Container>
      </section>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchImage));
