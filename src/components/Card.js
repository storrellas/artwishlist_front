import React from 'react';
import { withRouter } from 'react-router-dom'


class Card extends React.Component {

  render(){
    const { painting } = this.props;

    const dummyImageUrl = 
      "http://www.artnet.com/WebServices/images/ll933731llgG4ECfDrCWBHBAD/pablo-picasso-television:-gymnastique-au-sol,-avec-spectateurs,-from-the-347-series.jpg";

    return (
      <div className="card-container">
        <div className="text-center card-title font-weight-bold">
            {painting.source_type}
        </div>
        <div className="card-painting" onClick={(e) => this.props.history.push(`/detail/${painting.pk}`)}>
          <img className="w-100" alt="dummyImage" src={dummyImageUrl}></img>
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


export default withRouter(Card);
