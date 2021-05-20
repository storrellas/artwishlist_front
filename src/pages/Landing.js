import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import './Landing.scss';

// React Select
import Select from 'react-select';

// Redux
import { MODE, showDetail } from "../redux";
import { connect } from "react-redux";

// Assets
import factureLogo from '../assets/facture_logo.svg';
import cameraImg from '../assets/camera.svg';

// Font Awesome
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCamera } from '@fortawesome/free-solid-svg-icons'

// AnimateHeight
import AnimateHeight from 'react-animate-height';

// Axios
import axios from 'axios';

// Project imports
//import Search from '../components/Search';
import SearchResult from '../components/SearchResult';
import SearchImage from '../components/SearchImage';

import Painting from '../components/Painting';

const mapStateToProps = (state) => {
  return {
    mode: state.mode,
    paintingId: state.paintingId,
  };
}


const mapDispatchToProps = (dispatch) => {
  return {
      showDetail: (payload) => dispatch(showDetail(payload))
  };
}

export const SEARCH_MODE = { LANDING: 0, PATTERN: 1, IMAGE: 2 }
class Landing extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      searchPattern: '',
      mode: MODE.LANDING,
      paintingId: -1,
      isLoadingArtist: false,
      artistOptions: [],
      searchInputBackground: '#DDDDDD',
      searchInputBorder: '0px solid #DDDDDD',
      launchSearchPattern: '',
      
      imagePreview: undefined,

      searchMode: undefined
    }
    this.typingTimeout = undefined

    this.inputRef = React.createRef();
  }


  componentDidUpdate(prevProps, prevState){
    if( prevProps.mode !== this.props.mode){
      this.setState({
        paintingId: this.props.paintingId,
        mode: this.props.mode
      })
    }
  }

  componentDidMount(){

    // Grab ME oid
    const { match: { params } } = this.props;
    const paintingId = params.id;
    if( paintingId !== undefined )
      this.props.showDetail({mode: MODE.DETAIL, paintingId: paintingId})
  }



  async fillArtist(searchPattern){
  
    try{
      if(searchPattern.length === 0){
        return
      }
      this.setState({isLoadingArtist: true})

      let url = `${process.env.REACT_APP_API_URL}/api/aw_lots/_artist_search?q=${searchPattern}`;
      const response = await axios.get(url)

      // Autocomplete
      const artistOptions = []
      for(const item of response.data.results ){
        artistOptions.push({value: item.pk, label: item.name})
      }
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
      const { searchPattern } = this.state;

      this.setState({
        searchPattern: searchPattern, 
        mode: MODE.SEARCH,
        launchSearchPattern: searchPattern,
        searchMode: SEARCH_MODE.PATTERN
      })

    }      
  }

  performSearchArtist(searchObj){
    clearTimeout(this.typingTimeout);

    // Select where pattern comes from
    const pattern = searchObj?searchObj.label:this.state.searchPattern;
    this.setState({
      searchPattern: pattern, 
      mode: MODE.SEARCH,
      launchSearchPattern: pattern,
      searchMode: SEARCH_MODE.PATTERN
    })
      
        
  }

  handleImagePreview(e){

    const [file] = this.inputRef.current.files;
    if(file){
      const imagePreview = URL.createObjectURL(file)
      this.setState({imagePreview: imagePreview, searchMode: SEARCH_MODE.IMAGE})
    }
    this.inputRef.current.value = "";

  }

  render() {
    const { mode, searchPattern } = this.state;
    const { artistOptions, searchInputBackground, searchInputBorder } = this.state;
    console.log("ReRender", searchPattern, mode)

    const { match: { params } } = this.props;
    const paintingId = params.id;

    // let listShowHeightImage = '100%';
    // if( listShow ){
    //   if( searchMode === SEARCH_MODE.PATTERN ) listShowHeightImage = '0%';
    //   else listShowHeightImage = '20%';
    // }

    let listShowHeightImage = '';
    switch(this.state.searchMode){
      case SEARCH_MODE.IMAGE:
        listShowHeightImage ='20%'
        break;
      case SEARCH_MODE.PATTERN:
        listShowHeightImage ='0%'
        break;        
      default:
        listShowHeightImage ='100%'
    }

    return (
      <>
      <Container style={{ height: '90vh'}}>

        <Row className="mb-3" style={{ padding: '3em 1em 1em 1em' }}>
          <Col md={4}>
            <img height="40" alt="logo" className="mt-3" src={factureLogo}></img>
          </Col>
          <Col  md={8} className="d-flex justify-content-center align-items-center" style={{ margin: '2% 0 2% 0', height: '40px' }}>            
            <div className={mode !== MODE.LANDING?"h-100 mr-3":"invisible"}>
              <button className="h-100 font-weight-bold btn-upload d-flex justify-content-center align-items-center" 
                onClick={(e) => this.inputRef.current.click()} >
                <div className="h-100 d-flex justify-content-center align-items-center">
                <img alt="camera" src={cameraImg} />
                </div>
                <div className="pl-2">UPLOAD</div>
              </button>
              <input className="d-none" type="file" ref={this.inputRef} onChange={(e) => this.handleImagePreview(e)}/>

            </div>
            <div className="h-100" style={{ flexGrow: 1}}>
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
                      border: '1px solid #DDDDDD',
                      outline: 'none'
                    }
                  }),

                }}
                />
              </div>

          </Col>
        </Row>
        <div style={{ height: '70vh'}}>
          
            <div className={(mode === MODE.SEARCH || mode === MODE.LANDING)?'h-100':'d-none'}>
              {/* <Search 
                imagePreview={this.state.imagePreview} 
                launchSearchPattern={this.state.launchSearchPattern}
                mode={mode} /> */}
                <AnimateHeight
                  duration={ 500 }
                  height={ listShowHeightImage }
                  className="d-flex justify-content-center align-items-center" 
                  contentClassName="animated-search">
                  <SearchImage 
                    onImageChanged={(imagePreview) => this.setState({imagePreview: imagePreview, searchMode: SEARCH_MODE.IMAGE})} 
                    imagePreview={this.state.imagePreview} />
                </AnimateHeight>
                <SearchResult
                  imagePreview={this.state.imagePreview}
                  launchSearchPattern={this.state.launchSearchPattern}
                  mode={mode} />
            </div>
            <div className={(mode === MODE.DETAIL)?'h-100':'d-none'}>
              <Painting paintingId={paintingId} />
            </div>
            
          
        </div>
      </Container>
      </>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Landing));
