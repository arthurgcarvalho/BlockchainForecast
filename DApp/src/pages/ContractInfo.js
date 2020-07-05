import React, { Component } from "react"
import { Button, Form, Input, PageHeader } from "antd"
import Contract from "../components/Contract"
import Web3 from 'web3';

class ContractInfo extends Component {

    state = {
        result: null,
        feedbackMessage: null,
        contractAddress: null,
        newsvendor: null,
        expert: null,
        maxPayment: null,
        forecastDeadline: null,
        outcomeAvailable: null,
        contractActive: null,
    }

    performSearch = async e => {
        e.preventDefault();
       
        try {
            const rpcURL = "https://ropsten.infura.io/v3/17bd62803df0419ba682f8973f114556" // Your RPC URL goes here - from infura.io
            const web3 = new Web3(rpcURL)
        
            const abi = [ { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "reportedForecast", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "myid", "type": "bytes32" }, { "name": "result", "type": "string" } ], "name": "__callback", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "myid", "type": "bytes32" }, { "name": "result", "type": "string" }, { "name": "proof", "type": "bytes" } ], "name": "__callback", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "observedOutcomeIndex", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "issuePayment", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "newsvendor", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "retrieveRealizedOutcome", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "expert", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "dateForecastDeadline", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "q1", "type": "uint256" }, { "name": "q2", "type": "uint256" } ], "name": "reportForecast", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "dateOutcomeAvailable", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "contractActive", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "maxPayment", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": true, "stateMutability": "payable", "type": "constructor" } ]
        
            const contract = new web3.eth.Contract(abi, this.state.contractAddress)

            await contract.methods.newsvendor().call({}, (error, result) => {
                this.setState({newsvendor: result})
            });
            await contract.methods.expert().call({}, (error, result) => {
                this.setState({expert: result})
            });
            await contract.methods.maxPayment().call({}, (error, result) => {
                this.setState({maxPayment: result})
            });
            await contract.methods.dateForecastDeadline().call({}, (error, result) => {
                var t = new Date( parseInt(result)*1000 ); //transforming to milliseconds
                this.setState({forecastDeadline: t.toString()})
            });
            await contract.methods.dateOutcomeAvailable().call({}, (error, result) => {
                var t = new Date( parseInt(result)*1000 ); //transforming to milliseconds
                this.setState({outcomeAvailable: t.toString()})
            });
            await contract.methods.contractActive().call({}, (error, result) => {
                this.setState({contractActive: ""+result})
            });



            this.setState(  { result: { contractAddress:  this.state.contractAddress,
                                        newsvendor:       this.state.newsvendor,
                                        expert:           this.state.expert,
                                        maxPayment:       this.state.maxPayment,      
                                        forecastDeadline: this.state.forecastDeadline,
                                        outcomeAvailable: this.state.outcomeAvailable,
                                        contractActive:   this.state.contractActive,
                                       }
                            }
            );

            this.setState({feedbackMessage: null});

        }
        catch (error) {
            this.setState({result:null});
            this.setState({feedbackMessage: error.message});
        }
    }

    render() {
        return (
            <div>
                <PageHeader
                    className="header-container"
                    title="Contract Info"
                />
                <Form className="container" onSubmit={this.performSearch}>
                    <Input.Group compact className="container">
                        <Input
                            style={{
                                width: 400,
                                textAlign: "center",
                                borderRight: 0
                            }}
                            placeholder="Contract's Address"
                            onChange={e => this.setState({ contractAddress: e.target.value })}
                        />
                        <Button icon="search" type="primary" onClick={this.performSearch} >
                            Search
                        </Button>
                        <br />
                    </Input.Group>
                    {this.state.result && ( <Contract contract={this.state.result} /> )}
                    {this.state.feedbackMessage &&  <h3 className="error"> { this.state.feedbackMessage } </h3> }
                </Form>
            </div>
        )
    }
}

export default ContractInfo
