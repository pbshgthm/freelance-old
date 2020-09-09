//set up pins
_icon_size=[17,17];
if($(window).width()<=500)_icon_size=[13,13];




var _title_width=($(window).width() * 0.4)+'px';
var _title_left=($(window).width() * 0.3)+'px';

$('#title').css('left',_title_left);
$('#title').css('width',_title_width);




var pinClr={};
pinClr["01"] = L.icon({
	iconUrl: 'assets/icons/pin1.png',
    iconSize: _icon_size,
});
pinClr["02"] = L.icon({
	iconUrl: 'assets/icons/pin2.png',
    iconSize: _icon_size,
});
pinClr["03"] = L.icon({
	iconUrl: 'assets/icons/pin3.png',
    iconSize: _icon_size,
});
pinClr["04"] = L.icon({
	iconUrl: 'assets/icons/pin4.png',
    iconSize: _icon_size,
});
pinClr["05"] = L.icon({
	iconUrl: 'assets/icons/pin5.png',
    iconSize: _icon_size,
});
pinClr["06"] = L.icon({
	iconUrl: 'assets/icons/pin6.png',
    iconSize: _icon_size,
});
pinClr["07"] = L.icon({
	iconUrl: 'assets/icons/pin7.png',
    iconSize: _icon_size,
});
pinClr["08"]= L.icon({
	iconUrl: 'assets/icons/pin8.png',
    iconSize: _icon_size,
});

mylocPin= L.icon({
	iconUrl: 'assets/icons/locmarker.png',
    iconSize: _icon_size,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


// set up map
_zoom_level=11;
_map_center=[19.07, 73];
_tip_zoom=15;
__first=true;
_off_center=0.0005;


if($(window).width()<=770){
	_zoom_level=9.5;
	_map_center=[19.07, 72.95];
}

if($(window).width()<=500){
	_off_center=0.0006;
	_zoom_level=10;
	_map_center=[19.10, 72.95];
}

var mymap = L.map('mapArea', {
    center: _map_center,
    zoom: _zoom_level,
	zoomSnap: 0.1
});


markerGroup = L.layerGroup().addTo(mymap);


mymap.options.minZoom = 9;
mymap.options.maxZoom = 19;
mymap.removeControl(mymap.zoomControl);
mymap.setMaxBounds([[20,74],[18,71]]);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicmFuZG9td2Fsa3oiLCJhIjoiY2pjdzFpN3oxMTgyOTJ3bnVhcmptbDltZiJ9.mOQL0Dh0uro2iDlwiumKWw', 
{
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoicmFuZG9td2Fsa3oiLCJhIjoiY2pjdzFpN3oxMTgyOTJ3bnVhcmptbDltZiJ9.mOQL0Dh0uro2iDlwiumKWw'
}).addTo(mymap);

/////////////////////////////////////

//#F9A825
// state variables
menuOpen=false;
_clrs=[
	'#969696',
	'#9F30CE',
	'#FF0088',
	'#FF5500',
	'#EA9000',
	'#795548',
	'#12A69D',
	'#267BE8',
]
_prevCat='00';



// keyboard events
if($(window).width()>500){
	document.onkeydown = checkKey;
	$('#search-box').attr('placeholder','Search');
}


_poi=-1;
_sea_len=0;
function checkKey(e) {

    e = e || window.event;

    if( $('#search-complete').is(':visible') ){
    	
    	$('.search-items').removeClass('search-items-sel');
    	
    	if (e.keyCode == '38')if(_poi>0)_poi--;	
       	if (e.keyCode == '40')if(_poi<_sea_len-1)_poi++;
    	
    	$('.search-items').eq(_poi).addClass('search-items-sel');
    	
    	//search if enter pressed
    	if (e.keyCode == '13')
    		if($('.search-items').eq(0).text()!='no results')
    			viewInfo($('.search-items').eq(_poi)[0].id.substring(3,6))
    }
}



//zoom controls
$('#zoom-in').bind('click',function(){
	mymap.zoomIn();
})
$('#zoom-out').bind('click',function(){
	mymap.zoomOut();
})





// runtime actions


//menu toggle
$('#menu-btn').bind('click',toggleMenu);

function toggleMenu(){
	if(!menuOpen)viewMenu();
	else hideMenu();
}

function viewMenu(){
	if($(window).width()<=500) {
		$('#map-filter').fadeIn();
		$('#menu-pane').css('left','0vw');
		menuOpen=true;
		hideInfo();
		$('#menu-btn').attr('src','assets/icons/back.png');
	}
}

function hideMenu(){
	if($(window).width()<=500){
		$('#map-filter').fadeOut();
		$('#menu-pane').css('left','-100vw');
		menuOpen=false;
		$('#menu-btn').attr('src','assets/icons/menu.png');
	}
}


//click on map filter to hide menu
$('#map-filter').bind('click',hideMenu);


//init cat and items
for(var i=0;i<cat.length;i++){
	$('#cat-bar').append('<div class="cat-btn" id="cat'+cat[i][1]+'">'+cat[i][0]+'</div>');
	var _items=''
	for(var j=0;j<cat_ind[cat[i][1]].length;j++)
			_items+='<div class="cat-item" id="cit'+info[cat_ind[cat[i][1]][j]][3]+'">'+info[cat_ind[cat[i][1]][j]][0]+'</div>';
	$('#menu-pane').append('<div class="cat-pane"><div class="cat-name" id="cn'+i+'" style="color:'+_clrs[i+1]+'">'+cat[i][0]+'</div>'+
		'<img class="cat-more" id="cm'+i+'" src="assets/icons/down.png">\
		<div class="cat-items-pane" id="ctp'+i+'">'+_items+'</div></div>');
}

clrBtn();


//event handlers for viewing items
$('.cat-name,.cat-more').bind('click',function(){
	_id=this.id[2];
	if($('#cm'+_id).css('font-size')=='1px')viewItems(_id);
	else hideItems(_id);

});

function viewItems(_id){
	
	for(var i=0;i<cat.length;i++){
		if(parseInt(_id)!=parseInt(cat[i][1])-1)
			hideItems(parseInt(cat[i][1]-1));
	}
	$('#cm'+_id).css('font-size','2px');
	$('#cm'+_id).css('transform','rotateZ(180deg)');
	$('#ctp'+_id).slideDown()
}

function hideItems(_id){
	$('#cm'+_id).css('font-size','1px');
	$('#cm'+_id).css('transform','rotateZ(0deg)');
	$('#ctp'+_id).slideUp();
}


//event handlers for viewing info
$('.cat-item').bind('click',function(){
	$('.cat-item').css('color','#607D8B');
	viewInfo(this.id.substring(3,6));
	$('#'+this.id).css('color','#263238');
});


//adding colors to buttons
function clrBtn(){
	for(var i=0;i<cat.length+1;i++){
		$('.cat-btn').eq(i).css('color',_clrs[i]);
		$('.cat-btn').eq(i).css('background-color','white');
	}
}

//event handler for category buttons
$('.cat-btn').bind('click',function(){
	selCat(this.id.substring(3,5));
});

//select category
function selCat(_id,recc=false){


	viewItems(parseInt(_id)-1);
	$('#search-box').val('');
	clrBtn();
	$('#cat'+_id).css('background-color',_clrs[parseInt(_id)]);
	$('#cat'+_id).css('color','white');
	if(_id=='00')dropPins(all_pin)
	else dropPins(cat_ind[_id]);
	_prevCat=_id;
	if(!recc)hideInfo(recc=true);
	homeView();
}

//default cat is all
selCat('00');

//hide clear btn
$('#clear-btn').hide();


//event handler for map-click
mymap.on('click', function(ev) {
    hideInfo(recc=false,hmv=false);
});


//event handler for clearing input
$('#clear-btn').bind('click',function(){
	$('#search-box').val('');
	$('#search-complete').hide();
	homeView();
});

//search
function search(key,ind=false){
	
	if(key.length>=0)$('#clear-btn').show();
	else $('#clear-btn').hide();
	function sim(wda, wdb){
    	var r=wda.toLowerCase().indexOf(wdb.toLowerCase());
    	if(r!=-1)return true;
    	return false
	}

	function cmp(a,b){return a[1]-b[1];}

	if(key.length<3){
		$('#search-complete').hide();
		return;
	}
	var result=[];    
	var fin=[];	
	if(!ind){
		for(var i=0;i<index.length;i++)
	        if(sim(index[i][0],key))
	        {
	        	var x=1-(key.length/index[i][0].length);
	            result.push([index[i][1],x]);
	        }

		result=result.sort(cmp);
		for(var i=0;i<result.length;i++)fin.push(result[i][0]);
	}
	else fin.push(key);

	
	if(!ind){
		for(var i=0;i<ind_add.length;i++)
	        if(sim(ind_add[i][0],key))
	        {
	        	var x=1-(key.length/ind_add[i][0].length);
	            result.push([ind_add[i][1],x]);
	        }

		result=result.sort(cmp);
		for(var i=0;i<result.length;i++)fin.push(result[i][0]);
	}
	else fin.push(key);
	
	nodup=[];
	$.each(fin, function(i, el){
    if($.inArray(el, nodup) === -1) nodup.push(el);
	});
	fin=nodup;
	

	if(fin.length==0)
	{	
		$('#search-complete').empty();
		$('#search-complete').append('<div class="search-items"><i>no results</i></div>');
		$('#search-complete').show();
		_sea_len=0;
		_poi=-1;
		return;
	}
	else
	{		
		$('#search-complete').empty();
		for(var i=0;i<fin.length;i++)
			$('#search-complete').append('<div class="search-items" id="sit'+info[fin[i]][3]+'">'+info[fin[i]][0]+'</div>');
		$('#search-complete').show();
		_sea_len=$('.search-items').length;
		_poi=-1;
		//dropPins(fin);
	}
	
	$('.search-items').bind('click',function(){viewInfo(this.id.substring(3,6))});

}


//drop pins
function dropPins(ind){
	data=[]
	for(var i=0;i<ind.length;i++)data.push(info[ind[i]]);
	pins={};
	mymap.removeLayer(markerGroup);
	markerGroup = L.featureGroup().addTo(mymap).on('click',pinInfo);;
	for(var i=0;i<data.length;i++){

	var popup = L.popup({autoClose:false}).setContent(data[i][0]);
	pins[data[i][3]]=L.marker([data[i][1],data[i][2]],{icon:pinClr[data[i][4]]}).addTo(markerGroup).bindTooltip(data[i][0],{className: 'tool-tip'})
	pins[data[i][3]].ind=data[i][3];
	}
	

	mymap.on('zoomend', function() {
		if(mymap._zoom>_tip_zoom) for(var i in pins)pins[i].openTooltip();
		else for(var i in pins)pins[i].closeTooltip();
	});
}

//event handler for pins
function pinInfo(e){
	i=e.layer.ind;
	viewInfo(info[i][3]);
}


//disp info
function viewInfo(ind){
	clrBtn();
	hideMenu();
	_newPins=cat_ind[_prevCat];
	_newPins.push(ind);
	dropPins(_newPins);
	$('#search-complete').hide();
	$('#search-box').val(info[ind][0]);
	$('#info-box').empty();
	_inf='<img src="assets/icons/cross.png"\
		id="info-close">\
		<div id="info-name">'+info[ind][0]+'</div>\
		<div id="info-add">'+info[ind][8]+'</div>\
		<div id="info-phone">'
	
	_ph=info[ind][6].split('|');
	_em=info[ind][5].split('|');

	if(_ph.length>0){
		for(k=0;k<_ph.length;k++)
		_inf+='<div class="ph-inner"><a style="color:black" href="tel:'+_ph[k]+'" target="_blank">'+_ph[k]+'</a></div>';
		//_inf.slice(0,-50);
		_inf+='</div>'
	}
			
	if(_em[0]!=''){
		_inf+='<div id="info-email">';
		for(k=0;k<_em.length;k++)
		_inf+='<div class="ph-inner"><a style="color:black" href="mailto:'+_em[k]+'" target="_blank">'+_em[k]+'</a></div>';
		_inf+='</div>'
	}
	_inf+='<div id="info-web"><a href="'+info[ind][7]+'" target="_blank">'+info[ind][7]+'</div>'
	
	$('#info-box').append(_inf);
	$('#info-box').slideDown();	
	$('#info-close').bind('click',hideInfox);
	goTo(ind);	
}

//hide info
function debug(){};

function hideInfox(){
	mymap.setZoom(_tip_zoom+0.5 );
	$('#info-box').slideUp();

}

function hideInfo(recc=false,hmv=true){
	//mymap.setZoom(13);

	if(hmv){
		//mymap.setZoom(13);
		if(!recc)selCat(_prevCat);
	}
	else	if(!recc)selCat(_prevCat,recc=true);
	$('#info-box').slideUp();

}


//fly to location
function goTo(ind){
	crd=info[ind];
	mymap.flyTo([crd[1]-_off_center,crd[2]],18);
}


//fly home

function homeView(){
	mymap.flyTo(_map_center, _zoom_level);
}
$('#home-view').bind('click',homeView);

//get curr location
var gpsView=false;
function getLoc() {
	if(gpsView){
    	mymap.removeLayer(herePin);
    	gpsView=false;
    	return;
    }
    else{
    	
    	if (navigator.geolocation)
    		navigator.geolocation.getCurrentPosition(showLoc);
    	else alert('Browser does not support');
    }
 
}

//show curr location
function showLoc(position) {
    	var crds=[position.coords.latitude,position.coords.longitude];

		herePin = L.featureGroup().addTo(mymap)
		mar=L.marker(crds,{icon:mylocPin}).addTo(herePin).bindPopup("You are here").openPopup();
		mymap.flyTo(crds,15);
		gpsView=true;
}
$('#curr-loc').bind('click',getLoc);








//android support
var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
if(isAndroid) {
	document.write('<meta name="viewport" content="width=device-width,height='+window.innerHeight+', initial-scale=1.0">');
 }


$('#menu-pane').append('<div id="powered">Powered by</div><a href="http://indiaculturelab.org" target="_blank"><img id="logo-power" src="assets/logo.png"></a><div id="desc">Mumbai’s Culture Map shows the diverse cultural landscape of Mumbai. Explore the spaces around you and be part of the cultural scene.</div>');





$('#open-btn').bind('click',function(){
	$('#content').css('top','0');
	setTimeout(function(){
		$('.controls').fadeIn();
	},1000);
	setTimeout(function(){
		$('#intro').hide();
	},3000);
})

$('.controls').bind('mouseenter',function(){
	$('#'+this.id).attr('src','assets/icons/'+this.id+'-act.png');
});
$('.controls').bind('mouseleave',function(){
	$('#'+this.id).attr('src','assets/icons/'+this.id+'.png');
});


window.onorientationchange = function() { window.location.reload(); };



//init
dropPins(all_pin);
$('.leaflet-control-attribution').hide();


