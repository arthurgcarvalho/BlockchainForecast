import React, { Component } from "react"
import { Card, Descriptions } from "antd"

class Contract extends Component {
    render() {
        const {
            contractAddress,
            principal,
            agent,
            maxPayment,
            forecastDeadline,
            outcomeAvailable,
            bitcoinPrice,
            thresholdValue,
            contractActive,
            paymentIssued
        } = this.props.contract
        return (
            <Card title= {"Contract's Address: " + contractAddress} >
                <Descriptions layout="vertical" bordered>
                    <Descriptions.Item label="Principal's Address">{principal}</Descriptions.Item>
                    <Descriptions.Item label="Agent's Address">{agent}</Descriptions.Item>
                    <Descriptions.Item label="Maximum Payment (Wei)">{maxPayment}</Descriptions.Item>
                    <Descriptions.Item label="Forecast Deadline">{forecastDeadline}</Descriptions.Item>
                    <Descriptions.Item label="Date Outcome Available">{outcomeAvailable}</Descriptions.Item>
                    <Descriptions.Item label="Observed ETH Price">{bitcoinPrice}</Descriptions.Item>
                    <Descriptions.Item label="Forecasted Value Threshold">{thresholdValue}</Descriptions.Item>
                    <Descriptions.Item label="Contract Active">{contractActive}</Descriptions.Item>
                    <Descriptions.Item label="Payment Issued">{paymentIssued}</Descriptions.Item>
                </Descriptions>
            </Card>
        )
    }
}

export default Contract
