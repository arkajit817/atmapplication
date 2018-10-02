'use strict';
const Cards = require('../models/user');
const Atm = require('../models/atm');
const Transaction = require('../models/transaction');



module.exports = function(_){
	return {
		SetRouting : function(router){
			router.get('/', this.indexPage);
			router.post('/withdraw',this.withdraw);
			
			router.post('/',this.postLogin);
			
		},

		indexPage : function(req,res){
			const errors = req.flash('error');

			return res.render('index', {
				title: 'Transaction | Login',
				messages: errors,
				hasErrors: errors.length > 0,
			});
		},
		
		
		postLogin : function(req,res){
			console.log(req.body);
			Cards.find({'card_number' : req.body.cardno},(err,card)=>{
				// console.log("card",card[0].card_number,"card");
				// var cards = card[0].toString();
				console.log(card,"arka")
				if(err){
					return done(err);
				}
				if(card[0]==null){
					const messages = [];
					messages.push('Please enter a valid card no & password');
					return res.render('index', {
						title: 'Transaction | Signup',
						messages: messages,
						
						hasErrors : true
						
					});
            		// return done(null, false,req.flash('error',messages));
				} else {
					if(card[0].card_number==req.body.cardno && card[0].pin == req.body.pin){
						//console.log("yes");
						return res.render('screen2', {
							title: 'Transaction | Signup',
							messages: "errors",
							cardno : card[0].card_number,
							balance : card[0].balance,
							hasErrors : false
							
						});
					}
				}
				
				
			})
			
		},
		withdraw : function(req,res){
			console.log(req.body);
			if(parseInt(req.body.balance)<parseInt(req.body.amount)){
				var errorm = ["Please enter a valid amount"];
				return res.render('screen2', {
					title: 'Transaction | Signup',
					messages: errorm,
					cardno : req.body.card_number,
					balance : req.body.balance,
					hasErrors : true
					
				});
			} else {
				var nooftwo = parseInt(req.body.amount);
				Atm.find({},(err,resp)=>{
					console.log(resp,"aaya");
					//var hund = '100';
					var noofh = resp[0].hundreds;
					var nooff= resp[0].fivehundred;
					var nooftwo = resp[0].twothousand;
					console.log(noofh,nooff,nooftwo,"no");
					var value = calculate(req.body.amount,noofh,nooff,nooftwo);
					console.log(value,"value");
					if(value=='unable'){
						var errormsg = ["Unable to dispense the required amount"];
						return res.render('screen2', {
							title: 'Transaction | Signup',
							messages: errormsg,
							cardno : req.body.card_number,
							balance : req.body.balance,
							hasErrors : true
							
						});

					} else {
						var totalwithdrawn = value.twothousand*2000+ value.fivehundred*500+ value.hundreds*100;
						var balance = req.body.balance- totalwithdrawn;
						console.log(balance,"balan");
						var transaction = new Transaction({
							cardnumber : req.body.card_number,
							withdrawalAmount : totalwithdrawn
						});
						Transaction.createTransaction(transaction,function(err,results){
							if(err) console.log(err);
							else {
								console.log(results);
							}
						})
						Cards.findOneAndUpdate({'card_number' : req.body.cardno},{balance: balance}, (err,resp)=>{
							console.log(resp,"bal",err);
							if(err) {
								console.log("Balance updated failed");
							} else {
								var errormsg2 = ["Successfully withdrawn: "+totalwithdrawn];
								return res.render('home', {
									title: 'Transaction | Signup',
									messages: errormsg2,
									cardno : req.body.card_number,
									balance : balance,
									twothousandnotes : value.twothousand,
									fivehundrednotes : value.fivehundred,
									hundredsnotes : value.hundreds,
									hasErrors : true
									
								});
							}
						})
						
					}
					//
					


					// var nooff = resp.500;
				})
			}
			// Atm.find({},(err,resp)=>{
			// 	console.log(resp,"aaya");
			// })

		}
		

		
	}
}


function calculate(amount,hund,five,twothousandno){
	var mainamount = amount;
	var denomi= {twothousand: '', fivehundred :'',hundreds : ''};
	var noofthousands = Math.floor(amount/2000);
	console.log(noofthousands);
	console.log(twothousandno);
	if(noofthousands>twothousandno){
		denomi.twothousand = twothousandno;
	} else {
		denomi.twothousand = noofthousands;
	}
	console.log(denomi,"deno");
	amount = amount - 2000*(denomi.twothousand);
	console.log(amount);
	var nooffive = Math.floor(amount/500);
	if(nooffive>five){
		denomi.fivehundred = five;
	} else {
		denomi.fivehundred = nooffive;
	}
	amount = amount- 500*(denomi.fivehundred);
	console.log(denomi,"deno 2");
	var noofhundreds = Math.floor(amount/100);
	if(noofhundreds>hund){
		denomi.hundreds = hund;
	} else {
		denomi.hundreds = noofhundreds;
	}
	amount= amount - 100*(denomi.hundreds);
	console.log(denomi,"deno 3");
	if((denomi.twothousand*2000 + denomi.fivehundred*500 + denomi.hundreds*100)== mainamount){
		return denomi;
	} else {
		// denomi.twothousand = 0;
		// denomi.fivehundred = 0;
		// denomi.hundreds = 0;
		// return denomi;
		return "unable";
	}
	

}