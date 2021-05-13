import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { InputGroup, FormControl } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

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

// Perfect scrollbar
import PerfectScrollbar from 'react-perfect-scrollbar';

// Project imports
import Card from '../components/Card';

class Landing extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      qParameter: '',
      searchImage: upload,
      searchFull: true,
      listShow: false,
      imagePreviewHover: false,
      paintingList: []
    }
    this.inputRef = React.createRef();
    this.imgPreviewRef = React.createRef();
  }

  handleKeyDown(e){    
    if (e.keyCode === 13)
      this.performSearch(e)
  }

  async performSearch(){
    try{
      const { qParameter } = this.state;

      let url = `${process.env.REACT_APP_API_URL}/api/aw_lots/_search?`;
      url = `${url}q=${qParameter}&size=10&offset=20`; 
      const response = await axios.get(url)

      this.setState({
          searchFull: false, 
          listShow: true, 
          paintingList: response.data.results})
    }catch(error){
      console.log("FAILED")

    }  
  }

  handleDragLeave(event){
    event.stopPropagation()
    event.preventDefault()
    // Bring the endzone back to normal, maybe?
    console.log("handleDragLeave")
    this.setState({ searchImage: upload})
  };
  handleDragOver(event){
    event.stopPropagation()
    event.preventDefault()
    // Turn the endzone red, perhaps?
    //console.log("handleDragOver")
  };
  handleDragEnter(event){
    event.stopPropagation()
    event.preventDefault()
    // Play a little sound, possibly?
    console.log("handleDrop")
    this.setState({ searchImage: uploadHover})
  };
  async handleDrop(event){
    event.stopPropagation()
    event.preventDefault()
    // Add a football image to the endzone, initiate a file upload,
    // steal the user's credit card
    console.log("handleDrop", event)

    let i;
    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (i = 0; i < event.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (event.dataTransfer.items[i].kind === 'file') {
          var file = event.dataTransfer.items[i].getAsFile();
          console.log('123... file[' + i + '].name = ' + file.name);
          const formData = new FormData();
          formData.append('upload', file);
          await axios.post(`${process.env.REACT_APP_API_URL}/api/aw_lots/_image_search`, formData, {})
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (i = 0; i < event.dataTransfer.files.length; i++) {
        console.log('... file[' + i + '].name = ' + event.dataTransfer.files[i].name);
      }
    }

  };

  handleImagePreview(e){
    const [file] = this.inputRef.current.files;
    if(file){
      this.imgPreviewRef.current.src = URL.createObjectURL(file)
    }
      
  }

  handleImageMouseEnter(){
    const [file] = this.inputRef.current.files;
    if(file){
      // Do nothing as file is selected
      this.setState({ imagePreviewHover: true })
    }else{
      this.setState({ searchImage: uploadHover })
    }
  } 

  handleImageMouseLeave(){
    const [file] = this.inputRef.current.files;
    if(file){
      this.setState({ imagePreviewHover: false })
    }else{
      this.setState({ searchImage: upload})
    }
  } 

  render() {
    
    const { searchFull, listShow, paintingList } = this.state;
    const { searchImage, imagePreviewHover } = this.state;
    console.log("ReRender")

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
        <div style={{ height: '70vh'}}>
          <AnimateHeight
            id='example-panel'
            duration={ 500 }
            height={ searchFull? '100%': '20%' } // see props documentation below
            className="d-flex justify-content-center align-items-center" 
            contentClassName="animated-search"
          >
              <img className={imagePreviewHover?"h-100  img-painting-border":"h-100"}
                alt="background" src={searchImage}                               
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
            id='example-panel'
            duration={ 500 }
            height={ listShow? '80%': '0%' } // see props documentation below
            className="d-flex flex-column justify-content-center align-items-center" 
            contentClassName="animated-list"
          >
            <PerfectScrollbar style={{ padding: '0 1em 0 1em'}}>
              <Row>
                {paintingList.map( (item, id) => 
                  <Col className="mt-3" key={id} md="3">
                    <Card painting={item} />
                  </Col>
                )}
              </Row>
            </PerfectScrollbar>
          </AnimateHeight>


        </div>




      </Container>
    );
  }
}


export default withRouter(Landing);
