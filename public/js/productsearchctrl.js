var searchCtrl =  function ( $resource, $scope, $rootScope, $location) {
	var data = {};
	$scope.setfilters = [];
	$scope.data = data;
	$rootScope.selected = [];
	
	$scope.addFilter = function(rec1) {
		console.log ('addFilter ' + JSON.stringify(rec1));
		$scope.setfilters.push(rec1);
	}
	$scope.rmFilter = function(idx) {
		console.log ('rmFilter ' + idx);  			
		$scope.setfilters.splice( $scope.setfilters[idx] ,1);
	}
	
	$scope.addRecord = function(rec1) {
		console.log ('addRecord ' + JSON.stringify(rec1)); 
		$rootScope.selected.push(rec1);
	}
	$scope.rmSelected = function(idx) {
		console.log ('rmSelected ' + idx);  			
		$rootScope.selected.splice( $scope.selected[idx] ,1);
	}
	
	/* configure product */
	$scope.configure = function (s) {
		/* foundation reveal options */
		$('#descModal').data('reveal-init', {
		    animation: 'fadeAndPop',
		    animation_speed: 250,
		    close_on_background_click: false,
		    close_on_esc: false,
		    dismiss_modal_class: 'close-reveal-modal',
		    bg_class: 'reveal-modal-bg',
		    bg : $('.reveal-modal-bg'),
		    css : {
		        open : {
		            'opacity': 0,
		            'visibility': 'visible',
		            'display' : 'block'
		        },
		        close : {
		            'opacity': 1,
		            'visibility': 'hidden',
		            'display': 'none'
		        }
		    }
		});
		
		
		$('#descModal').foundation('reveal', 'open');
	};
	
	/* Initialisation */
	$scope.Search = $resource('/product/:accId', {accId:'@id'}, 
		{'saveall':  {method:'POST', isArray:true},
		'query':  {method:'GET', isArray:false}});
	$scope.showerror = false; 

	/* data/action bindings */
	$scope.search = function (s) {
		if (s == null) s = {};
		if (s.txt == null || s.txt == '') s.txt = "*";
		if (s.rows == null) s.rows = 50;
		//if (f != null) s.filters = JSON.stringify(f);
		s.filters = JSON.stringify($scope.setfilters);
		console.log ('searching for  ' + JSON.stringify(s));
		$location.search('s', JSON.stringify(s));
		
		var res = $scope.Search.query(s, 
			/*Success */
			function (value, responseHeaders){
				console.log(JSON.stringify(value));
				data.res = value.response.docs;

				// Facet
				console.log('found docs ' + value.response.numFound + ' documents');
				data.totalrecords = value.response.numFound;
				data.facetresults = {};
				if (value.facet_counts != null) {
					var ffs = value.facet_counts.facet_fields;
					for (var fld in ffs) {
						var fldvals = ffs[fld];
						var sortedArray = [];
				        for(var x = 0; x <  ffs[fld].length; x+=2) {
				             sortedArray.push( {name: ffs[fld][x], count: ffs[fld][x+1]});   
				        }
				        data.facetresults[fld] = sortedArray;
				    }
				    console.log('facets arranged ' + JSON.stringify(data.facetresults));
				}


			}, 
			/* Error */
			function (httpResponse) {
			 	$scope.errorStr = 'Error ' + JSON.stringify( httpResponse);
			 	$scope.showerror = true;
			 	alert ($scope.errorStr);
			 } );
	}


	/* data/action bindings */
	$scope.add = function (s) {
		$scope.Search.saveall(s, 
						function (value, responseHeaders){
					console.log ('Add success : ' + JSON.stringify( value)) ;

				}, 
							  function (httpResponse) {
				 	$scope.errorStr = 'Error ' + JSON.stringify( httpResponse);
				 	$scope.showerror = true;
				 	alert ($scope.errorStr);
			 	} );

	}

	var initials = $location.search().s;
	console.log('initials ' + JSON.stringify(initials));
	if (initials) {
		initials = JSON.parse(initials);
	} else {
		initials = {txt: '', rows: 0};
	}
	console.log('initials ' + JSON.stringify(initials));
	$scope.search (initials);
}
