pragma solidity ^0.4.25;
import "github.com/provable-things/ethereum-api/provableAPI_0.4.25.sol";

contract ForecastContract is usingProvable {

    //Ethereum addresses of the newsvendor and expert
    address constant public newsvendor = 0x00A877E0325Ba6c697f5a6ae05Fa8F91b544276C;
    address constant public expert     = 0xD2D6A728De96fF2c668aC7F72e54aEB7d8491374;

    //Maximum payment the expert can receive from the PSR (in Wei)
    uint256 constant public maxPayment = 2000000000000000000; //2 ethers

    //Deadlines in Unix epoch format (seconds)
    uint constant public dateForecastDeadline = 1593910800;
    uint constant public dateOutcomeAvailable = 1593910800;
    
    //Forecast to be reported by the expert
    uint[] public reportedForecast; 
    
    //Outcome-related variable 
    uint observedOutcomeIndex = 2;     //Observed outcome - initial value is invalid
    
    //Variable that defines whether the contract is active
    bool public contractActive = true;
    
    //This function is equivalent to Algorithm 1
    //It is called only once when the contract is submitted by the newsvendor
    constructor() public payable{
        require(msg.value  >= maxPayment); //The value in escrow must pay for the max payment
        require(msg.sender == newsvendor); //Contract creator must be the newsvendor
        require (now < dateForecastDeadline && dateForecastDeadline <= dateOutcomeAvailable); //Valid dates
    }

    //Function called by the expert when reporting the forecast equivalent to Algorithm 2
    //Since Ethereum does not support decimal points, we assume forecasts are reported as whole percentages
    function reportForecast(uint q1, uint q2) public{
        require(msg.sender == expert); //The user reporting the forecast is the expert
        require(now <= dateForecastDeadline); //The deadline for reporting a forecast has not passed
        require(contractActive); //Contract must be active
        require(q1 >= 0 && q1 <= 100); //Valid forecast values
        require(q2 >= 0 && q2 <= 100); //Valid forecast values
        require( (q1 + q2) == 100); //Valid forecast values
      
        reportedForecast = [q1, q2];
    }
    
    //Function called by either the newsvendor or the expert to download data containing the realized outcome
    //Equivalent to Algorithm 3
    function retrieveRealizedOutcome() payable public{
        require(contractActive); //Contract must be active
        require(msg.sender == expert || msg.sender == newsvendor); //User must be the expert or the newsvendor
        require(now >= dateOutcomeAvailable); //Outcome must be available

        //This command invokes the Oracle to retrieve the realized outcome from the URL below
        //Once the Oracle is done, it will automatically call the "_callback function"
        provable_query("URL", "json(http://users.miamioh.edu/carvalag/research/psr/oracle.json).outcome");
    }
        
    //Function automatically called to process the data retrieved by the Oracle
    function __callback(bytes32 myid, string result) public{
        if (msg.sender != provable_cbAddress()) revert();
        observedOutcomeIndex = parseInt(result); //0 = low demand; 1 = high demand
    }
           
   //Function called to issue a payment equivalent to Algorithm 4
    function issuePayment() public payable { 
        require(contractActive); //Contract must be active
        require(observedOutcomeIndex != 2); //Observed outcome must have been retrieved
        require(msg.sender == expert || msg.sender == newsvendor); //User must be the expert or the newsvendor
        
        contractActive = false; //Setting contract as inactive

        //if no forecast is reported, then the newsvendor gets all the money back
        if(reportedForecast.length == 0) {
            newsvendor.transfer(address(this).balance);
        }
        else {            
            uint payment = 0; 
            if(reportedForecast[1] <= 75) {
                payment = 500000000000000000; // 0.5 ethers
            }
            else {
                if(observedOutcomeIndex == 0){
                    payment = 100000000000000000; // 0.1 ethers
                }
                else{
                    payment = 1700000000000000000; // 1.7 ethers
                }
            }
            
            //transferring money
            expert.transfer(payment);
            newsvendor.transfer(address(this).balance);
        }

    }

}