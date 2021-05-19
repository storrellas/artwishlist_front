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

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'

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
      mode: MODE.SEARCH,
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

  performSearchArtist(searchPattern){
    clearTimeout(this.typingTimeout);
    if( searchPattern )
      if( searchPattern.label.length > 0)
        this.props.performSearch({mode: MODE.SEARCH, searchPattern: searchPattern.label})
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

  onMenuCloseArtist(){
    this.setState({
      searchInputBackground: '#DDDDDD', 
      searchInputBorder: '0px solid #DDDDDD'
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
    console.log("ReRender")

    return (
      <Container style={{ border: '1px solid #938369', height: '100vh'}}>

        <Row className="mb-3" style={{ padding: '3em 1em 1em 1em', background: '#938369'}}>
          <Col md={5}>
            <img height="50" alt="logo" className="mt-3" src={factureLogo}></img>
          </Col>
          <Col  md={7} className="d-flex justify-content-center align-items-center" style={{ padding: '2% 0 2% 0' }}>            
            <div className="h-100 mr-3">
              <button className="h-100 font-weight-bold" 
                style={{ background: '#f8ee23', borderRadius: '25px', border: 0, width: '120px', padding: '0 1em 0 1em'}}
                onClick={(e) => this.setState({triggerUpload: triggerUpload + 1 })} >
                <FontAwesomeIcon icon={faArrowUp}
                          />
                <span className="pl-2">UPLOAD</span>
              </button>
            </div>
            <div style={{ flexGrow: 1}}>
            <Select isLoading={this.state.isLoadingArtist} 
                isClearable 
                isSearchable options={artistOptions} 
                onInputChange={(e) => this.onInputChangeArtist(e)} 
                onKeyDown={(e) => this.onKeyDownArtist(e)}
                onMenuOpen={(e) => this.onMenuOpenArtist()}
                onMenuClose={(e) => this.onMenuCloseArtist()}
                onChange={ (e) => this.performSearchArtist(e) }
                inputValue={searchPattern}
                placeholder={'Search by Artist'}  
                styles={{      
                  container: (provided) => ({
                    ...provided,
                  }),
                  control: (provided) => ({ 
                    ...provided, 
                    borderRadius: '20px', 
                    background: searchInputBackground, 
                    border: searchInputBorder,
                    outline: "none !important",
                    boxShadow: "none !important",
                    "&:focus" :{
                      border: '1px solid black',
                      outline: 'none'
                    }
                  }),
                  indicatorSeparator: (provided) => ({ backgroundColor: 'white', width: '0'}),
                  option: (provided) => ({ 
                    ...provided,
                    backgroundColor: 'white',
                    color: 'black',
                    "&:hover" :{
                      backgroundColor: '#DDDDDD'
                    } 
                  }) 
                }}
                />
              </div>

          </Col>
        </Row>

        <div style={{ height: '80vh'}}>
          {mode === MODE.SEARCH?
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
