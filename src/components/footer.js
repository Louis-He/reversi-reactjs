import React from 'react';

export default class MyFooter extends React.Component {
  render() {
    return (
      <footer style={{marginTop: "100px", bottom:"10px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px", position: "relative"}}>
          <div style={{borderTopStyle: "solid", borderWidth: "2px", width: "100%", borderColor: "#CCCCCC"}}>
              <div style={{display: "flex", justifyContent: "center", alignItems: "center", padding: "20px"}}>
                  &copy; 2023 copyright APS105 Teaching Team, University of Toronto
              </div>
          </div>
      </footer>
    )
  }
}

