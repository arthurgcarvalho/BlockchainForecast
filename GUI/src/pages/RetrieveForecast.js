import { Button, Input, PageHeader, Card, Form} from "antd"
import React, { Component } from "react"
import Web3 from 'web3';

class RetrieveForecast extends Component {
    state = {
        feedbackMessage: null,
        contractAddress: null,
        q1: null,
        q2: null
    }

    issuePayment = async e => {
        e.preventDefault()
        
        try {
            const rpcURL = "https://ropsten.infura.io/v3/17bd62803df0419ba682f8973f114556" // Your RPC URL goes here - from infura.io
            const web3 = new Web3(rpcURL)
        
            const abi = [ { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "reportedForecast", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "myid", "type": "bytes32" }, { "name": "result", "type": "string" } ], "name": "__callback", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "myid", "type": "bytes32" }, { "name": "result", "type": "string" }, { "name": "proof", "type": "bytes" } ], "name": "__callback", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "issuePayment", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "newsvendor", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "retrieveRealizedOutcome", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "expert", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "dateForecastDeadline", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "q1", "type": "uint256" }, { "name": "q2", "type": "uint256" } ], "name": "reportForecast", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "dateOutcomeAvailable", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "contractActive", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "maxPayment", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": true, "stateMutability": "payable", "type": "constructor" } ]
        
            const contract = new web3.eth.Contract(abi, this.state.contractAddress)

            await contract.methods.reportedForecast(0).call({}, (error, result) => {
                this.setState({q1:result});
            });

            await contract.methods.reportedForecast(1).call({}, (error, result) => {
                this.setState({q2:result});
            });

            this.setState({feedbackMessage: null});

        }
        catch (error) {
            this.setState({q1:null});
            this.setState({q2:null});
            this.setState({feedbackMessage: <h3>{error.message}</h3>});
        }
    }

    render() {
        return (
            <div>
                <PageHeader className="header-container" title="Retrieve Forecast" />
                <Form className="container" onSubmit={this.issuePayment}>
                    <Input.Group compact className="container" >
                        <h1 style={{margin: 0, color: "#1890ff", fontSize: 18}}>
                            Contract's Address
                        </h1>
                        <br />
                        <Input
                            style={{
                                width: 400,
                                textAlign: "center",
                            }}
                            placeholder="Contract's Address"
                            onChange={e => this.setState({ contractAddress: e.target.value })}
                        />
                        <Button icon="download" type="primary" onClick={this.issuePayment} >
                            Retrieve
                        </Button>
                        <br />
                        <br />
                        <br />
                        {this.state.feedbackMessage &&  <h3 className="error"> { this.state.feedbackMessage } </h3> }
                        {this.state.q1 && this.state.q2 && (    
                                <Card title="Forecast" style={{ width: 300 }}>
                                    <p>q1 = {this.state.q1}</p>
                                    <p>q2 = {this.state.q2}</p>
                                </Card>)} 
                    </Input.Group>
                </Form>
            </div>
        )
    }
}

export default RetrieveForecast
