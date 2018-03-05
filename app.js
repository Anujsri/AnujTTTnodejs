var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var Table = require('cli-table');
var S = require('string');
var http = require('http'); 
mongoose.connect('mongodb://localhost/tttapp');
//No need of database in this app
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

//Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

 //Afetr getting input(Number) from user 

app.get("/getemail", function (request, response)
 {
  var Number = request.query.Number;
   if (Number>0) 
    {     
		  response.setHeader('Content-Type', 'text/html');

        // open file from current directory
	     var fs = require('fs');
          var file = 'word.txt';
          // read file from current directory
          fs.readFile(file, 'utf8', function (err, data) 
          {

           if (err) throw err;

              // getting data from file to find the frenquecy of word

              var wordsArray = splitByWords(data);    // store data from file to array ,find function at line No. 115
              var wordsMap = createWordMap(wordsArray);  // create map for word and their frequency, find function at line No. 123
              var finalWordsArray = sortByCount(wordsMap); // get final Map key:word and value:frequency,find function at line No. 144
               var len=finalWordsArray.length;
               console.log("Length:"+len);
               // Crerate array to store Keys in separate array
               var keys = Array();
               //Crerate array to store frequency in separate array
               var frequency = Array();
                  
                   //push keys and frequency in arrays  
                 for (var i=0;i<=Number;i++)
                 {
	                   if(i!=19)
	                      {
	                          keys.push(finalWordsArray[i]["key"]);
	                          frequency.push(finalWordsArray[i]["total"]);
	                      }
                  }
   
                 //we will print output on anuj.html file
  
            fs.readFile("anuj.html", function (error, pgResp) {
                if (error) 
                {
                     response.writeHead(404);
                     response.write('Contents you are looking are Not Found');
                } 
                else 
                {
                   response.writeHead(200, { 'Content-Type': 'text/html' });
                   response.write(pgResp);
                }
             
			 
			       //Design Front- End for support Back-End
            //Print data in tabular form
			      response.write("<center><div class='container'><h3 style='color:#062454 '><span style=font-weight:bold>*************************</span>");
			      response.write("Frquency of Words in word.txt file<span style=font-weight:bold>*************************</span></h3></div></center><hr/>");
			      response.write("<div class='container table-responsive'>");
			      response.write("<table class='table table-bordered table table-hover' style='color:#2F4F4F'><thead><tr style='color:white;font-weight: bold;background-color:#36648B'>");
			      response.write("<th style='width:200px'>Serial No.</th><th style='width:200px'>Word</th><th style='width:200px'>frquency</th> </tr></thead>"); 
			 
			      for (var i=0; i <Number ; i++) 
            {
				       var k=i+1;
				       response.write("<tbody><tr style='text-transform:uppercase;font-weight: bold;background-color:lightblue'>");
				       response.write("<td>"+k+"</td><td>"+ keys[i]+"</td><td>"+ frequency[i]+"</td></tr></tbody>");	
								
			     }			
			         response.write("</table>"); //end of ceration of table
			         response.write("</div>");
              response.end();
        }); 
   });


    function splitByWords (text) 
    {
       // split string by spaces (including spaces, tabs, and newlines)
       var wordsArray = text.split(/\s+/);
      return wordsArray;
    }


      function createWordMap (wordsArray)
       {
	       // create map for word counts
          var wordsMap = {};
          wordsArray.forEach(function (key) 
          {
	          var key1 = key.replace(/[^\w\s]/gi, '');
	          key1 = key1.replace(/\?/g, "");
            if (wordsMap.hasOwnProperty(key1)) 
            {
              wordsMap[key1]++;
            }
           else
            {
              wordsMap[key1] = 1;
            }
          });
          return wordsMap;
        }


      function sortByCount (wordsMap) 
      {
       // sort by count in descending order
        var finalWordsArray = [];
        finalWordsArray = Object.keys(wordsMap).map(function(key) 
        {
         return {key,total:wordsMap[key]};
        }
       );

        finalWordsArray.sort(function(a, b) 
        {
          return b.total - a.total;
        });

        return finalWordsArray;
      }

	}//End of read file and performing operations to get the frequencies of words 
	 
	 else 
   {
     response.send("Please provide Valid Number"); //if Number is greater than the lenght of Array of word(size of word.txt file)
  }
 });

app.use('/', routes);
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});