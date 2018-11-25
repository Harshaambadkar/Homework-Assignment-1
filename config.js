/*
*create and export configration variable
*/
//container for all enviornments
var enviornment={};

//staging {default} enviornment;
enviornment.staging={
	'httpPort':3000,
	'httpsPort':3001,
	'envName':'staging'
};
//production enviornment
enviornment.production={
	'httpPort':5000,
	'httpsPort':5001,
	'envName':'production'
}

//Determine which enviornment was passed as a command line argument
var currentEnviornment=typeof(process.env.NODE_ENV)=="string" ? process.env.NODE_ENV.toLowerCase() :'';

//check the current enviornment is one of the enviornment above ,if not default to staging
var enviornmentToExport=typeof(enviornment[currentEnviornment])=='object' ? enviornment[currentEnviornment] : enviornment.staging;

module.exports=enviornmentToExport;