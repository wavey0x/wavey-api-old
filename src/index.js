import React from "react";
import { render } from "react-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCopy, faBinoculars } from '@fortawesome/free-solid-svg-icons'


// Import React Table
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
const axios = require('axios').default;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {}
    };
  }
  componentDidMount() {
    // axios.get('http://192.168.1.36:3001/addresses')
    axios.get('https://wavey.info:3001/addresses')
        .then((results) => {
            console.log(results)
            this.setState({ data: results })
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
  }
  copyAddress(e, address){
    navigator.clipboard.writeText(address)
  }

  yearnWatch = (data) => {
    console.log(data);
    let url = "";
    let network;
    if(data.chain_id === 1){
        network = "ethereum";
    }
    if(data.chain_id === 250){
        network = "fantom";
    }
    if(data.chain_id === 42161){
        network = "arbitrum";
    }
    if(data.vaultOrStrat === "Strategy"){
        url = `https://yearn.watch/network/${network}/vault/${data.address}/strategy/${data.address}/`
    }
    else{
        url = `https://yearn.watch/network/${network}/vault/${data.address}/`
    }
    window.open(url, "_blank")
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <ReactTable
          data={data.data}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())}
            columns={[
            {
                    Header: "ETH address",
                    accessor: "address",
                    filterMethod: (filter, row) =>
                    row[filter.id].startsWith(filter.value),
                    Cell: (props) => (
                        <span>
                        <FontAwesomeIcon
                            icon={faCopy}
                            className={"icon__"}
                            onClick={(e)=>this.copyAddress(e, props.value)}//e => {console.log(e)}}//navigator.clipboard.writeText(props.value)}}
                        /> {" - "}
                        <FontAwesomeIcon
                            icon={faBinoculars}
                            className={"icon__"}
                            onClick={()=>this.yearnWatch(props.row)}//e => {console.log(e)}}//navigator.clipboard.writeText(props.value)}}
                        /> 
                        <a href={"https://etherscan.io/address/"+ props.value} target="_blank">
                            {"  " + props.value}
                        </a>
                        </span>
                    )

            },
            {
                Header: "Strat/Vault Name",
                accessor: "name",
                filterMethod: (filter, row) =>
                    row[filter.id].toLowerCase().includes((filter.value).toLowerCase())
    
            },
            {
                Header: "Chain ID",
                accessor: "chain_id"

            },
            {
                Header: "Want Token",
                accessor: "want"

            },
            {
                Header: "Strat/Vault",
                id: 'vaultOrStrat',
                accessor: data => {
                    if(data.is_strategy) return "Strategy";
                    return "Vault";
                }

            },
            {
                Header: "API",
                id: 'api',
                accessor: 'api',
                filterMethod: (filter, row) =>
                    row[filter.id].includes(filter.value)

            },
          ]}
          defaultPageSize={50}
          className="-striped -highlight"
        />
        <br />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
