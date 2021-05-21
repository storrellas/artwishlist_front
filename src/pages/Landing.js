import React from 'react';
// import { Container } from 'react-bootstrap';
import { Navbar, Nav } from 'react-bootstrap';

// React Router
import { Route } from "react-router-dom";
import { withRouter } from 'react-router-dom';

import './Landing.scss';

// React Select
import Select from 'react-select';

// Redux
import { connect } from "react-redux";

// Assets
import factureLogo from '../assets/facture_logo.svg';
import cameraImg from '../assets/camera.svg';

// Font Awesome
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCamera } from '@fortawesome/free-solid-svg-icons'

// AnimateHeight
// import AnimateHeight from 'react-animate-height';

// Axios
import axios from 'axios';

// Project imports
import SearchResult from '../pages/SearchResult';
import SearchImage from '../pages/SearchImage';
import Painting from '../pages/Painting';

const mapStateToProps = (state) => {
  return {
    //mode: state.mode,
    //paintingId: state.paintingId,
  };
}


const mapDispatchToProps = (dispatch) => {
  return {};
}


class Landing extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      searchPattern: '',
      isLoadingArtist: false,
      artistOptions: [],
      searchInputBackground: '#F3F3F3',
      searchInputBorder: '0px solid #F3F3F3',
      launchSearchPattern: '',
      
      imagePreview: undefined,

    }
    this.typingTimeout = undefined

    this.inputRef = React.createRef();
  }


  componentDidUpdate(prevProps, prevState){}

  componentDidMount(){}

  async fillArtist(searchPattern){
  
    try{
      if(searchPattern.length === 0){
        return
      }
      this.setState({isLoadingArtist: true})

      let url = `${process.env.REACT_APP_API_URL}/api/aw_lots/_artist_search?q=${searchPattern}`;
      const response = await axios.get(url)

      // Autocomplete
      let artistOptions = []
      for(const item of response.data.results ){
        artistOptions.push({value: item.pk, label: item.name})
      }
      artistOptions = artistOptions.slice(0,7)
      this.setState({artistOptions: artistOptions, isLoadingArtist:false})

    }catch(error){
      console.log("FAILED", error)
    }  
  }

  onInputChangeArtist(searchPattern){
    const that = this;
    this.setState({searchPattern: searchPattern})


    // Clear timeout
    if ( this.typingTimeout ) {
      clearTimeout(this.typingTimeout);
    }
    this.typingTimeout = 
      setTimeout(function () {that.fillArtist(searchPattern);}, 1000)
  }

  onMenuOpenArtist(){
    this.setState({
      searchInputBackground: 'white', 
      searchInputBorder: '1px solid #DDDDDD'
    })
  }

  onMenuCloseArtist(searchPattern){
    this.setState({
      searchInputBackground: '#DDDDDD', 
      searchInputBorder: '0px solid #DDDDDD',
      searchPattern: searchPattern
    })
  }

  onKeyDownArtist(e){
    if (e.keyCode === 13){
      // const { searchPattern } = this.state;

      // this.setState({
      //   searchPattern: searchPattern, 
      //   launchSearchPattern: searchPattern,
      // })

    }      
  }

  performSearchArtist(searchObj){
    clearTimeout(this.typingTimeout);

    // Select where pattern comes from
    const pattern = searchObj?searchObj.label:this.state.searchPattern;
    this.setState({
      searchPattern: pattern, 
      launchSearchPattern: pattern,
    })

    this.props.history.push(`/search?pattern=${pattern}`);
        
  }

  onUploadClick(){
    this.inputRef.current.click()
  }
    

  
  handleImagePreview(imagePreview){


    this.props.history.push('/search') 
    if( imagePreview ){
      // raised by SearchImage
      this.setState({
        imagePreview: imagePreview, 
      })

    }else{
      // raised by Upload Button
      const [file] = this.inputRef.current.files;
      if(file){
        const imagePreview = URL.createObjectURL(file)
        this.setState({imagePreview: imagePreview})
      }
      this.inputRef.current.value = "";
    }
    
  }


  render() {
    const { searchPattern } = this.state;
    const { artistOptions, searchInputBackground, searchInputBorder } = this.state;
    console.log("ReRender", searchPattern )

    const { imagePreview } = this.state;


    
    let showUploadButton = false;
    const isDetail = this.props.location.pathname.includes('painting');
    const isSearch = this.props.location.pathname.includes('search');
    if( isDetail || isSearch){
      showUploadButton = true;
    }


    console.log("Landing Render")

    return (
      <main className="d-flex flex-column" style={{ height: '100vh',  }}>

        <Navbar expand="md" style={{ padding: '3em', justifyContent: 'flex-end' }}>
          <div 
            style={{ padding: '3em', position:'absolute', 
                  width: '100%', zIndex: -1, height: '100%', background: 'transparent', 
                  top:0, left: 0}}>
          <Navbar.Brand href="#home" className="brand-margin">
              
            <img height="40" alt="logo" src={factureLogo}></img>

          </Navbar.Brand>
          </div>

          <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
            
            <Navbar.Collapse className="h-100" id="responsive-navbar-nav">          
              {/* <Nav className="mr-auto mt-3 justify-content-end" style={{ width: '25%'}}></Nav> */}
              <Nav className="mr-auto justify-content-end align-items-center" 
                style={{ height: '40px', marginTop: '2.5rem', width: '50%'}}>
                <div className={showUploadButton?"h-100 mr-3":"invisible"}>
                  <button className="h-100 font-weight-bold btn-upload d-flex justify-content-center align-items-center" 
                    onClick={(e) => this.onUploadClick()} >
                    <div className="h-100 d-flex justify-content-center align-items-center">
                      <img alt="camera" src={cameraImg} />
                    </div>
                    <div className="pl-2">UPLOAD</div>
                  </button>
                  <input id="test" value="" className="d-none" type="file" 
                    ref={this.inputRef} 
                    onChange={(e) => this.handleImagePreview()}/>
                </div>
              </Nav>

              <Nav className="mr-auto" style={{ marginTop: '2.5rem', width: '50%'}}>
                <Select isLoading={this.state.isLoadingArtist} 
                          isClearable 
                          isSearchable options={artistOptions} 
                          onInputChange={(e) => this.onInputChangeArtist(e)} 
                          onKeyDown={(e) => this.onKeyDownArtist(e)}
                          onMenuOpen={(e) => this.onMenuOpenArtist()}
                          onMenuClose={(e) => this.onMenuCloseArtist(searchPattern)}
                          onChange={ (e) => this.performSearchArtist(e) }
                          //inputValue={searchPattern}
                          className="searchInput"
                          classNamePrefix="searchInputInner"
                          placeholder={'Search by Artist'}  
                          styles={{      
                            control: (provided) => ({ 
                              ...provided, 
                              borderRadius: '20px', 
                              background: searchInputBackground, 
                              border: searchInputBorder,
                              outline: "none !important",
                              boxShadow: "none !important",
                              paddingLeft: '1em',
                              "&:focus" :{
                                border: '1px solid black',
                                outline: 'none'
                              },
                              "&:hover" :{
                                border: '1px solid #EDEDED',
                                outline: 'none'
                              }
                            }),

                          }}
                          />
              </Nav>
              {/* <Nav className="mr-auto mt-3 justify-content-end" style={{ width: '15%'}}></Nav> */}

          </Navbar.Collapse>

        </Navbar>


        <Route path="/painting/:id" exact
                render={(props) => (

                      <Painting />

                )} />

        <Route path="/search/" exact
                render={(props) => 
                (

                    <SearchResult
                      imagePreview={imagePreview}
                      launchSearchPattern={this.state.launchSearchPattern} ></SearchResult>

                )} />

    
        <Route path="/" exact
                render={(props) => 
                (

                      <SearchImage 
                        onImageChanged={(imagePreview) => this.handleImagePreview(imagePreview)} 
                        imagePreview={imagePreview} />

                )} />

      </main>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Landing));
