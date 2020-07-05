import React, { Component } from "react"
import { HashRouter as Router, Link, Route, Switch } from "react-router-dom"
import "./App.css"
import { Icon, Menu }        from "antd" //list of items available at https://3x.ant.design/components/icon/
import ContractInfo          from "./pages/ContractInfo"
import ReportForecast        from "./pages/ReportForecast"
import RetrieveOutcome       from "./pages/RetrieveOutcome"
import IssuePayment          from "./pages/IssuePayment"
import RetrieveForecast      from "./pages/RetrieveForecast"


class App extends Component {

    componentDidMount() {
        document.title = 'Blockchain-Based Forecasting';
    }

    render() {
        return (
            <Router>
                <div className="nav-container">
                    <h1 style={{textAlign: "center", margin: 0, color: "#1890ff", fontSize: 32}}>
                        Blockchain-Based Forecasting
                    </h1>
                    <Menu mode="horizontal" className="nav">
                        <Menu.Item key="search">
                            <Link to="/">
                                <Icon type="file-search" />
                                    Contract Info
                                </Link>
                        </Menu.Item>
                        <Menu.Item key="report">
                            <Link to="/report">
                                <Icon type="export" />
                                    Report Forecast
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="retrieve">
                            <Link to="/retrieve">
                                <Icon type="cloud-download" />
                                    Retrieve Outcome
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="pay">
                            <Link to="/pay">
                                <Icon type="dollar" />
                                    Issue Payment
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="forecast">
                            <Link to="/forecast">
                                <Icon type="download" />
                                    Retrieve Forecast
                            </Link>
                        </Menu.Item>
                    </Menu>
                </div>
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <ContractInfo />
                        )}
                    />
                    <Route
                        path="/report"
                        render={() => (
                            <ReportForecast />
                        )}
                    />
                    <Route
                        path="/retrieve"
                        render={() => (
                            <RetrieveOutcome />
                        )}
                    />
                    <Route
                        path="/pay"
                        render={() => (
                            <IssuePayment />
                        )}
                    />
                    <Route
                        path="/forecast"
                        render={() => (
                            <RetrieveForecast />
                        )}
                    />
                </Switch>
            </Router>
        )
    }
}

export default App
