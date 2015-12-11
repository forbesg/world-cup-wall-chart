var wallChart = {}

wallChart.init = function(){
	
	/*------- Check for HTML5 Local Storage capabilities----------*/
	
	if (typeof(Storage) != undefined){
		if (localStorage['tableData'] && localStorage['fixtureData'] && localStorage['last16Data'] && localStorage['quartersData'] && localStorage['semisData']){  // If LocalStorage Exists Use that and call getTables & getFixtures
			tableData = JSON.parse(localStorage['tableData']);
			fixtures = JSON.parse(localStorage['fixtureData']);	
			last16 = JSON.parse(localStorage['last16Data']);
			quarters = JSON.parse(localStorage['quartersData']);
			semis = JSON.parse(localStorage['semisData']);
			final = JSON.parse(localStorage['finalData']);
			//wallChart.getTables(tableData, fixtures);
			//wallChart.getFixtures(tableData, fixtures);
			}
		else{	
			tableData = wallChart.setLocalData("data/team2014.json","tableData", "tableData");	// If Local Storage doesn't exit load JSON and call getTables & getFixtures
			fixtures = wallChart.setLocalData("data/scores.json","fixtureData", "fixtures");
			last16 = wallChart.setLocalData("data/last16.json","last16Data", "last16");	
			quarters = wallChart.setLocalData("data/quarters.json","quartersData", "quarters");	
			semis = wallChart.setLocalData("data/semis.json","semisData", "semis");	
			final = wallChart.setLocalData("data/final.json","finalData", "final");	
			//wallChart.getTables(tableData, fixtures);
			//wallChart.getFixtures(tableData, fixtures);
		}
	}
}
/*--------- access team/table data -----------*/
wallChart.getJson = function(file){
		var xhr = new XMLHttpRequest();
		
		xhr.open("GET", file, false);
		xhr.setRequestHeader("Content-Type", "application/json");
		
		xhr.onreadystatechange = function(){
		
			if (xhr.readyState === 4 && xhr.status === 200){
				data = JSON.parse(xhr.responseText);
				return data;
			}
		};
		
		xhr.send(); 
		return false;
	}
	
wallChart.setLocalData = function(filePath, localData, name){
	wallChart.getJson(filePath);
	var holder = JSON.stringify(data);
	localStorage.setItem(localData, holder);
	name = JSON.parse(localStorage[localData]);
	return name;	
	}
	

// ##SORTTABLE## -> Sort table data by points total ---> then by Goal Difference

wallChart.sortTable = function(group){
	var tbl = document.getElementById(group).tBodies[0];
	var holdingArray = [];
	for (i=0;i<4;i++){
		var row = tbl.rows[i];
		var pts = parseInt(row.cells[6].textContent);
		var gd = parseInt(row.cells[5].textContent);
		holdingArray.push([row, pts, gd]);
		}
	holdingArray.sort(function(a, b){
		if (a[1] === b[1]){
			return a[2] < b[2] ? 1 :a[2] > b[2] ? -1 : 0;
			}
		return b[1] - a[1];
		});
	for(var i=0, len=holdingArray.length; i<len; i++){
		tbl.appendChild(holdingArray[i][0]);
	}
	holdingArray = null;
}

/*  Reset Data Warning  */
wallChart.resetWarning = function(){
	var resetBox = document.getElementById('confirmBox');
	resetBox.className = "";
	var buttons = resetBox.getElementsByTagName('button');
	buttons[0].addEventListener('click', function(){
		resetBox.className = "hiddenBox";
		}, false);
	buttons[1].addEventListener('click', function(){
		localStorage.clear();
		window.location.reload();	
		}, false);
}



wallChart.getTables = function(tableData, fixtures){
	var tableContent = "";
	var tables = document.getElementById('outerTableContainer');
	tables.innerHTML = "";
	var Groups = tableData.team2014.group;
	for (var group in Groups){
		if (!Groups.hasOwnProperty(group)){
			continue;
		}else{
			var groupTable = "";
			var newGroup1 = group.slice(0,5);
			var newGroup2 = group.slice(5,6);
			groupTitle = newGroup1+" "+newGroup2;
			
			var innerTable = "";
			innerTable = "<div class='table-responsive' id='"+group+"Table'>"; 
			tables.innerHTML += "<div id='"+group+"Container' class='outerTableContainer col-lg-4 col-md-6 col-sm-12 col-xs-12'><div class='tableContainer col-lg-12 col-md-12 col-sm-12 col-xs-12'>"+innerTable+"</div></div></div>";
			thisGroup = document.getElementById(group+'Table');
			tableContent = "";
			if(!document.getElementById(group+"fixtures")){
				thisTableContainer = document.getElementById(group+"Container");
				newFixtureDiv = document.createElement('div');
				newFixtureDiv.id = group+"fixtures";
				thisTableContainer.appendChild(newFixtureDiv);
			}
			for (var teams in Groups[group]){
				if(!Groups[group].hasOwnProperty(teams)){
					continue;
				}else{ 
					var x = Groups[group][teams];
					tableContent += "<tr><td>"+teams+"</td><td>"+x.p+"</td><td>"+x.w+"</td><td>"+x.l+"</td><td>"+x.d+"</td><td>"+x.gd+"</td><td>"+x.pts+"</td></tr>";
					
					
				}
			}
		}
		groupTable = "<div><h1>"+groupTitle+"</h1>"+groupTable+"</div><table class='table sortable' id='"+group+"'><thead class='headerRow'><td></td><td>P</td><td>W</td><td>L</td><td>D</td><td>GD</td><td>Pts</td></thead><tbody>"+tableContent+"</tbody></table>";
		thisGroup.innerHTML = groupTable;
		wallChart.sortTable(group);
		
		// ## Count number of group games completed and if all games played, update knockout fixture table
		
		//if (plydCount === 12){
		//	wallChart.updateKnockoutTeams(group);
		//}
	//wallChart.last16Games();
	//wallChart.quarterGames();
	//wallChart.semiGames();
	//wallChart.finalGames();
	}
}


wallChart.updateThisTable = function(group){
			var x = tableData.team2014.group[group];
			var thisTable = document.getElementById(group+'Table');
			thisTable.innerHTML = "" ;
			var tableContent = "";
			var plydCount = 0;
			for (var teams in x){
				if(!x.hasOwnProperty(teams)){
					continue;
				}else{ 
					var groupTable = "";
					var newGroup1 = group.slice(0,5);
					var newGroup2 = group.slice(5,6);
					groupTitle = newGroup1+" "+newGroup2;
					var y = tableData.team2014.group[group][teams];
					tableContent += "<tr><td>"+teams+"</td><td>"+y.p+"</td><td>"+y.w+"</td><td>"+y.l+"</td><td>"+y.d+"</td><td>"+y.gd+"</td><td>"+y.pts+"</td></tr>";
					//thisTable.tBodies[0].innerHTML = tableContent ;
					//thisTable.innerHTML += groupTable;
					plydCount += parseInt(y.p);
				}
			}
			groupTable = "<div><h1>"+groupTitle+"</h1>"+groupTable+"</div><table class='table sortable' id='"+group+"'><thead class='headerRow'><td></td><td>P</td><td>W</td><td>L</td><td>D</td><td>GD</td><td>Pts</td></thead><tbody>"+tableContent+"</tbody></table>";
			thisTable.innerHTML = groupTable;
			wallChart.sortTable(group);
			if (plydCount === 12){
			wallChart.updateKnockoutTeams(group);
		}
			wallChart.getFixtures(tableData, fixtures); 
		}

wallChart.updateKnockoutTeams = function(group){
	var thisTable = document.getElementById(group);
			var teamFirst = thisTable.rows[1].cells[0].innerHTML;
			var teamSecond = thisTable.rows[2].cells[0].innerHTML;
			var updateKey = function(gamea, gameb, round){
				round[gamea][0].team = teamFirst;
				round[gameb][1].team = teamSecond;
				localStorage.setItem("last16Data", JSON.stringify(last16));
				}
			if (group == "GroupA"){
				var gamea = "game1";
				var gameb = "game5";
				var x = last16[gamea]["Winners Group A"];
				updateKey(gamea, gameb, last16);
			}else if (group == "GroupB"){
				var gameb = "game1";
				var gamea = "game5";
				updateKey(gamea, gameb, last16);
			}else if (group == "GroupC"){
				var gamea = "game2";
				var gameb = "game6";
				updateKey(gamea, gameb, last16);
			}else if (group == "GroupD"){
				var gameb = "game2";
				var gamea = "game6";
				updateKey(gamea, gameb, last16);
			}else if (group == "GroupE"){
				var gamea = "game3";
				var gameb = "game7";
				updateKey(gamea, gameb, last16);
			}else if (group == "GroupF"){
				var gameb = "game3";
				var gamea = "game7";
				updateKey(gamea, gameb, last16);
			}else if (group == "GroupG"){
				var gamea = "game4";
				var gameb = "game8";
				updateKey(gamea, gameb, last16);
			}else if(group == "GroupH"){
				var gameb = "game4";
				var gamea = "game8";
				updateKey(gamea, gameb, last16);
			}else{
				return;
				}
}

// ##GETFIXTURES## Read fixture data and write HTML fixtures and scores(if saved in local storage)

wallChart.getFixtures = function(tableData, fixtures){
	var Groups = fixtures.fixtures2014;
	for (var group in Groups){
		if (!Groups.hasOwnProperty(group)){
			continue;
		}else{
			var fixturesContainer = document.getElementById(group+'fixtures');
			fixturesContainer.innerHTML = "";
			var fixturesContent = "";
			for (var games in Groups[group]){
				if(!Groups[group].hasOwnProperty(games)){
					continue;
				}else{
					var x = Groups[group][games];
					var homeTeam = x[0].team;
					var awayTeam = x[1].team; 
					var scoresData = JSON.parse(localStorage['fixtureData']);
					var scoresA = scoresData['fixtures2014'][group][games][0].score;
					var scoresB = scoresData['fixtures2014'][group][games][1].score;
					if (scoresA != null && scoresB != null){
						fixturesContent += "<form id='"+group+games+"'><div class='row'><label class='col-lg-4 col-md-4 col-sm-4 col-xs-4'>"+homeTeam+"</label><input class='col-lg-1 col-md-1 col-sm-1 col-xs-1' \
						type='text' id='"+group+games+"home' name='home' value='"+scoresData['fixtures2014'][group][games][0].score+"' disabled onkeyup='wallChart.submitForm(document.getElementById(\""+group+games+"\").home.value, document.getElementById(\""+group+games+"\").away.value, \
						\""+group+"\", \""+homeTeam+"\", \""+awayTeam+"\", \""+games+"\");'/><span class='v'> v </span><input class='col-lg-1 col-md-1 col-sm-1 col-xs-1' \
						type='text' id='"+group+games+"away' name='away' value='"+scoresData['fixtures2014'][group][games][1].score+"' disabled onkeyup='wallChart.submitForm(document.getElementById(\""+group+games+"\").home.value, document.getElementById(\""+group+games+"\").away.value, \
						\""+group+"\", \""+homeTeam+"\", \""+awayTeam+"\", \""+games+"\");'/><label class='col-lg-4 col-md-4 col-sm-4 col-xs-4'>"+awayTeam+"</label><span id='"+group+games+"reset' class='close' onclick='wallChart.reset(\""+group+games+"\", \""+group+games+"\", \""+group+"\", \""+homeTeam+"\", \""+awayTeam+"\", \""+games+"\");'>x</span></div></form><div class='clearfix'></div>";
						
					}else{
						fixturesContent += "<form id='"+group+games+"'><div class='row'><label class='col-lg-4 col-md-4 col-sm-4 col-xs-4'>"+homeTeam+"</label><input class='col-lg-1 col-md-1 col-sm-1 col-xs-1' \
						type='text' name='home' value='' onkeyup='wallChart.submitForm(document.getElementById(\""+group+games+"\").home.value, document.getElementById(\""+group+games+"\").away.value, \
						\""+group+"\", \""+homeTeam+"\", \""+awayTeam+"\", \""+games+"\");wallChart.disable(\""+group+games+"\");'/><span class='v'> v </span><input class='col-lg-1 col-md-1 col-sm-1 col-xs-1' \
					   type='text' name='away' value='' onkeyup='wallChart.submitForm(document.getElementById(\""+group+games+"\").home.value, document.getElementById(\""+group+games+"\").away.value, \
						\""+group+"\", \""+homeTeam+"\", \""+awayTeam+"\", \""+games+"\");wallChart.disable(\""+group+games+"\");'/><label class='col-lg-4 col-md-4 col-sm-4 col-xs-4'>"+awayTeam+"</label></div></form><div class='clearfix'></div>";
						}
				}
			}
		}
		fixturesContainer.innerHTML += "<div class='fixtureContainer col-lg-12 col-md-12 col-sm-12 col-xs-12'><div id='fixtures"+group+"'><div>"+fixturesContent+"</div>";
		
	}
}

// ##SUBMITFORM## -> Submit completed score and update related table and local storage data

wallChart.submitForm = function(scorea, scoreb, thisGroup, teama, teamb, game){
	if (isNaN(scorea) || isNaN(scoreb)){
			alert('Input Must be a Number!');
	}else{
		if (scorea!="" && scoreb!=""){
			if (isNaN(scorea) || isNaN(scoreb)){
				alert('Input Must be a Number!');
				}
			else{
				var x = tableData.team2014.group;
				for (var group in x){
					var thisGroup = group;
					if (!x.hasOwnProperty(group)){
						console.log('No property group');
						}
					else if (group == thisGroup){
							for (var teams in x[group]){
								var thisTeam = teams;
								if (!x[group].hasOwnProperty(teams)){
									continue;
									
								}else{
									if (teams == teama){
										var played = parseInt(x[group][teams].p);
										played += 1;
										x[group][teams].p = played.toString();
										var goalsFor = parseInt(x[group][teams].gf);
										goalsFor += parseInt(scorea);
										x[group][teams].gf = goalsFor.toString();
										var goalsAgainst = parseInt(x[group][teams].ga);
										goalsAgainst += parseInt(scoreb);
										var goalDifference = goalsFor - goalsAgainst;
										x[group][teams].gd = goalDifference.toString();
										x[group][teams].ga = goalsAgainst.toString();
										
										var fixObj = JSON.parse(localStorage['fixtureData']);
										fixObj.fixtures2014[thisGroup][game][0].score = scorea;
										var fixtureData = JSON.stringify(fixObj);
										localStorage.setItem('fixtureData', fixtureData);
										
										
										if (scorea < scoreb){
											var lost = parseInt(x[group][teams].l);
											lost += 1;
											x[group][teams].l = lost.toString();
											var jsonLocalData = JSON.stringify(tableData);
											localStorage.setItem('tableData', jsonLocalData);
											wallChart.updateThisTable(group);
											//wallChart.getTables(tableData, fixtures);
											//wallChart.getFixtures(tableData, fixtures);
										}else if(scorea == scoreb){
											var drawn = parseInt(x[group][teams].d);
											drawn += 1;
											x[group][teams].d = drawn.toString();
											var points = parseInt(x[group][teams].pts);
											points += 1;
											x[group][teams].pts = points.toString();
											var jsonLocalData = JSON.stringify(tableData);
											localStorage.setItem('tableData', jsonLocalData);
											wallChart.updateThisTable(group);
											//wallChart.getTables(tableData, fixtures);
											//wallChart.getFixtures(tableData, fixtures);
										}else{
											var won = parseInt(x[group][teams].w);
											won += 1;
											x[group][teams].w = won.toString();
											var points = parseInt(x[group][teams].pts);
											points += 3;
											x[group][teams].pts = points.toString();
											var jsonLocalData = JSON.stringify(tableData);
											localStorage.setItem('tableData', jsonLocalData);
											wallChart.updateThisTable(group);
											//wallChart.getTables(tableData, fixtures);
											//wallChart.getFixtures(tableData, fixtures);
											}
									}
									else if (teams == teamb){
										var played = parseInt(x[group][teams].p);
										played += 1;
										x[group][teams].p = played.toString();
										var goalsFor = parseInt(x[group][teams].gf);
										goalsFor += parseInt(scoreb);
										x[group][teams].gf = goalsFor.toString();
										var goalsAgainst = parseInt(x[group][teams].ga);
										goalsAgainst += parseInt(scorea);
										x[group][teams].ga = goalsAgainst.toString();
										var goalDifference = goalsFor - goalsAgainst;
										x[group][teams].gd = goalDifference.toString();
										
										var fixObj = JSON.parse(localStorage['fixtureData']);
										fixObj.fixtures2014[thisGroup][game][1].score = scoreb;
										var fixtureData = JSON.stringify(fixObj);
										localStorage.setItem('fixtureData', fixtureData);
										
										if (scorea > scoreb){
											var lost = parseInt(x[group][teams].l);
											lost += 1;
											x[group][teams].l = lost.toString();
											var jsonLocalData = JSON.stringify(tableData);
											localStorage.setItem('tableData', jsonLocalData);
											wallChart.updateThisTable(group);
											//wallChart.getTables(tableData, fixtures);
											//wallChart.getFixtures(tableData, fixtures);
										}else if(scorea == scoreb){
											var drawn = parseInt(x[group][teams].d);
											drawn += 1;
											x[group][teams].d = drawn.toString();
											var points = parseInt(x[group][teams].pts);
											points += 1;
											x[group][teams].pts = points.toString();
											var jsonLocalData = JSON.stringify(tableData);
											localStorage.setItem('tableData', jsonLocalData);
											wallChart.updateThisTable(group);
											//wallChart.getTables(tableData, fixtures);
											//wallChart.getFixtures(tableData, fixtures);
										}else{
											var won = parseInt(x[group][teams].w);
											won += 1;
											x[group][teams].w = won.toString();
											var points = parseInt(x[group][teams].pts);
											points += 3;
											x[group][teams].pts = points.toString();
											var jsonLocalData = JSON.stringify(tableData);
											localStorage.setItem('tableData', jsonLocalData);
											wallChart.updateThisTable(group);
											//wallChart.getTables(tableData, fixtures);
											//wallChart.getFixtures(tableData, fixtures);
											}
									}
								}
							}
						}
					else{
						continue;
						}
					}
				}
		}else{
			return false;
		}
	}
}

// ##DISABLE## -> Add disabled attribute to inputs that have had scores added

wallChart.disable = function(id){
	var inputValue1 = document.getElementById(id).home.value;
	var inputValue2 = document.getElementById(id).away.value;
	if (inputValue1 && inputValue2 && !isNaN(inputValue1) && !isNaN(inputValue2)){
		var input1 = document.getElementById(id).home;
		var input2 = document.getElementById(id).away;
		input1.setAttribute("disabled", "true");
		input2.setAttribute("disabled", "true");
	}
}

// ##RESET## -> Reset Score & undo points related to that score, and update local storage data

wallChart.reset = function(scorea, scoreb, thisGroup, teama, teamb, game){
	var scorea = document.getElementById(scorea).home.value;
	var scoreb = document.getElementById(scoreb).away.value;
	var scorea = parseInt(scorea);
	var scoreb = parseInt(scoreb);
	var x = tableData.team2014.group;
	for (var group in x){
		if (!x.hasOwnProperty(group)){
			console.log('No property group');
			}
		else if (group == thisGroup){
				for (var teams in x[group]){
					var thisTeam = teams;
					if (!x[group].hasOwnProperty(teams)){
						continue;
					}else{
						if (teams == teama){
							var played = parseInt(x[group][teams].p);
							played -= 1;
							x[group][teams].p = played.toString();
							var goalsFor = parseInt(x[group][teams].gf);
							goalsFor -= parseInt(scorea);
							x[group][teams].gf = goalsFor.toString();
							var goalsAgainst = parseInt(x[group][teams].ga);
							goalsAgainst -= parseInt(scoreb);
							var goalDifference = goalsFor - goalsAgainst;
							x[group][teams].gd = goalDifference.toString();
							x[group][teams].ga = goalsAgainst.toString();
							
							var fixObj = JSON.parse(localStorage['fixtureData']);
							fixObj.fixtures2014[thisGroup][game][0].score = null;
							var fixtureData = JSON.stringify(fixObj);
							localStorage.setItem('fixtureData', fixtureData);
							
							
							if (scorea < scoreb){
								var lost = parseInt(x[group][teams].l);
								lost -= 1;
								x[group][teams].l = lost.toString();
								var jsonLocalData = JSON.stringify(tableData);
								localStorage.setItem('tableData', jsonLocalData);
								wallChart.getTables(tableData, fixtures);
								wallChart.getFixtures(tableData, fixtures);
							}else if(scorea == scoreb){
								var drawn = parseInt(x[group][teams].d);
								drawn -= 1;
								x[group][teams].d = drawn.toString();
								var points = parseInt(x[group][teams].pts);
								points -= 1;
								x[group][teams].pts = points.toString();
								var jsonLocalData = JSON.stringify(tableData);
								localStorage.setItem('tableData', jsonLocalData);
								wallChart.getTables(tableData, fixtures);
								wallChart.getFixtures(tableData, fixtures);
							}else{
								var won = parseInt(x[group][teams].w);
								won -= 1;
								x[group][teams].w = won.toString();
								var points = parseInt(x[group][teams].pts);
								points -= 3;
								x[group][teams].pts = points.toString();
								var jsonLocalData = JSON.stringify(tableData);
								localStorage.setItem('tableData', jsonLocalData);
								wallChart.getTables(tableData, fixtures);
								wallChart.getFixtures(tableData, fixtures);
								}
						}
						else if (teams == teamb){
							var played = parseInt(x[group][teams].p);
							played -= 1;
							x[group][teams].p = played.toString();
							var goalsFor = parseInt(x[group][teams].gf);
							goalsFor -= parseInt(scoreb);
							x[group][teams].gf = goalsFor.toString();
							var goalsAgainst = parseInt(x[group][teams].ga);
							goalsAgainst -= parseInt(scorea);
							x[group][teams].ga = goalsAgainst.toString();
							var goalDifference = goalsFor - goalsAgainst;
							x[group][teams].gd = goalDifference.toString();
							
							var fixObj = JSON.parse(localStorage['fixtureData']);
							fixObj.fixtures2014[thisGroup][game][1].score = null;
							var fixtureData = JSON.stringify(fixObj);
							localStorage.setItem('fixtureData', fixtureData);
							
							if (scorea > scoreb){
								var lost = parseInt(x[group][teams].l);
								lost -= 1;
								x[group][teams].l = lost.toString();
								var jsonLocalData = JSON.stringify(tableData);
								localStorage.setItem('tableData', jsonLocalData);
								wallChart.getTables(tableData, fixtures);
								wallChart.getFixtures(tableData, fixtures);
							}else if(scorea == scoreb){
								var drawn = parseInt(x[group][teams].d);
								drawn -= 1;
								x[group][teams].d = drawn.toString();
								var points = parseInt(x[group][teams].pts);
								points -= 1;
								x[group][teams].pts = points.toString();
								var jsonLocalData = JSON.stringify(tableData);
								localStorage.setItem('tableData', jsonLocalData);
								wallChart.getTables(tableData, fixtures);
								wallChart.getFixtures(tableData, fixtures);
							}else{
								var won = parseInt(x[group][teams].w);
								won -= 1;
								x[group][teams].w = won.toString();
								var points = parseInt(x[group][teams].pts);
								points -= 3;
								x[group][teams].pts = points.toString();
								var jsonLocalData = JSON.stringify(tableData);
								localStorage.setItem('tableData', jsonLocalData);
								wallChart.getTables(tableData, fixtures);
								wallChart.getFixtures(tableData, fixtures);
							}
					}
				}
			}
		}
	}				
}

wallChart.last16Games = function(){
	var knockoutHolderDiv = document.getElementById('lastSixteenContainer');
	knockoutHolderDiv.innerHTML = "";
	for(var games in last16){
		if (!last16.hasOwnProperty(games)){
			continue;
		}else{
			if(games === "game1" || games === "game2"){
				var quarters = "quarter1";
			}else if(games === "game3" || games === "game4"){
				var quarters = "quarter2";
			}else if(games === "game5" || games === "game6"){
				var quarters = "quarter3";
			}else if(games === "game7" || games === "game8"){
				var quarters = "quarter4";
			}else{
				console.log("error");
				}
			if (last16[games][0].score!="" && last16[games][1].score!=""){
				var scorea = last16[games][0].score;
				var scoreb = last16[games][1].score;
				var bool = "disabled"
			}else{
				var scorea = "";
				var scoreb = "";
				var bool = ""				
				}
			knockoutHolderDiv.innerHTML += '<div class="formContainer col-lg-4 col-lg-offset-1 col-md-6 col-sm-12 col-xs-12"><form id="'+games+'"><h4>'+games+'</h4><div class="col-lg-10 col-md-10 col-sm-10 col-xs-11"><label id="'+games+'Team1" class="col-lg-10 col-md-10 col-sm-10 col-xs-10">'+last16[games][0].team+'</label><input name="home" type="text" '+bool+' value=\''+scorea+'\' class="" onkeyup="wallChart.knockout(\''+games+'\', \''+quarters+'\');" /><span class="v col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 col-xs-10 col-xs-offset-2">v</span><label id="'+games+'Team2" class="col-lg-10 col-md-10 col-sm-10 col-xs-10">'+last16[games][1].team+'</label><input name="away" type="text" '+bool+' value=\''+scoreb+'\' class="" onkeyup="wallChart.knockout(\''+games+'\', \''+quarters+'\');" /></div><div class="clearfix"></div></form></div>'
				
			}
			
		}
	
	}
wallChart.quarterGames = function(){
	var knockoutHolderDiv = document.getElementById('quartersContainer');
	knockoutHolderDiv.innerHTML = "";
	for(var games in quarters){
		if (!quarters.hasOwnProperty(games)){
			continue;
		}else{
			if(games === "quarter1" || games === "quarter2"){
				var semis = "semi1";
			}else if(games == "quarter3" || games === "quarter4"){
				var semis = "semi2";
			}else {
				console.log("error");
				}
			if (quarters[games][0].score!="" && quarters[games][1].score!=""){
				var scorea = quarters[games][0].score;
				var scoreb = quarters[games][1].score;
				var bool = "disabled"
			}else{
				var scorea = "";
				var scoreb = "";
				var bool = ""				
				}	
			knockoutHolderDiv.innerHTML += '<div class="formContainer  col-lg-4 col-lg-offset-1 col-md-6 col-sm-12 col-xs-12"><form id="'+games+'"><h4>'+games+'</h4><div class="col-lg-10 col-md-10 col-sm-10 col-xs-11"><label id="'+games+'Team1" class="col-lg-10 col-md-10 col-sm-10 col-xs-10">'+quarters[games][0].team+'</label> <input name="home" type="text" '+bool+' value=\''+scorea+'\' onkeyup="wallChart.knockout(\''+games+'\', \''+semis+'\');" class="col-lg-1 col-md-1 col-sm-1 col-xs-1" /><span class="v col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 col-xs-10 col-xs-offset-2">v</span><label id="'+games+'Team2" class="col-lg-10 col-md-10 col-sm-10 col-xs-10">'+quarters[games][1].team+'</label> <input name="away" type="text" '+bool+' value=\''+scoreb+'\' onkeyup="wallChart.knockout(\''+games+'\', \''+semis+'\');" class="col-lg-1 col-md-1 col-sm-1 col-xs-1" /></div><div class="clearfix"></div></form></div>'
			}
		
		}
	
	}

wallChart.semiGames = function(){
	var knockoutHolderDiv = document.getElementById('semisContainer');
	knockoutHolderDiv.innerHTML = "";
	for(var games in semis){
		if (!semis.hasOwnProperty(games)){
			continue;
		}else{
			var final = "final1";
			if (semis[games][0].score!="" && semis[games][1].score!=""){
				var scorea = semis[games][0].score;
				var scoreb = semis[games][1].score;
				var bool = "disabled"
			}else{
				var scorea = "";
				var scoreb = "";
				var bool = ""				
				}
			knockoutHolderDiv.innerHTML += '<div class="formContainer  col-lg-4 col-lg-offset-1 col-md-6 col-sm-12 col-xs-12"><form id="'+games+'"><h4>'+games+'</h4><div class="col-lg-11 col-md-11 col-sm-11 col-xs-11"><label id="'+games+'Team1" class="col-lg-10 col-md-10 col-sm-10 col-xs-10">'+semis[games][0].team+'</label><input type="text" name="home" id="'+games+'Team1" '+bool+' value="'+scorea+'" onkeyup="wallChart.knockout(\''+games+'\', \''+final+'\');" class="col-lg-1 col-md-1 col-sm-1 col-xs-1" /><span class="v col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 col-xs-10 col-xs-offset-2">v</span><label id="'+games+'Team2" class="col-lg-10 col-md-10 col-sm-10 col-xs-10">'+semis[games][1].team+'</label><input type="text" name="away" '+bool+' value="'+scoreb+'" onkeyup="wallChart.knockout(\''+games+'\', \''+final+'\');" class="col-lg-1 col-md-1 col-sm-1 col-xs-1" /></div><div class="clearfix"></div></form></div>'
			}
		
		}
	
	}
wallChart.finalGames = function(){
	var knockoutHolderDiv = document.getElementById('finalContainer');
	knockoutHolderDiv.innerHTML = "";
	for(var games in final){
		if (!final.hasOwnProperty(games)){
			continue;
		}else{
			if (final[games][0].score!="" && final[games][1].score!=""){
				var scorea = final[games][0].score;
				var scoreb = final[games][1].score;
				var bool = "disabled"
			}else{
				var scorea = "";
				var scoreb = "";
				var bool = ""				
				}
			knockoutHolderDiv.innerHTML += '<div class="formContainer col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-12 col-xs-12"><form id="'+games+'" ><h4>'+final[games][0].title+'</h4><div class="col-lg-8 col-lg-offset-2 col-md-8 col-offset-2 col-sm-8 col-sm-offset-2 col-xs-12"><label id="'+games+'Team1" class="col-lg-10 col-md-10 col-sm-10 col-xs-10">'+final[games][0].team+'</label><input type="text" name="home" id="'+games+'Team1" '+bool+' value="'+scorea+'" onkeyup="wallChart.finals(\''+games+'\');" class="col-lg-1 col-md-1 col-sm-1 col-xs-1" /><span class="v col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 col-xs-10 col-xs-offset-2">v</span><label id="'+games+'Team2" class="col-lg-10 col-md-10 col-sm-10 col-xs-10">'+final[games][1].team+'</label><input type="text" name="away" '+bool+' value="'+scoreb+'" onkeyup="wallChart.finals(\''+games+'\');" class="col-lg-1 col-md-1 col-sm-1 col-xs-1" /></div><div class="clearfix"></div><div id="'+games+'stadiumImage"></div></form></div>'
			}
		
		}
	
	}

wallChart.updateRound = function(game, games, team, nextRound, nextRoundString){
	var localData = nextRoundString+"Data";
	if (game === "game1" || game === "game3" || game === "game5" || game === "game7" || game === "quarter1" || game === "quarter3" || game === "semi1"){
		nextRound[games][0].team = team;
	}else if(game === "game2" || game === "game4" || game === "game6" || game === "game8" || game === "quarter2" || game === "quarter4" || game === "semi2"){
		nextRound[games][1].team = team;
		}
	else{
		console.log("Error at line 593");
		}
	localStorage.setItem(localData, JSON.stringify(nextRound));
}

wallChart.updateKnockout = function(teama, teamb, round, game, roundName){
	round[game][0].score = document.getElementById(game).home.value;
	round[game][1].score = document.getElementById(game).away.value;
	localStorage.setItem(roundName+"Data", JSON.stringify(round));
	}

wallChart.knockout = function(game, nextGame){
	var form = document.getElementById(game);
	var nextform = document.getElementById(nextGame);
	var teama = document.getElementById(game+"Team1").innerHTML;
	var teamb = document.getElementById(game+"Team2").innerHTML;
	var winner = "";
	if(game === "game1" || game === "game3" || game === "game5" || game === "game7" || game === "game2" || game === "game4" || game === "game6" || game === "game8"){
		var round = last16;
		var roundName = "last16";
		var nextRound = quarters;
		var nextRoundString = "quarters";
	}else if (game === "quarter1" || game === "quarter2" || game === "quarter3" || game === "quarter4"){
		var round = quarters;
		var roundName = "quarters";
		var nextRound = semis;
		var nextRoundString = "semis";
	}else if (game === "semi1" || game === "semi2"){
		var round = semis;
		var roundName = "semis";
		var nextRound = final;
		var nextRoundString = "final";
	}else{
		console.log("error in knockout function");
		}
	if (form.home.value && form.away.value){
		if (isNaN(form.home.value) || isNaN(form.away.value)){
			alert('Input Must be a Number!');
			return;
		}else{
			if (parseInt(form.home.value) > parseInt(form.away.value)){
				if (game === "game1" || game === "game3" || game === "game5" || game === "game7" || game === "quarter1" || game === "quarter3" || game === "semi1"){
					//document.getElementById(nextGame+"Team1").innerHTML = teama;
					wallChart.updateKnockout(teama, teamb, round, game, roundName);
					wallChart.updateRound(game, nextGame, teama, nextRound, nextRoundString);
					if(game==="semi1"){
						final['final2'][0].team = teamb;
						//document.getElementById("final2Team1").innerHTML = teamb;
						localStorage.setItem("finalData", JSON.stringify(final));
						}
					wallChart.disable(game);
				}else{
					//document.getElementById(nextGame+"Team2").innerHTML = teama;
					wallChart.updateKnockout(teama, teamb, round, game, roundName);
					wallChart.updateRound(game, nextGame, teama, nextRound, nextRoundString);
					if(game==="semi2"){
						final['final2'][1].team = teamb;
						//document.getElementById("final2Team2").innerHTML = teamb;
						localStorage.setItem("finalData", JSON.stringify(final));
						}
					wallChart.disable(game);
					}
			}
			else if (parseInt(form.home.value) < parseInt(form.away.value)){
				if(game === "game1" || game === "game3" || game === "game5" || game === "game7" || game === "quarter1" || game === "quarter3" || game === "semi1"){
					//document.getElementById(nextGame+"Team1").innerHTML = teamb;
					wallChart.updateKnockout(teama, teamb, round, game, roundName);
					wallChart.updateRound(game, nextGame, teamb, nextRound, nextRoundString);
					if(game==="semi1"){
						final['final2'][0].team = teama;
						//document.getElementById("final2Team1").innerHTML = teama;
						localStorage.setItem("finalData", JSON.stringify(final));
						}
					wallChart.disable(game);
				}else{
					//document.getElementById(nextGame+"Team2").innerHTML = teamb;
					wallChart.updateKnockout(teama, teamb, round, game, roundName);
					wallChart.updateRound(game, nextGame, teamb, nextRound, nextRoundString);
					if(game==="semi2"){
						final['final2'][0].team = teama;
						//document.getElementById("final2Team2").innerHTML = teama;
						localStorage.setItem("finalData", JSON.stringify(final));
						}
					wallChart.disable(game);
					}
			}
			else{
				alert("Did the game go to Extra Time and Penalties?\n\nPlease include goals scored during extra time or penalties to proceed.");
				form.home.value = "";
				form.away.value = "";
				}
		}
	}
	
}

wallChart.finals = function(games){
	if (games !== 'final1'){
		console.log(games);
		final[games][0].score = document.getElementById(games).home.value;
		final[games][1].score = document.getElementById(games).away.value;
		localStorage.setItem("finalData", JSON.stringify(final));
		if (final[games][0].score !== "" && final[games][1].score !== ""){
			wallChart.disable(games);
			}
		else{
			return;
			}
	}else{
		final[games][0].score = document.getElementById(games).home.value;
		final[games][1].score = document.getElementById(games).away.value;
		localStorage.setItem("finalData", JSON.stringify(final));
		if (final[games][0].score !== "" && final[games][1].score !== ""){
			wallChart.ajaxCall('ajax/winner.html', 'winner', 'winner');
		}
	}
	//wallChart.disable(games);
}

wallChart.winner = function(){
	if (final.final1[0].score !== "" && final.final1[1].score !== ""){
		if (parseInt(final.final1[0].score) > parseInt(final.final1[1].score)){
			winner = final.final1[0].team;
		}else{
			winner = final.final1[1].team;
		}
	document.getElementById('champions').innerHTML = "<h1>Congratulations "+winner+"!</h1><br /><h2>"+winner+" are the 2014 World Cup Champions</h2>";
	}
}

wallChart.navActive = function(id){
	var items = document.getElementsByTagName('a');
	for(var i = 0; i<items.length-1; i++){
		if (items[i].className == "active"){
			items[i].className = "";
			switch(id){
				case 'groups':
					document.getElementById('groups').className = 'active';
					break;
				case 'last16':
					document.getElementById('last16').className = 'active';
					break;
				case 'quarters':
					document.getElementById('quarters').className = 'active';
					break;
				case 'semis':
					document.getElementById('semis').className = 'active';
					break;
				case 'finals':
					document.getElementById('finals').className = 'active';
					break;
				default:
					document.getElementById('home').className = 'active';
				}
			}
		}
	}

/* Toggle Mobile Menu ## */


wallChart.toggleMenu = function(){
		var menuBtn = document.getElementById('menuButton');
		var menu = document.getElementById('sidebarLeft');
		var groups = document.getElementById('groups');
		var content = document.getElementById('content');
		if (menu.className === "hidden col-lg-2 col-md-2"){
			menu.className = "col-lg-2 col-md-2";
			content.className = "col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 fixed";
			menuBtn.innerHTML = "<img src='images/back-arrow-left.png' />";
		}else if(menu.className === "col-lg-2 col-md-2"){
			menu.className = "hidden col-lg-2 col-md-2";
			content.className = "col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2";
			menuBtn.innerHTML = "<img src='images/navicon.png' />";
		}else{
			return;
			}
		/*menu.addEventListener("click", function(){
			if(menu.className === "col-lg-2 col-md-2"){
				menu.className = "hidden col-lg-2 col-md-2";
				}
			}, false);*/
		}

wallChart.menuEvents = function(){
	var nav = document.getElementById('nav-container');
	var menu = document.getElementById('sidebarLeft');
	var anchors = nav.getElementsByTagName('a');
	var menuBtn = document.getElementById('menuButton');
	var content = document.getElementById('content');
	for(var i = 0;i<anchors.length; i++){
		anchors[i].addEventListener('click', function(){
			var thisLink = this;
			if(menu.className === "col-lg-2 col-md-2"){
				menu.className = "hidden col-lg-2 col-md-2";
				content.className = "col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2";
				menuBtn.innerHTML = "<img src='images/navicon.png' />";
				}
			document.getElementById('ajaxContainer').innerHTML = "<div id='loadingSpinner' class='text-center'><img src='images/loading.gif' /></div>";
			setTimeout(function(){
				switch(thisLink.id){
					case "groups":
						wallChart.ajaxCall('ajax/tables.html', 'outerTableContainer', 'groups');
						break;
					case "last16":	
						wallChart.ajaxCall('ajax/last16.html', 'lastSixteenContainer', 'last16');
						break;
					case "quarters":
						wallChart.ajaxCall('ajax/quarters.html', 'quartersContainer', 'quarters');
						break;
					case "semis":
						wallChart.ajaxCall('ajax/semis.html', 'semisContainer', 'semis');
						break;
					case "finals":
						wallChart.ajaxCall('ajax/finals.html', 'finalContainer', 'finals');
						break;
					default:
						wallChart.ajaxCall('ajax/home.html', 'outerTableContainer', 'home');	
				}}, 1000);
		});
		}
	}
	
wallChart.homepageMenuEvents = function(){
	var nav = document.getElementById('ajaxContainer');		
	var anchors = nav.getElementsByTagName('a');
	for(var i = 0;i<anchors.length; i++){
		anchors[i].addEventListener('click', function(){
			var thisLink = this;
			document.getElementById('ajaxContainer').innerHTML = "<div id='loadingSpinner' class='text-center'><img src='images/loading.gif' /></div>";
			setTimeout(function(){
				switch(thisLink.id){
					case "homepageGroups":
						wallChart.ajaxCall('ajax/tables.html', 'outerTableContainer', 'groups');
						break;
					case "homepageLast16":	
						wallChart.ajaxCall('ajax/last16.html', 'lastSixteenContainer', 'last16');
						break;
					case "homepageQuarters":
						wallChart.ajaxCall('ajax/quarters.html', 'quartersContainer', 'quarters');
						break;
					case "homepageSemis":
						wallChart.ajaxCall('ajax/semis.html', 'semisContainer', 'semis');
						break;
					default:
						wallChart.ajaxCall('ajax/home.html', 'outerTableContainer', 'home');	
				}}, 1000);
		});
		}
	}
	
wallChart.ajaxCall = function(file, id, round){
	var htmlxhr = new XMLHttpRequest();	
	htmlxhr.open("GET", file, true);
	htmlxhr.setRequestHeader("Content-Type", "application/html");
	
	htmlxhr.onreadystatechange = function(){
		if (htmlxhr.readyState === 4 && htmlxhr.status === 200){
			document.getElementById('ajaxContainer').innerHTML = htmlxhr.responseText;
			switch (round){
				case 'groups':
					wallChart.getTables(tableData, fixtures);
					wallChart.getFixtures(tableData, fixtures);
					wallChart.navActive('groups');
					break;
				case 'last16':
					wallChart.last16Games();
					wallChart.navActive('last16');
					break;
				case "quarters":
					wallChart.quarterGames();
					wallChart.navActive('quarters');
					break;
				case "semis":
					wallChart.semiGames();
					wallChart.navActive('semis');
					break;
				case "finals":
					wallChart.finalGames();
					wallChart.navActive('finals');
					break;
				case "winner":
					document.getElementById('ajaxContainer').innerHTML = htmlxhr.responseText;
					wallChart.winner();
					break;
				default:
					document.getElementById('ajaxContainer').innerHTML = htmlxhr.responseText;
					wallChart.navActive('home');			
				}
		}else{
			document.getElementById('ajaxContainer').innerHTML = "<div>Sorry, there seems to have been a problem retreiving the data. Please try again.</div>";
			}
	};
	
	htmlxhr.send();
	return false;
	}
wallChart.menuEvents();
wallChart.homepageMenuEvents();
