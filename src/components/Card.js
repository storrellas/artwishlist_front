import React from 'react';
import { withRouter } from 'react-router-dom'

// Redux
import { connect } from "react-redux";

// Project imports
import { getSource } from '../shared/utils'

const mapDispatchToProps = (dispatch) => {
  return {};
}

const noImageUrl = 
  "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
export const IMAGE_SOURCE = { THUMBNAIL: 1, PATH: 2, API: 3 }  
class Card extends React.Component {

  constructor(props){
    super(props)
    this.state = {}    
    this.imageSource = IMAGE_SOURCE.THUMBNAIL
  }

  onClick(paintingId){
    window.open(`/artwork/${paintingId}`)
  }

  onLoadImageError(){
    
    this.imageSource = this.imageSource + 1
    this.forceUpdate()
  }

  getImageUrl(image){
    const { imagesBaseUrl } = this.props;
    let imageUrl = ''
    if( image.thumbnail && this.imageSource <= IMAGE_SOURCE.THUMBNAIL){
      imageUrl = `${imagesBaseUrl}${image.thumbnail}`
      this.imageSource = IMAGE_SOURCE.THUMBNAIL
    }else if(image.path && this.imageSource <= IMAGE_SOURCE.PATH){
      imageUrl = `${imagesBaseUrl}${image.path}`
      this.imageSource = IMAGE_SOURCE.PATH
    }else if(image.url && this.imageSource <= IMAGE_SOURCE.API){      
      this.imageSource = IMAGE_SOURCE.API
      imageUrl = `${process.env.REACT_APP_API_URL}/api/aw_lots/image/${image.pk}`
    }else{
      imageUrl = noImageUrl;
    }
    return imageUrl
  }

  render(){
    const { painting } = this.props;

    // Thumbnail
    let imageUrl = noImageUrl;
    if( painting.images ){
      if( painting.images.length > 0 ){
        const image = painting.images[0]
        imageUrl = this.getImageUrl(image)
      }
    }

  
    // Get Source
    let source = getSource(painting.source_type)

    return (
      <div className="card-container">
        <div className="card-title font-weight-bold">
            {source}
        </div>
        <div className="card-painting" 
          onClick={(e) => this.onClick(painting.pk)} 
          style={{ height: '200px'}}>
          <div className="h-100 d-flex justify-content-center align-items-center">            
            <img alt="dummyImage" 
                  src={imageUrl} 
                  onError={(e) => this.onLoadImageError()}
                  style={{ maxWidth: '100%', maxHeight: '100%'}}></img>
          </div>
        </div>
        <div className="mt-3" style={{ fontSize: '12px', height: '200px', overflowY: 'hidden'}}>
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
          {/* <div className="text-center mt-3" >
            <a href="/" className="font-weight-bold" style={{ color: 'grey'}}>Download PDF</a>
          </div> */}
        </div>
      </div>
    )
  }

}


export default connect(null, mapDispatchToProps)(withRouter(Card));
