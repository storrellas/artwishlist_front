import React from 'react';
import { withRouter } from 'react-router-dom'

// Redux
import { showDetail } from "../redux";
//import { MODE } from "../redux";
import { connect } from "react-redux";


const mapDispatchToProps = (dispatch) => {
  return {
      showDetail: (payload) => dispatch(showDetail(payload))
  };
}

const noImageUrl = 
  "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
class Card extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      imageUrl: noImageUrl
    }
  }

  onClick(paintingId){
    //this.props.showDetail({mode: MODE.DETAIL, paintingId: paintingId})
    window.open(`/${paintingId}`)
  }


  render(){
    const { painting } = this.props;



    // Here get thumbnail (with base_url https://awdb-images.nyc3.digitaloceanspaces.com/)

    let imageUrl = noImageUrl;
    // if( painting.images ){
    //   if( painting.images.length > 0 ){
    //     imageUrl = painting.images[0].url
    //   }
    // }

    // if( painting.images ){
    //   if( painting.images.length > 0 ){
    //     const image = painting.images[0]
    //     if( image.thumbnail )
    //       imageUrl = `${process.env.REACT_APP_IMAGE_BASE_URL}/${image.thumbnail}`
    //     else if(image.path)
    //       imageUrl = `${process.env.REACT_APP_IMAGE_BASE_URL}/${image.path}`
    //     else if(image.url)
    //       imageUrl = image.url
    //   }
    // }


    

    // Devil's logic
    let source = ''

    // Auction
    if( ['A', 'P', 'YY', 'NN'].includes(painting.source_type) ) source = 'AUCTION';

    // CatRais
    const catRaisList1 = ['K', 'L', 'B', 'E', 'R', 'G', 'J', 'C', ]
    const catRaisList2 = ['O', 'U', 'H', 'I', 'S', 'W', 'M', '0', 'Z', 'JB', 'GL', 'CR']
    const catRaisList = [...catRaisList1, ...catRaisList2]
    if( catRaisList.includes(painting.source_type) ) source = 'CAT RAIS';
    
    // Online
    if( ['N', 'Y', 'D'].includes(painting.source_type) ) source = 'ONLINE';
    
    // Museum
    const museumList = ['X', 'F', '9', '8', '7', '6', 'RM', 'MT', 'AR', 'NG'];
    if( museumList.includes(painting.source_type) ) source = 'MUSEUM';

    // Private Collection
    const pcList1 = ['T', 'V', '2', 'TD', 'EC', 'BA', 'HA', 'CD', 'AP', 'FB', 'SG', 'TB', 'BF']
    const pcList2 = ['49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
    const pcList = [...pcList1, ...pcList2]
    if( pcList.includes(painting.source_type) ) source = 'PRIVATE COLLECTION';

    return (
      <div className="card-container">
        <div className="text-center card-title font-weight-bold">
            {source}
        </div>
        <div className="card-painting" 
          onClick={(e) => this.onClick(painting.pk)} 
          style={{ height: '200px'}}>
          <div className="h-100 d-flex justify-content-center align-items-center">            
            <img alt="dummyImage" src={imageUrl} style={{ maxWidth: '100%', maxHeight: '100%'}}></img>
          </div>
        </div>
        <div className="p-3" style={{ fontSize: '12px', height: '300px', overflowY: 'hidden'}}>
          <div>
            <b>{painting.artist}</b>
          </div>
          <div className="mt-2" style={{ color: 'grey'}}>
            <div>{painting.title} {painting.year_of_work_a}</div>
            <div>{painting.size_height} x {painting.size_width} {painting.size_unit}</div>
          </div>
          <div className="mt-2" style={{ color: 'grey'}}>
            <div>{painting.materials}</div>
            <div>{painting.collection}</div>
          </div>
  
          <div className="mt-2">
            <b>{painting.catalogue_number?`Nr. ${painting.catalogue_number}`:''}</b>
            <div style={{ color: 'grey'}}>
              {painting.sales_prices}
            </div>
          </div>
          <div className="text-center mt-3" >
            <a href="/" className="font-weight-bold" style={{ color: 'grey'}}>Download PDF</a>
          </div>
        </div>
      </div>
    )
  }

}


export default connect(null, mapDispatchToProps)(withRouter(Card));
