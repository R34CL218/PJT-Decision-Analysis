////////////////////////////////////////////////////////////////////////////////////////////////////////
///			javascript Function for k_calculus
////////////////////////////////////////////////////////////////////////////////////////////////////////




function number_attributes_checked()
{
	var asses_session = JSON.parse(localStorage.getItem("asses_session"));
	var counter=0;
	for (var i=0; i < asses_session.attributes.length; i++){
		if(asses_session.attributes[i].checked)
			counter++;
	}

	return counter;
}

function update_method_button(type)
{
	//we modify the propriety
	var asses_session = JSON.parse(localStorage.getItem("asses_session"));
	for(var i=0; i<asses_session.k_calculus.length; i++)
	{

		if(asses_session.k_calculus[i].method==type)
		{
			//we change also the look of the button of the current page
			//we pass from gray to blue (default to primary)
			$("#button_"+type).removeClass('btn-default');
			$("#button_"+type).addClass('btn-primary');

			asses_session.k_calculus[i].active=true;
		}
		else
		{
			//we pass from blue to gray
			$("#button_"+asses_session.k_calculus[i].method).removeClass('btn-primary');
			$("#button_"+asses_session.k_calculus[i].method).addClass('btn-default');
			asses_session.k_calculus[i].active=false;
		}
	}

	//we update the assess_session storage
	localStorage.setItem("asses_session", JSON.stringify(asses_session));


}




///  ACTION FROM BUTTON UPDATE
$(function() {
	$("#not_enough_attributes").hide();

	var counter = number_attributes_checked();
	if (counter < 2) {
		$("#page-content").hide();
		$("#not_enough_attributes").show();
	};

	$("#update").click(function () {
		//we delete the general utility function
		var asses_session = JSON.parse(localStorage.getItem("asses_session"));
		asses_session.k_calculus[0].GU=null;
		asses_session.k_calculus[1].GU=null;
		//we update the assess_session storage
		localStorage.setItem("asses_session", JSON.stringify(asses_session));

		//we erase the table
		$('#table_attributes').html("");

		create_multiplicative_k();
		create_multilinear_k();
		//we show it in
		update_method_button("multiplicative");
		update_k_list(0);
		show_list();
		ki_calculated();
		$("#update_box").hide("slow");
	});

	$("#update_box").ready(function () {
		$("#update_box").hide();
		var NAttri = number_attributes_checked();
		var asses_session = JSON.parse(localStorage.getItem("asses_session"));
		var NK = asses_session.k_calculus[0].k.length;
		if (NAttri != NK)//If we have different attribute number used and attribute numbe active we show the update box
		{
			$("#update_box").show("slow");
			$("#update_attributes_number").html(NAttri);
			if(NAttri>1)
			{
				$("#update_attributes_plurial").html("attributes are activated");
			}
			else
				$("#update_attributes_plurial").html("attribute is activated");

			$("#update_k_number").html(NK);
			if(NK>1)
			{
				$("#update_k_number_plurial").html("are");
			}
			else
			{
				$("#update_k_number_plurial").html("is");
			}

		}

	});

///  ACTION FROM BUTTON MULTIPLICATIVE
	$("#button_multiplicative").click(function () {
		//update the active methode for k_kalculus
		update_method_button("multiplicative");
		update_k_list(0);
		show_list();
		$('#table_attributes').html("");
		ki_calculated();
	});
});

function create_multiplicative_k()
{
	var asses_session = JSON.parse(localStorage.getItem("asses_session"));
	asses_session.k_calculus[0].k=[];
	asses_session.k_calculus[0].GK=null;
	var counter=1;
	//first we delete the array of k for multiplicative
	for (var i=0; i < asses_session.attributes.length; i++){
		if(asses_session.attributes[i].checked)
		{
			asses_session.k_calculus[0].k.push({"ID":counter, "ID_attribute":i, "attribute":asses_session.attributes[i].name, "value":null});
			counter++;
		}
	}
	//we update the assess_session storage
	localStorage.setItem("asses_session", JSON.stringify(asses_session));
}



///  ACTION FROM BUTTON MULTILINEAR
$(function() {
	$("#button_multilinear").click(function () {
		//update the active methode for k_kalculus
		update_method_button("multilinear");
		update_k_list(1);
		show_list();
		$('#table_attributes').html("");
		ki_calculated();

	});
});

function generer_list_lvl_0(n)
{
	var maList=[];
	for(var l=1; l<=n; l++)
		maList.push([l]);
	return maList;
}

function generer_list_1(i,n)
{
	var maList=[];
	for(var l=i; l<=n; l++)
		maList.push(l);
	return maList;
}

function generer_list(list_inf, n, lvl)
{
	if(lvl>=n)
		return [];

	var nouvelle_list = [];
	for(var i=0; i<list_inf.length; i++)
	{
		var list_1=generer_list_1(list_inf[i][list_inf[i].length-1]+1,n);
		for(var l=0; l<list_1.length; l++)
		{
			nouvelle_list.push(list_inf[i].concat(list_1[l]));
		}
		//nouvelle_list.push(new Array(list_inf[i][list_inf[i].length-1],));
	}

	return list_inf.concat(generer_list(nouvelle_list, n, lvl+1));
}


function create_multilinear_k()
{
	var asses_session = JSON.parse(localStorage.getItem("asses_session"));
	asses_session.k_calculus[1].k=[];
	asses_session.k_calculus[1].GK=null;

	var checkedAttributeList=[];
	//first we delete the array of k for multiplicative
	for (var i=0; i < asses_session.attributes.length; i++){
		if(asses_session.attributes[i].checked)
			checkedAttributeList.push(i);
	}

	var maListeCombinaison=generer_list(generer_list_lvl_0(checkedAttributeList.length),checkedAttributeList.length, 0);


	for (var i=0; i < maListeCombinaison.length; i++){
		var id_attribute=[];
		var attribute=[];
		for(var j=0; j<maListeCombinaison[i].length; j++)
		{
			id_attribute.push(checkedAttributeList[maListeCombinaison[i][j]-1]);
			attribute.push(asses_session.attributes[checkedAttributeList[maListeCombinaison[i][j]-1]].name);
		}
		asses_session.k_calculus[1].k.push({"ID":maListeCombinaison[i].join(), "ID_attribute":id_attribute, "attribute":attribute, "value":null});
	}

	//we update the assess_session storage
	localStorage.setItem("asses_session", JSON.stringify(asses_session));
}




//// COMMUN FUNCTION FOR THE 2 METHODS
function update_k_list(number)
{
	//we delete the entire table
	$('#table_k_attributes').html("");
	var asses_session = JSON.parse(localStorage.getItem("asses_session"));
	var ma_list=asses_session.k_calculus[number].k;

	for(var i=0; i<ma_list.length; i++)
	{
		var text = '<tr id="line'+i+'"><td>K<sub>' + String(ma_list[i].ID).replace(/,/g, '') + '</sub></td>';
			text += '<td> '+ JSON.stringify(ma_list[i].attribute).replace(/"/g, ' ').replace("[", '').replace("]", '').replace(/,/g, '|'); + '</td>';
			if(ma_list[i].value==null)
				if(number==1 && i==ma_list.length-1) //In the multilinear case and the last k
				{
					text += '<td id="k_value_' + i + '"><button type="button" class="btn btn-default btn-xs" id="k_answer_' + i + '">Calculate</button></td>';
				}
				else {
					text += '<td id="k_value_' + i + '"><button type="button" class="btn btn-default btn-xs" id="k_answer_' + i + '">Answer</button></td>';
				}
			else
				text += '<td>'+ ma_list[i].value +'</td>';

			text+='<td><img id="delete_K'+i+'" src="/static/img/delete.ico" style="width:16px;"/></td></tr>';


			$('#table_k_attributes').append(text);

			if(ma_list[i].value==null)
			{
			(function(_i){
					$('#k_answer_'+_i).click(function(){
						$('#k_answer_'+_i).hide();
						if(number==0)//multiplicative
						k_answer(_i, number);
						else if(number==1)//multilinear
						{
							if (_i == ma_list.length - 1) {
								k_multilinear_calculate_last_one(_i);
							}
							else {
								k_multilinear_answer(_i, 1);
							}
						}
					});
			})(i);
			}

			(function(_i){
					$('#delete_K'+_i).click(function(){
						if(confirm("All dependencies beetween k will be removed!") == false){return};
						asses_session.k_calculus[number].k[_i].value=null;
						asses_session.k_calculus[number].GK=null;

						if(number==1)//in the case we are in multilinear we need to erase dependencies
						{
							var indices=String(asses_session.k_calculus[number].k[_i].ID).split(",");

							for(var l=0; l<asses_session.k_calculus[number].k.length; l++)
							{
								var number_in_it=0;
								for(var m=0; m<indices.length; m++) {
									if (asses_session.k_calculus[number].k[l].ID.indexOf(indices[m]) != -1)
										number_in_it++;
								}
								if(number_in_it==indices.length)//if we have all indices containing into an other one, we delete the parent
								{
									asses_session.k_calculus[number].k[l].value = null;
								}
							}

						}

						//we also erase datas of global utility function
						asses_session.k_calculus[get_Active_Method()].GU=null;
						localStorage.setItem("asses_session", JSON.stringify(asses_session));

						// backup local
						localStorage.setItem("asses_session", JSON.stringify(asses_session));
						//refresh the list
						update_k_list(number);
						});
					})(i);

	}
	//then we show the message if the number of ki calculated is sufficient
	ki_calculated();
	if(number==1)
		update_active_button_multilinear();
}

function show_list()
{
	$("#k_list").fadeIn(500);

}

function get_Active_Method()
{
	var asses_session = JSON.parse(localStorage.getItem("asses_session"));
	return ((asses_session.k_calculus[0].active) ? 0 : 1);
}



function update_active_button_multilinear()
{
	var asses_session = JSON.parse(localStorage.getItem("asses_session"));
	var ma_list=asses_session.k_calculus[1].k;
	var last_entered=1;
	for(var i=0; i<ma_list.length; i++)
	{
		if(ma_list[i].value==null)
		{
			last_entered=ma_list[i]["ID_attribute"].length;
			break;
		}
	}


	for(var i=0; i<ma_list.length; i++)
	{
		if(ma_list[i]["ID_attribute"].length<=last_entered)
			$("#k_answer_"+i).prop('disabled', false);
		else
			$("#k_answer_"+i).prop('disabled', true);
	}
}




function k_multilinear_answer(i, type)
{
	var asses_session = JSON.parse(localStorage.getItem("asses_session"));
	var method = 'PE';
	var settings = asses_session.settings;
	var mon_k = asses_session.k_calculus[type].k[i];
	var name = mon_k.attribute;
	for (var j = 0; j < asses_session.attributes.length; j++) {
		if (asses_session.attributes[j].name == name) {
			var mon_attribut = asses_session.attributes[j];
		}
	}
	var mode = mon_attribut.mode;

		// we delete the slect div
		$('#k_calculus_info').hide();


		function random_proba(proba1, proba2) {
			var coin = Math.round(Math.random());
			if (coin == 1) {
				return proba1;
			}
			else {
				return proba2;
			}
		}

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////// PE METHOD ////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		if (method == 'PE') {
			(function(){

				var probability = random_proba(0.25, 0.75);
				var min_interval = 0;
				var max_interval = 1;

				// VARIABLES
				var gain_certain = "";
				var gain_haut = "";
				var gain_bas = "";

				var k=0;
				//first we delete the array of k for multiplicative
				for (var l=0; l < asses_session.attributes.length; l++){
					if(!asses_session.attributes[l].checked)//if not checked we don't put it
					{
						continue;
					}
					
					if(l==mon_k.ID_attribute[k] && asses_session.attributes[l].mode=="normal")//if the attribut is in our list
					{
						gain_certain += asses_session.attributes[l].val_max + ' ' + asses_session.attributes[l].unit+' <br/> ';
						k++;
						gain_haut += asses_session.attributes[l].val_max + ' ' + asses_session.attributes[l].unit+' <br/> ';
						gain_bas += asses_session.attributes[l].val_min + ' ' + asses_session.attributes[l].unit+' <br/> ';
					}
					if(l==mon_k.ID_attribute[k] && asses_session.attributes[l].mode!="normal")
					{
						gain_certain += asses_session.attributes[l].val_min + ' ' + asses_session.attributes[l].unit+' <br/> ';
						gain_haut += asses_session.attributes[l].val_min + ' ' + asses_session.attributes[l].unit+' <br/> ';
						gain_bas += asses_session.attributes[l].val_max + ' ' + asses_session.attributes[l].unit+' <br/> ';
					}
					if(l!=mon_k.ID_attribute[k] && asses_session.attributes[l].mode=="normal")//if the attribut is in our list
					{
						gain_certain += asses_session.attributes[l].val_min + ' ' + asses_session.attributes[l].unit+' <br/> ';
						k++;
						gain_haut += asses_session.attributes[l].val_max + ' ' + asses_session.attributes[l].unit+' <br/> ';
						gain_bas += asses_session.attributes[l].val_min + ' ' + asses_session.attributes[l].unit+' <br/> ';
					}
					if(l!=mon_k.ID_attribute[k] && asses_session.attributes[l].mode!="normal")
					{
						gain_certain += asses_session.attributes[l].val_max + ' ' + asses_session.attributes[l].unit+' <br/> ';
						gain_haut += asses_session.attributes[l].val_min + ' ' + asses_session.attributes[l].unit+' <br/> ';
						gain_bas += asses_session.attributes[l].val_max + ' ' + asses_session.attributes[l].unit+' <br/> ';
					}
				}



				// INTERFACE
				//on cache le bouton
				$("#k_value_"+i).hide();
				$("#k_value_"+i).append("<br/><br/>");
				var arbre_gauche = new Arbre('pe', "#k_value_"+i, settings.display, "PE");

				// SETUP ARBRE GAUCHE
				arbre_gauche.questions_proba_haut = probability;
				arbre_gauche.questions_val_max = gain_haut;
				arbre_gauche.questions_val_min = gain_bas;
				//arbre_gauche.questions_val_max = gain_haut;
				//arbre_gauche.questions_val_min = gain_bas;
				arbre_gauche.questions_val_mean = gain_certain;
				arbre_gauche.display();
				arbre_gauche.update();
				
				
				$("#k_value_"+i).append('<br/><br/><br/><br/><div class=choice style="text-align: center;"><p>Which option do you prefer?</p><button type="button" class="btn btn-default gain">A</button><button type="button" class="btn btn-default lottery">B</button></div><br/><br/><div ></div>');
				//on affiche l'arbre avec un petit effet !

				$("#k_value_"+i).show("fast");

				function treat_answer(data){
					min_interval = data.interval[0];
					max_interval = data.interval[1];
					probability = parseFloat(data.proba).toFixed(2);

					if (max_interval - min_interval <= 0.05){
						arbre_gauche.questions_proba_haut = probability;
						arbre_gauche.update();
						ask_final_value(Math.round((max_interval + min_interval)*100/2)/100);
					}
					else {
						arbre_gauche.questions_proba_haut = probability;
						arbre_gauche.update();
					}
				}

				function ask_final_value(val){
					// we delete the choice div
					$('.choice').hide();
					$("#k_value_"+i).append(
						'<br/><br/><br/><br/><div id= "final_value" style="text-align: center;margin-top:90px;"><br /><br /><p>We are almost done. Please enter the value that makes you indifferent between the two situations above. Your previous choices indicate that it should be between ' + min_interval + ' and ' + max_interval + ' but you are not constrained to that range <br /> '+ min_interval +'\
						 <= <input type="text" class="form-control" id="final_proba" placeholder="Probability" value="'+val+'" style="width: 100px; display: inline-block"> <= '+ max_interval +'</p><button type="button" class="btn btn-default final_validation">Validate</button></div>'
					);

					// when the user validate
					$('.final_validation').click(function(){
						//here we are in multilinearity we must calculate K with dependencies
						var final_proba = parseFloat($('#final_proba').val());
						var indices=String(asses_session.k_calculus[1].k[i].ID).split(",");
						var KASoustraire=[];

						for(var l=0; l<asses_session.k_calculus[1].k.length; l++) {
							var nombreIndice=0;
							for (var m = 0; m < indices.length; m++) {
								if (asses_session.k_calculus[1].k[l].ID.indexOf(indices[m]) != -1 && asses_session.k_calculus[1].k[l].ID_attribute.length<indices.length)
									nombreIndice++;
							}

							if(nombreIndice==asses_session.k_calculus[1].k[l].ID_attribute.length)
								KASoustraire.push(asses_session.k_calculus[1].k[l])
						}
						var final_k=final_proba;
						for(var m=0; m<KASoustraire.length; m++)
						{
							final_k-=KASoustraire[m].value;
						}
						final_k=Math.round(final_k*1000)/1000;

						asses_session.k_calculus[1].k[i].value=final_k; //for multilinear it's 1
						// backup local
						localStorage.setItem("asses_session", JSON.stringify(asses_session));
						// we reload the list
						$("#k_value_"+i).hide( "fast",function(){
							update_k_list(1);
							show_list();
						});

					});
				}

				// HANDLE USERS ACTIONS
				$('.gain').click(function() {
					$.post('ajax', '{"type":"question", "method": "PE", "proba": '+ String(probability) + ', "min_interval": '+ min_interval+ ', "max_interval": '+ max_interval+' ,"choice": "0", "mode": "'+String(mode)+'"}', function(data) {
						treat_answer(data);
					});
				});

				$('.lottery').click(function() {
					$.post('ajax', '{"type":"question","method": "PE", "proba": '+ String(probability) + ', "min_interval": '+ min_interval+ ', "max_interval": '+ max_interval+' ,"choice": "1" , "mode": "'+String(mode)+'"}', function(data) {
						treat_answer(data);
					});
				});
			})()
		}
}

function k_multilinear_calculate_last_one(i)
{
	var asses_session = JSON.parse(localStorage.getItem("asses_session"));
	var indices=String(asses_session.k_calculus[1].k[i].ID).split(",");
	var KASoustraire=[];

	for(var l=0; l<asses_session.k_calculus[1].k.length; l++) {
		var nombreIndice=0;
		for (var m = 0; m < indices.length; m++) {
			if (asses_session.k_calculus[1].k[l].ID.indexOf(indices[m]) != -1 && asses_session.k_calculus[1].k[l].ID_attribute.length<indices.length)
				nombreIndice++;
		}

		if(nombreIndice==asses_session.k_calculus[1].k[l].ID_attribute.length)
			KASoustraire.push(asses_session.k_calculus[1].k[l])
	}

	var final_k=1;
	for(var m=0; m<KASoustraire.length; m++)
	{
		final_k-=KASoustraire[m].value;
	}
	final_k=Math.round(final_k*1000)/1000;

	asses_session.k_calculus[1].k[i].value=final_k; //for multilinear it's 1
	// backup local
	localStorage.setItem("asses_session", JSON.stringify(asses_session));
	// we reload the list
	$("#k_value_"+i).hide( "fast",function(){
		update_k_list(1);
		show_list();
	});
}


function k_answer(i, type)
{

	 	var asses_session = JSON.parse(localStorage.getItem("asses_session"));
		var method = 'PE';
		var settings = asses_session.settings;
		var mon_k = asses_session.k_calculus[type].k[i];
		var name = mon_k.attribute;
		for (var j = 0; j < asses_session.attributes.length; j++) {
			if (asses_session.attributes[j].name == name) {
				var mon_attribut = asses_session.attributes[j];
			}
		}
		var mode = mon_attribut.mode;

		// we delete the slect div
		$('#k_calculus_info').hide();


		function random_proba(proba1, proba2) {
			var coin = Math.round(Math.random());
			if (coin == 1) {
				return proba1;
			}
			else {
				return proba2;
			}
		}

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////// PE METHOD ////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		if (method == 'PE') {
			(function(){

				var probability = 0.75, //random_proba(0.25, 0.75),
					min_interval = 0,
					max_interval = 1;

				// VARIABLES
				var gain_certain = gain_haut = gain_bas = '',
					len = asses_session.k_calculus[type].k.length;

				for (var l=0; l < len; l++) {
					var attrib = asses_session.attributes[asses_session.k_calculus[type].k[l].ID_attribute]
						attrib_favorite = (attrib.mode=="normal"? attrib.val_max : attrib.val_min),
						attrib_other = (attrib.mode=="normal"? attrib.val_min : attrib.val_max);
						
					if (attrib.name == name) {
						gain_certain += String(attrib.name).toUpperCase() + ' : ' + attrib_favorite + ' ' + attrib.unit + (l==len-1?'':'<br/>');
					} else {
						gain_certain += String(attrib.name).toLowerCase() + ' : ' + attrib_other + ' ' + attrib.unit + (l==len-1?'':'<br/>');
					};
					
					gain_haut += String(attrib.name).toUpperCase() + ' : ' + attrib_favorite + ' ' + attrib.unit + (l==len-1?'':'<br/>');
					gain_bas += String(attrib.name).toLowerCase() + ' : ' + attrib_other + ' ' + attrib.unit + (l==len-1?'':'<br/>');
						
				}

				// INTERFACE
				//on cache le bouton
				$("#k_value_"+i).hide();
				$("#k_value_"+i).append("<br/><br/>");
				var arbre_gauche = new Arbre('pe', "#k_value_"+i, settings.display, "PE");

				// SETUP ARBRE GAUCHE
				arbre_gauche.questions_proba_haut = probability;
				// if(mode=="normal")
				// {arbre_gauche.questions_val_max = gain_haut;
				// arbre_gauche.questions_val_min = gain_bas;}
				// else
					// arbre_gauche.questions_val_max = gain_bas;
					// arbre_gauche.questions_val_min = gain_haut;
				arbre_gauche.questions_val_max = gain_haut;
				arbre_gauche.questions_val_min = gain_bas;
				arbre_gauche.questions_val_mean = gain_certain;
				arbre_gauche.display();
				arbre_gauche.update();

				$("#k_value_"+i).append('<br/><br/><br/><br/><div class=choice style="text-align: center;"><p>Which option do you prefer?</p><button type="button" class="btn btn-default gain">A</button><button type="button" class="btn btn-default lottery">B</button></div><br/><br/><div ></div>');
				//on affiche l'arbre avec un petit effet !

				$("#k_value_"+i).show("fast");

				function treat_answer(data){
					min_interval = data.interval[0];
					max_interval = data.interval[1];
					probability = parseFloat(data.proba).toFixed(2);

					if (max_interval - min_interval <= 0.05){
						arbre_gauche.questions_proba_haut = probability;
						arbre_gauche.update();
						ask_final_value(Math.round((max_interval + min_interval)*100/2)/100);
					}
					else {
						arbre_gauche.questions_proba_haut = probability;
						arbre_gauche.update();
					}
				}

				function ask_final_value(val){
					// we delete the choice div
					$('.choice').hide();
					$("#k_value_"+i).append(
						'<br/><br/><br/><br/><div id= "final_value" style="text-align: center;margin-top:90px;"><br /><br /><p>We are almost done. Please enter the value that makes you indifferent between the two situations above. Your previous choices indicate that it should be between ' + min_interval + ' and ' + max_interval + ' but you are not constrained to that range <br /> '+ min_interval +'\
						 <= <input type="text" class="form-control" id="final_proba" placeholder="Probability" value="'+val+'" style="width: 100px; display: inline-block"> <= '+ max_interval +'</p><button type="button" class="btn btn-default final_validation">Validate</button></div>'
					);

					// when the user validate
					$('.final_validation').click(function(){
						var final_proba = parseFloat($('#final_proba').val());

						if (final_proba <= 1 && final_proba >= 0) {

							// we save it
							asses_session.k_calculus[type].k[i].value = final_proba;
							// backup local
							localStorage.setItem("asses_session", JSON.stringify(asses_session));
							// we reload the list
							$("#k_value_" + i).hide("fast", function () {
								update_k_list(type);
								show_list();
							});

						}
					});
				}

				// HANDLE USERS ACTIONS
				$('.gain').click(function() {
					$.post('ajax', '{"type":"question", "method": "PE", "proba": '+ String(probability) + ', "min_interval": '+ min_interval+ ', "max_interval": '+ max_interval+' ,"choice": "0", "mode": "'+"normal"+'"}', function(data) {
						treat_answer(data);
					});
				});

				$('.lottery').click(function() {
					$.post('ajax', '{"type":"question","method": "PE", "proba": '+ String(probability) + ', "min_interval": '+ min_interval+ ', "max_interval": '+ max_interval+' ,"choice": "1" , "mode": "'+"normal"+'"}', function(data) {
						treat_answer(data);
					});
				});
			})()
		}

}




//#######################################################################################
//#######################              CALCULATE K             ##########################
//#######################################################################################


function ki_calculated() {
	var kiNumber = $("#table_k_attributes tr").length;
	var kiNumberCalculated = 0;
	var asses_session = JSON.parse(localStorage.getItem("asses_session"));
	var method = (asses_session.k_calculus[0].active) ? 0 : 1;
	var ma_list = asses_session.k_calculus[method].k;
	for (var i = 0; i < kiNumber; i++) {
		if (ma_list[i].value != null)//so we have calculated this value!
			kiNumberCalculated++;
	}

	if (kiNumber != kiNumberCalculated) {
		if (get_Active_Method() == 0) {
			$("#calculatek_box_multiplicative").fadeIn("fast");
			$("#calculatek_box_multilinear").fadeOut("fast");
		}
		else{
			$("#calculatek_box_multilinear").fadeIn("fast");
			$("#calculatek_box_multiplicative").fadeOut("fast");
		}

		$("#GK").hide();
		//we delete the K we have in memory
		asses_session.k_calculus[get_Active_Method()].GK=null;
	}
	else {
		$("#calculatek_box_multiplicative").fadeOut("fast");
		$("#GK").show();
		if (asses_session.k_calculus[get_Active_Method()].GK != null) {
			$("#GK_value").html(asses_session.k_calculus[get_Active_Method()].GK);
			$("#button_calculate_k").hide();
			$("#calculatek_box_multilinear").fadeOut("fast");
		}
		else {
			if(get_Active_Method()==0)//in multiplicative method
			{
				$("#GK_value").html("");
				$("#button_calculate_k").fadeIn("fast");
				$("#calculatek_box_multilinear").fadeOut("fast");
			}
			else //but in multilineaire
			{
				$("#calculatek_box_multiplicative").fadeOut("fast");
				$("#GK").hide();
				$("#calculatek_box_multilinear").fadeIn("fast");
			}
		}
	}
	$("#button_generate_list").show();
	GK_calculated();

}

$(function(){
	$("#button_calculate_k").click(function() {
		if (get_Active_Method() == 0){//multiplicative

			K_Calculate_Multiplicative();
		}
	});
});

function K_Calculate_Multiplicative() {
	var kiNumber = $("#table_k_attributes tr").length;

	//k value
	var asses_session = JSON.parse(localStorage.getItem("asses_session"));
	var ma_list = asses_session.k_calculus[get_Active_Method()].k;

	var mesK={};
	if(kiNumber==2)
	{
		mesK['k1']=ma_list[0].value;
		mesK['k2']=ma_list[1].value;
	}
	else if(kiNumber==3)
	{
		mesK['k1']=ma_list[0].value;
		mesK['k2']=ma_list[1].value;
		mesK['k3']=ma_list[2].value;
	}
	else if(kiNumber==4)
	{
		mesK['k1']=ma_list[0].value;
		mesK['k2']=ma_list[1].value;
		mesK['k3']=ma_list[2].value;
		mesK['k4']=ma_list[3].value;
	}
	else if(kiNumber==5)
	{
		mesK['k1']=ma_list[0].value;
		mesK['k2']=ma_list[1].value;
		mesK['k3']=ma_list[2].value;
		mesK['k4']=ma_list[3].value;
		mesK['k5']=ma_list[4].value;
	}
	else if(kiNumber==6)
	{
		mesK['k1']=ma_list[0].value;
		mesK['k2']=ma_list[1].value;
		mesK['k3']=ma_list[2].value;
		mesK['k4']=ma_list[3].value;
		mesK['k5']=ma_list[4].value;
		mesK['k6']=ma_list[5].value;
	}


	$.post('ajax', '{"type":"k_calculus", "number":'+kiNumber+', "k":'+JSON.stringify(mesK)+'}', function(data) {

		asses_session.k_calculus[get_Active_Method()].GK=data.k;
		localStorage.setItem("asses_session", JSON.stringify(asses_session));
		//we update the view
		ki_calculated();
	});
}









//#######################################################################################
//###########   Choose utility function corresponding to attribute     ##################
//#######################################################################################

var k_utility_multilinear=[];
var k_utility_multiliplicative=[];
$(function(){
	$("#button_generate_list").click(function() {
			list();
			$("#button_generate_list").hide();
	});
});


function list()
{
	var asses_session = JSON.parse(localStorage.getItem("asses_session"));

	var listk = asses_session.k_calculus[get_Active_Method()].k;

	k_utility_multilinear=[];
	k_utility_multiliplicative=[];

	//list of K with corresponding attribute:

	var maList=[];
	var type=get_Active_Method();
	if(type==0)
	{
		maList=listk;
		for(var i=0; i< listk.length; i++) {
			k_utility_multiliplicative.push(null);
		}
	}
	else {
		for (var i = 0; i < listk.length; i++) {
			if (listk[i].ID_attribute.length == 1) //if we have a k with jsute 1 indice
			{
				maList.push(listk[i]);
				k_utility_multilinear.push(null);
			}
		}
	}


	$('#table_attributes').html("");
	// We fill the table
	for (var i=0; i < maList.length; i++){

		var monAttribut=asses_session.attributes[maList[i].ID_attribute];
		var text = '<tr><td>K' + maList[i].ID + '</td>';
		text+='<td>'+ monAttribut.name + '</td>';
		text+='<td id="charts_'+i+'"></td>';
		text+='<td id="functions_'+i+'"></td>';
		text+='</tr>';

		$('#table_attributes').append(text);

		(function(_i) {
			var json_2_send = {"type": "calc_util", "points":[]};
			var points = monAttribut.questionnaire.points.slice();
			var mode = monAttribut.mode;
			var val_max=monAttribut.val_max;
			var val_min=monAttribut.val_min;
			if (points.length > 0 && monAttribut.checked) {
				if (mode=="normal") {
					points.push([val_max, 1]);
					points.push([val_min, 0]);
				}
				else {
					points.push([val_max, 0]);
					points.push([val_min, 1]);
				}
				json_2_send["points"] = points;
				$.post('ajax', JSON.stringify(json_2_send), function (data) {
					$.post('ajax', JSON.stringify({
						"type": "svg",
						"data": data,
						"min": val_min,
						"max": val_max,
						"liste_cord": points,
						"width": 3
					}), function (data2) {

						$('#charts_' + _i).append('<div>' + data2 + '</div>');
						for (var key in data) {

							var functions = "";
							if (key == 'exp') {
								functions= '<label style="color:#401539"><input type="radio" name="radio_'+_i+'" id="checkbox_'+_i+'_exp"> Exponential (' + Math.round(data[key]['r2'] * 100) / 100 + ')</label><br/>';
								$('#functions_' + _i).append(functions);
								data[key]['type']='exp';
								(function(_data){$('#checkbox_'+_i+'_exp').click(function(){update_utility(_i, "exp", _data)});})(data[key]);

							}
							else if (key == 'log'){
								functions='<label style="color:#D9585A"><input type="radio" name="radio_'+_i+'" id="checkbox_'+_i+'_log"> Logarithmic (' + Math.round(data[key]['r2'] * 100) / 100 + ')</label><br/>';
								$('#functions_' + _i).append(functions);
								data[key]['type']='log';
								(function(_data){$('#checkbox_'+_i+'_log').click(function(){update_utility(_i, "log", _data)});})(data[key]);
							}
							else if (key == 'pow'){
								functions='<label style="color:#6DA63C"><input type="radio" name="radio_'+_i+'" id="checkbox_'+_i+'_pow"> Power (' + Math.round(data[key]['r2'] * 100) / 100 + ')</label><br/>';
								$('#functions_' + _i).append(functions);
								data[key]['type']='pow';
								(function(_data){$('#checkbox_'+_i+'_pow').click(function(){update_utility(_i, "pow", _data)});})(data[key]);
							}
							else if (key == 'quad'){
								functions='<label style="color:#458C8C"><input type="radio" name="radio_'+_i+'" id="checkbox_'+_i+'_quad"> Quadratic (' + Math.round(data[key]['r2'] * 100) / 100 + ')</label><br/>';
								$('#functions_' + _i).append(functions);
								data[key]['type']='quad';
								(function(_data){$('#checkbox_'+_i+'_quad').click(function(){update_utility(_i, "quad", _data)});})(data[key]);
							}
							else if (key == 'lin'){
								functions='<label style="color:#D9B504"><input type="radio" name="radio_'+_i+'" id="checkbox_'+_i+'_lin"> Linear (' + Math.round(data[key]['r2'] * 100) / 100 + ')</label><br/>';
								$('#functions_' + _i).append(functions);
								data[key]['type']='lin';
								(function(_data){$('#checkbox_'+_i+'_lin').click(function(){update_utility(_i, "lin", _data)});})(data[key]);
							}
							else if (key == 'expo-power'){
								functions='<label style="color:#26C4EC"><input type="radio" name="radio_'+_i+'" id="checkbox_'+_i+'_expo-power"> Expo-Power (' + Math.round(data[key]['r2'] * 100) / 100 + ')</label><br/>';
								$('#functions_' + _i).append(functions);
								data[key]['type']='expo-power';
								(function(_data){$('#checkbox_'+_i+'_expo-power').click(function(){update_utility(_i, "expo-power", _data)});})(data[key]);
							}

						}

					})
				});
			}
			else
			{
				if(points.length == 0 && monAttribut.checked)
					$('#charts_' + _i).append("Please assess a utility function for this attribute");
				else if(!monAttribut.checked)
					$('#charts_' + _i).append("The attribute is inactive");

			}
		})(i);



	}
}



function update_utility(i, type, data)
{

	if(get_Active_Method()==0)//multiplicative
	{
		k_utility_multiliplicative[i]=data;
	}
	else
	{
		k_utility_multilinear[i]=data;
	}


}

function addTextForm(div, copie, excel, latex) {

	// if (settings.language=="french") {
	// 	excel=excel.replace(/\./gi,",");
	// }

	var copy_button_dpl = $('<button class="btn functions_text_form" id="btn_dpl" data-clipboard-text="' + copie + '" title="Click to copy me.">Copy to clipboard (DPL format)</button>');
	var copy_button_excel = $('<button class="btn functions_text_form" id= "btn_excel" data-clipboard-text="' + excel + '" title="Click to copy me.">Copy to clipboard (Excel format)</button>');
	var copy_button_latex = $('<button class="btn functions_text_form" id= "btn_latex" data-clipboard-text="' + latex + '" title="Click to copy me.">Copy to clipboard (LaTeX format)</button>');

	div.html('')
	div.append("<div><pre>"+copie+"</pre></div>")
	div.append(copy_button_dpl);
	div.append("<br /><br /><br /><br />");
	div.append("<div><pre>"+excel+"</pre></div>")
	div.append(copy_button_excel);
	div.append("<br /><br /><br /><br />");
	div.append("<div><pre>"+latex+"</pre></div>")
	div.append(copy_button_latex);


	var client = new Clipboard("#btn_dpl");
	client.on("success", function(event) {
		copy_button_dpl.text("Done !");
		setTimeout(function() {
			copy_button_dpl.text("Copy to clipboard (DPL format)");
		}, 2000);
	});

	var client = new Clipboard("#btn_excel");
	client.on("success", function(event) {
		copy_button_excel.text("Done !");
		setTimeout(function() {
			copy_button_excel.text("Copy to clipboard (Excel format)");
		}, 2000);
	});

	var client = new Clipboard("#btn_latex");
	client.on("success", function(event) {
		copy_button_latex.text("Done !");
		setTimeout(function() {
			copy_button_latex.text("Copy to clipboard (LaTeX format)");
		}, 2000);
	});
}

$(function(){

	$("#button_calculate_utility").click(function() {
		var asses_session = JSON.parse(localStorage.getItem("asses_session"));
		if(get_Active_Method()==0)//multiplicative
		{
			if(k_utility_multiliplicative.length==0)
			{
				alert("You need to choose a utility function for all your attribute in the list below");
				return;
			}
			if(asses_session.k_calculus[get_Active_Method()].GK==null){
				alert("You need to calculate K first");
				return;
			}

			for(var i=0; i<k_utility_multiliplicative.length; i++)
			{
				if(k_utility_multiliplicative[i]==null)
				{
					alert("You need to choose a utility function for all your attribute in the list below");
					return;
				}
			}

			//then we pass here so we can send the ajax request
			var mesK=asses_session.k_calculus[get_Active_Method()].k.slice();
			mesK.push({value:asses_session.k_calculus[get_Active_Method()].GK});
			var requete={"type": "utility_calculus_multiplicative", "k":mesK, "utility":k_utility_multiliplicative};

			$.post('ajax', JSON.stringify(requete), function (data) {

				addTextForm($('#utility_function'), data.U, data.Uexcel, data.Ulatex);
				//alert(JSON.stringify(data));
				asses_session.k_calculus[get_Active_Method()].GU=data;
				localStorage.setItem("asses_session", JSON.stringify(asses_session));
				$('html, body').animate({
					scrollTop: $("#utility_function").offset().top
				}, 1000);
			});

		}
		else {
			if (k_utility_multilinear.length == 0) {
				alert("You need to choose a utility function for all your attribute in the list below");
				return;
			}


			for(var i=0; i<k_utility_multilinear.length; i++)
			{
				if(k_utility_multilinear[i]==null)
				{
					alert("You need to choose a utility function for all your attribute in the list below");
					return;
				}
			}

			var requete={"type": "utility_calculus_multilinear", "k":asses_session.k_calculus[get_Active_Method()].k, "utility":k_utility_multilinear};
			$.post('ajax', JSON.stringify(requete), function (data) {
				$("#utility_function").html('<div ><pre>'+data.U+'</pre></div>')
				//alert(JSON.stringify(data));
				asses_session.k_calculus[get_Active_Method()].GU=data;
				localStorage.setItem("asses_session", JSON.stringify(asses_session));
				$('html, body').animate({
					scrollTop: $("#utility_function").offset().top
				}, 1000);
			});
		}

	});
});




function GK_calculated() {
	var asses_session = JSON.parse(localStorage.getItem("asses_session"));
	if (asses_session.k_calculus[get_Active_Method()].GU != null) {
		var listk = asses_session.k_calculus[get_Active_Method()].k;



		if(get_Active_Method()==1)
			k_utility_multilinear=asses_session.k_calculus[1].GU.utilities;
		else if(get_Active_Method()==0)
			k_utility_multiliplicative=asses_session.k_calculus[0].GU.utilities;

		$('#table_attributes').html("");


		//list of K with corresponding attribute:

		var maList=[];
		var type=get_Active_Method();
		if(type==0)
		{
			maList=listk;
		}
		else {
			for (var i = 0; i < listk.length; i++) {
				if (listk[i].ID_attribute.length == 1) //if we have a k with jsute 1 indice
				{
					maList.push(listk[i]);
				}
			}
		}


		for (var i=0; i < maList.length; i++) {

			var monAttribut = asses_session.attributes[maList[i].ID_attribute];
			var text = '<tr><td>K' + maList[i].ID + '</td>';
			text += '<td>' + monAttribut.name + '</td>';
			text += '<td id="charts_' + i + '"></td>';
			text += '<td id="functions_' + i + '">'+asses_session.k_calculus[get_Active_Method()].GU.utilities[i].type+' (r2='+asses_session.k_calculus[get_Active_Method()].GU.utilities[i].r2+')</td>';
			text += '</tr>';

			$('#table_attributes').append(text);

		}


				//we show the value of the global utility function
		$("#utility_function").html('<div><pre>'+asses_session.k_calculus[get_Active_Method()].GU.U+'</pre></div>')
	}
	else
	{
		$("#utility_function").html('');
	}
}
