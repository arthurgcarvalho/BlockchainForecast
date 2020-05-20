import React, { Component } from "react"
import { Button, Input, PageHeader, Spin } from "antd"
import Web3 from 'web3';

class ReportForecast extends Component {
    state = {
        q1: null,
        q2: null,
        contractAddress: null,
        publicKey: null,
        privateKey: null,
        feedbackMessage: null,
        loading: null,
        buttonEnabled: true
    }

    submitForecast = async e => {
        e.preventDefault()

        try {
            const rpcURL = "https://ropsten.infura.io/v3/17bd62803df0419ba682f8973f114556" 
            const web3 = new Web3(rpcURL)
        
            const abi = [ { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "reportedForecast", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "myid", "type": "bytes32" }, { "name": "result", "type": "string" } ], "name": "__callback", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "myid", "type": "bytes32" }, { "name": "result", "type": "string" }, { "name": "proof", "type": "bytes" } ], "name": "__callback", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "thresholdValue", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "issuePayment", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "retrieveActualOutcome", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "paymentIssued", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "currentPrice", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "dateForecastDeadline", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "q1", "type": "uint256" }, { "name": "q2", "type": "uint256" } ], "name": "reportForecast", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "principal", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "dateOutcomeAvailable", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "contractActive", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "maxPayment", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "agent", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": true, "stateMutability": "payable", "type": "constructor" } ]
        
            const contract = new web3.eth.Contract(abi, this.state.contractAddress)
            const nonceCount = await web3.eth.getTransactionCount(this.state.publicKey);

            const signedTx = await web3.eth.accounts.signTransaction({
                from: this.state.publicKey,
                to:   this.state.contractAddress,
                gas: '300000',
                gasPrice: web3.utils.toWei('10', 'gwei'),
                chainId: 3, //Ropsten
                nonce: nonceCount,
                data: contract.methods.reportForecast(this.state.q1, this.state.q2).encodeABI()
            }, this.state.privateKey);

            web3.eth.sendSignedTransaction(signedTx.rawTransaction)
            .on("error", error => { //transaction error
                console.log(error);
                this.setState({loading: null});
                this.setState({feedbackMessage: <h3> Transaction failed! </h3>});
                this.setState({buttonEnabled: true});
            })
            .on("receipt", receipt => { //transaction successful
                console.log(receipt);
                this.setState({loading: null});
                this.setState({feedbackMessage: <h3> Transaction was successful!! <br/> Block Number: {receipt.blockNumber} <br /> Transaction Hash: {receipt.transactionHash}</h3>});
                this.setState({buttonEnabled: true});
            });

            //Waiting for blockchain response
            this.setState({loading: true});
            this.setState({buttonEnabled: false});
            this.setState({feedbackMessage: null});
        }
        catch (error) { //code error
            this.setState({buttonEnabled: true});
            this.setState({loading: null});
            this.setState({feedbackMessage: <h3> {error.message} </h3>});
        }
    }

    render() {
        return (
            <div>
                <PageHeader className="header-container" title="Report Forecast" />
                <Input.Group compact className="container">
                    <h1 style={{margin: 0, color: "#1890ff", fontSize: 18}}>
                        Forecast
                    </h1>
                    <br />
                    <Input
                        style={{
                            width: 100,
                            textAlign: "center",
                            borderRight: 0
                        }}
                        placeholder="Value 1"
                        onChange={e => this.setState({ q1: e.target.value })}
                    />
                    <Input
                        style={{
                            width: 30,
                            borderLeft: 0,
                            pointerEvents: "none",
                            backgroundColor: "#fff"
                        }}
                        placeholder="|"
                        disabled
                    />
                    <Input
                        style={{
                            width: 100,
                            textAlign: "center",
                            borderLeft: 0
                        }}
                        placeholder="Value 2"
                        onChange={e => this.setState({ q2: e.target.value })}
                    />
                    <br />
                    <br />
                    <br />
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
                    <br />
                    <br />
                    <br />
                    <h1 style={{margin: 0, color: "#1890ff", fontSize: 18}}>
                        Agent's Info
                    </h1>
                    <br />
                    <Input
                        style={{
                            width: 400,
                            textAlign: "center",
                        }}
                        placeholder="Agent's Public Key"
                        onChange={e => this.setState({ publicKey: e.target.value })}
                    />
                    <br />
                    <br />
                    <Input
                        style={{
                            width: 400,
                            textAlign: "center",
                        }}
                        placeholder="Agent's Private Key"
                        onChange={e => this.setState({ privateKey: e.target.value })}
                    />
                    <br />
                    <br />
                    <br />
                    <Button icon="export" type="primary"  disabled={!this.state.buttonEnabled} onClick={this.submitForecast}>
                        Report
                    </Button>
                    <br />
                    <br />
                    {this.state.loading && <Spin tip = "Blockchain is processing the transaction" size="large" /> }
                    <br /><br /><br />
                    {this.state.feedbackMessage}
                </Input.Group>
            </div>
        )
    }
}

export default ReportForecast
