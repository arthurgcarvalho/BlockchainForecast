pragma solidity ^0.4.25;
import "github.com/provable-things/ethereum-api/provableAPI_0.4.25.sol";

contract QSR is usingProvable {
    
    //Ethereum addresses of the principal and agent
    address constant public principal = 0x00A877E0325Ba6c697f5a6ae05Fa8F91b544276C;
    address constant public agent     = 0xD2D6A728De96fF2c668aC7F72e54aEB7d8491374;
 
    //Maximum payment the agent can receive from the PSR (in Wei)
    uint256 constant public maxPayment = 5000000000000000; //aproximatelly one dollar
    
    //Deadlines - the dates below are in Unix epoch format (must be in seconds) - see https://www.epochconverter.com/ for a calculator
    uint constant public dateForecastDeadline = 1589902620; //Unix Epoch format
    uint constant public dateOutcomeAvailable = 1589902620; //Unix Epoch format
                                                
    
    //Forecast to be reported by the agent
    uint[] public reportedForecast; 
    
    //Outcome-related variables 
    uint observedOutcomeIndex           = 2;     //Observed outcome - initial value is invalid
    uint constant public thresholdValue = 220; //Value used to define the observed outome
    uint public currentPrice;                    //Observed Bitcoin price
    
    //Variable that defines whether the contract is active
    bool public contractActive = true;
    
    //Variable that defines whether a payment has been issued
    bool public paymentIssued  = false;


    //This function is called only once when the contract is submitted by the principal
    constructor() public payable{
        require(msg.value  >= maxPayment, "Not enough money in the escrow"); // the value in escrow must pay for the max payment plus any API call fees
        require(msg.sender == principal,  "The sender of the contract is not the principal");
        require (now < dateForecastDeadline && dateForecastDeadline <= dateOutcomeAvailable, "Dates are invalid when creating the contract");
    }



    //Function called by the agent when reporting the forecast
    //Since Ethereum does not support decimal points, we assume forecasts will be reported as percentages
    function reportForecast(uint q1, uint q2) public{
        require(msg.sender == agent, "The user reporting the forecast is not the agent");
        require(now <= dateForecastDeadline, "The deadline for reporting a forecast has passed");
        require(contractActive, "Contract is no longer active");
        require(q1 >= 0 && q1 <= 100, "Invalid forecast value"); 
        require(q2 >= 0 && q2 <= 100, "Invalid forecast value");
        require( (q1 + q2) == 100, "The sum of the reported forecast values is wrong");
      
        //the reported forecast is a valid forecast
        reportedForecast = [q1, q2];
    }
    
    

    //Function called by either the principal or the agent to download data containing the realized outcome
    function retrieveActualOutcome() payable public{
        require(contractActive, "Contract is no longer active");
        require(msg.sender == agent || msg.sender == principal, "User calling the function is neither the agent nor the principal" );
        require(now >= dateOutcomeAvailable, "Outcome is not yet available");

        //This line will obtain the outcome from the url below. Once it is done, it will automatically call the _callback function 
       provable_query("URL", "json(https://api.pro.coinbase.com/products/ETH-USD/ticker).price");

    }
    

    
    //Function automatically called to process that data retrieved from the API
    function __callback(bytes32 myid, string result) public{
       if (msg.sender != provable_cbAddress()) revert();

        //determining the observed outcome based on Bitcoin's current price
        currentPrice = parseInt(result);
        
        if(currentPrice < thresholdValue) {
            observedOutcomeIndex = 0;
        }
        else {
            observedOutcomeIndex = 1;
        }   
    }
    
   
       
   //Function called to issue a payment
    function issuePayment() public payable { 
        require(contractActive, "Contract is no longer active");
        require(observedOutcomeIndex != 2, "Observed outcome has not yet been retrieved");
        require(msg.sender == agent || msg.sender == principal, "User calling the function is neither the agent nor the principal" );

        uint payment = 0;
        
        //if no forecast is reported, then the principal gets all the money
        if(reportedForecast.length == 0) {
            principal.transfer(address(this).balance);
        }
        else {
            
            payment = (maxPayment/20000)*(200*reportedForecast[observedOutcomeIndex] - 
                       reportedForecast[0]*reportedForecast[0] -
                       reportedForecast[1]*reportedForecast[1] + 10000); 
            
            //transfering money and setting contract and inactiv e
            agent.transfer(payment);
            principal.transfer(address(this).balance);
        }

        //setting contract as inactive
        contractActive = false;
        
        //payment has been issued
        paymentIssued  = true;
    }
    
}