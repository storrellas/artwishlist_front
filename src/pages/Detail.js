import React from 'react';


class Detail extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {
    console.log("ReRender")
    return (
      <div>Im the detail page</div>
    );
  }
}


export default Detail;
