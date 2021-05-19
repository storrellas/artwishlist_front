import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import './Landing.scss';

// React Select
import Select from 'react-select';

// Redux
import { performSearch, MODE, showDetail } from "../redux";
import { connect } from "react-redux";

// Assets
import factureLogo from '../assets/facture_logo.svg';
import cameraImg from '../assets/camera.svg';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'

// Axios
import axios from 'axios';

// Project imports
import Search from '../components/Search'
import Painting from '../components/Painting';

const mapStateToProps = (state) => {
  return {
    mode: state.mode,
    paintingId: state.paintingId,
  };
}


const mapDispatchToProps = (dispatch) => {
  return {
      performSearch: (payload) => dispatch(performSearch(payload)),
      showDetail: (payload) => dispatch(showDetail(payload))
  };
}

class Landing extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      searchPattern: '',
      mode: MODE.LANDING,
      paintingId: 0,
      isLoadingArtist: false,
      artistOptions: [],
      searchInputBackground: '#DDDDDD',
      searchInputBorder: '0px solid #DDDDDD',
      triggerUpload: 0 // Weird solution
    }
    this.typingTimeout = undefined
  }

  handleKeyDown(e){    
    if (e.keyCode === 13)
      this.performSearch()    
  }

  performSearch(){
    const { searchPattern } = this.state;
    this.props.performSearch({mode: MODE.SEARCH, searchPattern: searchPattern})
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

  performSearchArtist(searchObj){
    let pattern = ''
    if( searchObj ){
      pattern = searchObj.label
    }else{
      pattern = this.state.searchPattern;
    }
    this.setState({searchPattern: searchObj.label})
    clearTimeout(this.typingTimeout);
    if( searchObj )
      if( searchObj.label.length > 0)
        this.props.performSearch({mode: MODE.SEARCH, searchPattern: pattern})
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
      this.performSearch()
    }
      
  }

  render() {
    const { mode, paintingId, searchPattern } = this.state;
    const { artistOptions, searchInputBackground, searchInputBorder } = this.state;
    const { triggerUpload } = this.state;
    console.log("ReRender", searchPattern, mode)

    return (
      <Container style={{ height: '100vh'}}>

        <Row className="mb-3" style={{ padding: '3em 1em 1em 1em' }}>
          <Col md={4}>
            <img height="40" alt="logo" className="mt-3" src={factureLogo}></img>
          </Col>
          <Col  md={8} className="d-flex justify-content-center align-items-center" style={{ margin: '2% 0 2% 0', height: '40px' }}>            
            <div className={mode !== MODE.LANDING?"h-100 mr-3":"invisible"}>
              <button className="h-100 font-weight-bold btn-upload d-flex justify-content-center align-items-center" 
                onClick={(e) => this.setState({triggerUpload: triggerUpload + 1 })} >
                <div className="h-100 d-flex justify-content-center align-items-center">
                <img src={cameraImg} />
                </div>
                <div className="pl-2">UPLOAD</div>
              </button>
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
                    }
                  }),

                }}
                />
              </div>

          </Col>
        </Row>

        <div style={{ height: '80vh'}}>
          {(mode === MODE.SEARCH || mode === MODE.LANDING)?
          <Search triggerUpload={triggerUpload} />
          :
          <Painting paintingId={paintingId} />
          }
        </div>
      </Container>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Landing));
