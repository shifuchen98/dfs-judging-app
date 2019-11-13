import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faRulerHorizontal
} from "@fortawesome/free-solid-svg-icons";

import AV from "leancloud-storage/live-query";
import Papa from "papaparse";
import "./style.css";
import xlsxParser from "xlsx-parse-json";

export default class FileReader extends React.Component {
  constructor() {
    super();
    this.state = {
      myfile: undefined,
      myfiletype: undefined,
      myfiledata: undefined
    };
    this.updateData = this.updateData.bind(this);
  }

  handleChange = event => {
    this.setState({
      myfile: event.target.files[0],
      myfiletype: event.target.files[0].type
    });
  };

  importCSVorXLSX = () => {
    const { myfile, myfiletype } = this.state;
    if (
      myfiletype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      xlsxParser.onFileSelection(myfile).then(data => {
        var parsedData = data;
        this.setState({ myfiledata: parsedData.Sheet1 });
        // for (var i = 0; i < mySheet.length; i++) {
        //   console.log([mySheet[i].email, mySheet[i].name].join(","));
        // }
      });
    }

    Papa.parse(myfile, {
      complete: this.updateData,
      header: true
    });
  };

  updateData(result) {
    const { myfiletype, myfiledata } = this.state;
    var data_string = "";

    if (myfiletype === "text/csv") {
      var data = result.data;
    } else if (
      myfiletype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      var data = myfiledata;
    }
    data.forEach(function(element) {
      data_string =
        data_string + [element.email, element.name].join(",") + "\n";
    });
    this.setState({ myfiledata: this.data_string });
  }

  render() {
    console.log(this.state.myfile);
    return (
      <div className="App">
        <h2>Import CSV File!</h2>
        <input
          className="csv-input"
          type="file"
          ref={input => {
            this.filesInput = input;
          }}
          name="file"
          placeholder={null}
          onChange={this.handleChange}
        />
        <p />
        <button onClick={this.importCSVorXLSX}> Upload now!</button>
      </div>
    );
  }
}
