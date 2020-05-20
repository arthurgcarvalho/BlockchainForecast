import React, { Component } from "react"
import { Button, Form, Input, PageHeader } from "antd"
import Contract from "../components/Contract"
import Web3 from 'web3';

class ContractInfo extends Component {

    state = {
        result: null,
        feedbackMessage: null,
        contractAddress: null,
        principal: null,
        agent: null,
        maxPayment: null,
        forecastDeadline: null,
        outcomeAvailable: null,
        bitcoinPrice: null,
        thresholdValue: null,
        contractActive: null,
        paymentIssued: null
    }

    performSearch = async e => {
        e.preventDefault();
       
        try {
            const rpcURL = "https://ropsten.infura.io/v3/17bd62803df0419ba682f8973f114556" // Your RPC URL goes here - from infura.io
            const web3 = new Web3(rpcURL)
        
            const abi = [ { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "reportedForecast", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "myid", "type": "bytes32" }, { "name": "result", "type": "string" } ], "name": "__callback", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "myid", "type": "bytes32" }, { "name": "result", "type": "string" }, { "name": "proof", "type": "bytes" } ], "name": "__callback", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "thresholdValue", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "issuePayment", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "retrieveActualOutcome", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "paymentIssued", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "currentPrice", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "dateForecastDeadline", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "q1", "type": "uint256" }, { "name": "q2", "type": "uint256" } ], "name": "reportForecast", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "principal", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "dateOutcomeAvailable", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "contractActive", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "maxPayment", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "agent", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": true, "stateMutability": "payable", "type": "constructor" } ]
        
            const contract = new web3.eth.Contract(abi, this.state.contractAddress)

            await contract.methods.principal().call({}, (error, result) => {
                this.setState({principal: result})
            });
            await contract.methods.agent().call({}, (error, result) => {
                this.setState({agent: result})
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
            await contract.methods.currentPrice().call({}, (error, result) => {
                if(result === "0"){
                    this.setState({bitcoinPrice: "NA"})
                }
                else {
                    this.setState({bitcoinPrice: result})
                }
            });
            await contract.methods.thresholdValue().call({}, (error, result) => {
                this.setState({thresholdValue: result})
            });
            await contract.methods.contractActive().call({}, (error, result) => {
                this.setState({contractActive: ""+result})
            });
            await contract.methods.paymentIssued().call({}, (error, result) => {
                this.setState({paymentIssued: ""+result})
            });


            this.setState(  { result: { contractAddress:  this.state.contractAddress,
                                        principal:        this.state.principal,
                                        agent:            this.state.agent,
                                        maxPayment:       this.state.maxPayment,      
                                        forecastDeadline: this.state.forecastDeadline,
                                        outcomeAvailable: this.state.outcomeAvailable,
                                        bitcoinPrice:     this.state.bitcoinPrice,
                                        thresholdValue:   this.state.thresholdValue,
                                        contractActive:   this.state.contractActive,
                                        paymentIssued:    this.state.paymentIssued 
                                       }
                            }
            );

            this.setState({feedbackMessage: null});

            let logData = "0x0000000000000000000000003e0fbe2ffc810d475014b6c6a5f6ff9fc4c76756f7a70cbd365b706ec42ab7309c63d3d7d170dcfe378fc6b9f30ed200059908a30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000030d4000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000355524c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000406a736f6e2868747470733a2f2f6170692e70726f2e636f696e626173652e636f6d2f70726f64756374732f4554482d5553442f7469636b6572292e7072696365";
            let outputListDecoded = web3.eth.abi.decodeParameters([
                {
                    "type": "uint",
                    "name": "payment"				
                }
            ],logData);

            console.log(outputListDecoded);

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
