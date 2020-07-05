import React, { Component } from "react"
import { Card, Descriptions } from "antd"

class Contract extends Component {
    render() {
        const {
            contractAddress,
            newsvendor,
            expert,
            maxPayment,
            forecastDeadline,
            outcomeAvailable,
            contractActive,
        } = this.props.contract
        return (
            <Card title= {"Contract's Address: " + contractAddress} >
                <Descriptions layout="vertical" bordered>
                    <Descriptions.Item label="Newsvendor's Address">{newsvendor}</Descriptions.Item>
                    <Descriptions.Item label="Expert's Address">{expert}</Descriptions.Item>
                    <Descriptions.Item label="Maximum Payment (Wei)">{maxPayment}</Descriptions.Item>
                    <Descriptions.Item label="Forecast Deadline">{forecastDeadline}</Descriptions.Item>
                    <Descriptions.Item label="Date Outcome Available">{outcomeAvailable}</Descriptions.Item>
                    <Descriptions.Item label="Contract Active">{contractActive}</Descriptions.Item>
                </Descriptions>
            </Card>
        )
    }
}

export default Contract
