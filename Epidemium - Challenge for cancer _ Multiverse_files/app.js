(function () {

    var app = angular.module('store', ['store-user','store-project','store-theme','ngAnimate', 'ui.bootstrap','textAngular', 'angularSmoothscroll', 'ngFileUpload', 'ngImgCrop']);
	
	var base_url = '';
	var api = base_url+'/api/';
	
	var ACTIONS = {};
	ACTIONS.NOT_MEMBER_ANYMORE = {
		text: "Retirer",
		iconclass: "glyphicon glyphicon-remove",
		btnclass: "btn-danger",
		show: { "project": false, "projectlist": false, "user": true, "userlist": true, "theme": false, "themelist": false },
	};
	ACTIONS.UPDATE = {
		text: "Modifier",
		iconclass: "glyphicon glyphicon-pencil",
		btnclass: "btn-primary",
		show: { "project": true, "projectlist": false, "user": true, "userlist": false, "theme": false, "themelist": false },
	};
	ACTIONS.DELETE = {
		text: "Supprimer",
		iconclass: "glyphicon glyphicon-trash",
		btnclass: "btn-danger",
		show: { "project": false, "projectlist": false, "user": false, "userlist": false, "theme": false, "themelist": false },
	};
	ACTIONS.DEMAND = {
		text: "Rejoindre",
		iconclass: "glyphicon glyphicon-envelope",
		btnclass: "btn-primary",
		show: { "project": true, "projectlist": false, "user": false, "userlist": false, "theme": false, "themelist": false },
	};
	ACTIONS.NO_DEMAND_ANYMORE = {
		text: "Annuler",
		iconclass: "glyphicon glyphicon-envelope",
		btnclass: "btn-warning",
		show: { "project": true, "projectlist": false, "user": false, "userlist": false, "theme": false, "themelist": false },
	};
	ACTIONS.NO_FOLLOW_ANYMORE = {
		text: "Ne plus suivre",
		iconclass: "glyphicon glyphicon-eye-close",
		btnclass: "btn-success",
		show: { "project": true, "projectlist": false, "user": false, "userlist": false, "theme": false, "themelist": false },
	};
	ACTIONS.FOLLOW = {
		text: "Suivre",
		iconclass: "glyphicon glyphicon-eye-open",
		btnclass: "btn-primary",
		show: { "project": true, "projectlist": false, "user": false, "userlist": false, "theme": false, "themelist": false },
	};
	ACTIONS.DECLINE_DEMAND = {
		text: "Refuser",
		iconclass: "glyphicon glyphicon-thumbs-down",
		btnclass: "btn-warning",
		show: { "project": false, "projectlist": false, "user": false, "userlist": true, "theme": false, "themelist": false },
	};
	ACTIONS.ACCEPT_DEMAND = {
		text: "Accepter",
		iconclass: "glyphicon glyphicon-thumbs-up",
		btnclass: "btn-success",
		show: { "project": false, "projectlist": false, "user": false, "userlist": true, "theme": false, "themelist": false },
	};
	ACTIONS.DEMOTE_TO_MEMBER = {
		text: "Rétrograder",
		iconclass: "glyphicon glyphicon-chevron-down",
		btnclass: "btn-warning",
		show: { "project": false, "projectlist": false, "user": false, "userlist": true, "theme": false, "themelist": false },
	};
	ACTIONS.PROMOTE_TO_OWNER = {
		text: "Promouvoir",
		iconclass: "glyphicon glyphicon-chevron-up",
		btnclass: "btn-warning",
		show: { "project": false, "projectlist": false, "user": false, "userlist": true, "theme": false, "themelist": false },
	};
	
	var ROLES = {};
	ROLES[1] = { // OWNER
		text: "Administrateur",
		iconclass: "glyphicon glyphicon-user ownerstyle",
	}
	ROLES[5] = { // MEMBER
		text: "Membre",
		iconclass: "glyphicon glyphicon-user",
	}
	ROLES[7] = { // DEMANDER
		text: "En attente",
		iconclass: "glyphicon glyphicon-refresh",
	}
	ROLES[9] = { // FOLLOWER
		text: "Follower",
		iconclass: "glyphicon glyphicon-eye-open",
	}
	
	var SKILLS = [
		{'id':'ANALYSE_BDD', 'title': 'Analyse BDD', 'checked':0},
		{'id':'BIG_DATA', 'title': 'Big Data', 'checked':0},
		{'id':'EPIDEMIOLOGIE', 'title': 'Epidémiologie', 'checked':0},
		{'id':'CANCEROLOGIE', 'title': 'Cancérologie', 'checked':0},
		{'id':'SANTE_PUBLIQUE', 'title': 'Santé Publique', 'checked':0},
		{'id':'MEDECIN', 'title': 'Médecin', 'checked':0},
		{'id':'DEV_PYTHON', 'title': 'Dev. Python', 'checked':0},
		{'id':'DATA_MINING', 'title': 'Data Mining', 'checked':0},
		{'id':'MACHINE_LEARNING', 'title': 'Machine Learning', 'checked':0},
		{'id':'DATA_VISU', 'title': 'Data Visu.', 'checked':0},
		{'id':'STATISTIQUE', 'title': 'Statistiques', 'checked':0},
		{'id':'AUTRE', 'title': 'Autre', 'checked':0},
		{'id':'Dataiku', 'title': '<img style="height: 20px" src="/images/Dataiku.png">', 'checked':0},
		{'id':'HyperCube', 'title': '<img style="height: 20px" src="/images/HyperCube.png">', 'checked':0},
	];
	
	var TEAMPROJECT = [
		{'id':'TEAM_NO_PROJECT', 'title': 'Avec une équipe mais sans projet', 'checked':0},
		{'id':'TEAM_PROJECT', 'title': 'Avec une équipe et un projet', 'checked':0},
		{'id':'NO_TEAM_PROJECT', 'title': 'Avec un projet mais sans équipe', 'checked':0},
		{'id':'NO_TEAM_NO_PROJECT', 'title': 'Sans projet et sans équipe', 'checked':0},
		{'id':'AUTRE', 'title': 'Autre', 'checked':0}
	];
	
	var ROLEFILTER = [
		{'id':'', 'title': 'Toute la base'},
		{'id':{'op':'=','values':[1,5]}, 'title': 'Participants'},
		{'id':{'op':'!=','values':[1,5]}, 'title': 'Non participants'}
	];

	
    app.controller('UserSearchController', ['$scope', '$log', '$http', function ($scope, $log, $http) {
	
        var store = this;
		
		this.styroles = ROLES;

        store.items = [];
		store.items.total = 0;
		
		store.skillfilter = SKILLS;
		store.teamprojectfilter = TEAMPROJECT;
		store.rolefilter = ROLEFILTER;
		
		$scope.selectedrole = {
			id: ''
		};
		
		$scope.orderby = {
		selected: 'lastLogin',
		availableOptions: [
			{id: 'createdAt', name: "Inscription"},
			{id: 'updatedAt', name: "Mise à jour"},
			{id: 'lastLogin', name: "Connexion"}
		],
		};
		
		// Pagination
		$scope.setPage = function (pageNo) {
			$scope.bigCurrentPage = pageNo;
			this.store.search();
		};
		$scope.pageChanged = function() {
			$log.log('Page changed to: ' + $scope.bigCurrentPage);
			this.store.search();
		};
		$scope.maxSize = 5;
		$scope.itemsPerPage = 20;
		
		this.search = function() {
			var url = api+'users';
			var pageconfig = "?page=1&nbpp="+$scope.itemsPerPage;
			if (typeof store.terms !== 'undefined' && store.terms != '') url = url+'/'+store.terms+'/name';
			if (typeof $scope.bigCurrentPage !== 'undefined' && $scope.bigCurrentPage != 0) pageconfig = "?page="+$scope.bigCurrentPage+"&nbpp="+$scope.itemsPerPage;
			//var pageconfig = "?page="+$scope.bigCurrentPage+"&nbpp="+$scope.itemsPerPage;
			url = url + pageconfig;
			//alert(url);
			$http.get(
				url, {
				params: {
					"orderby": $scope.orderby.selected,
					"rolefilter": $scope.selectedrole.id,
					"skillfilter[]": store.skillfilter,
					"teamprojectfilter[]": store.teamprojectfilter
				}}).success(function (data) {
					store.items = data.data;
					store.items.total = data.count;
					// pagination
					$scope.totalItems = data.count;
					$scope.currentPage = data.page;
					$scope.itemsPerPage = data.pagesize;
					$scope.bigTotalItems = data.count;
					$scope.bigCurrentPage = data.page;
			});
		};
		
		this.search();		
		
    }]);
	
	
	
    app.controller('ProjectSearchController', ['$scope', '$log', '$http', function ($scope, $log, $http) {
        var projects = this;

        projects.items = [];
		projects.items.total = 0;
		
		projects.skillfilter = SKILLS;
		this.btnactions = ACTIONS;
		
		// Pagination
		$scope.setPage = function (pageNo) {
			$scope.bigCurrentPage = pageNo;
			this.store.search();
		};
		$scope.pageChanged = function() {
			$log.log('Page changed to: ' + $scope.bigCurrentPage);
			this.store.search();
		};
		$scope.maxSize = 5;
		$scope.itemsPerPage = 12;
		
		this.search = function() {
			var url = api+'projects';
			var pageconfig = "?page=1&nbpp="+$scope.itemsPerPage;
			if (typeof projects.terms !== 'undefined' && projects.terms != '') url = url+'/'+projects.terms+'/title';
			if (typeof $scope.bigCurrentPage !== 'undefined' && $scope.bigCurrentPage != 0) pageconfig = "?page="+$scope.bigCurrentPage+"&nbpp="+$scope.itemsPerPage;
			url = url + pageconfig;
			//alert(url);
			$http.get(
				url, {
				params: {
					"skillfilter[]": projects.skillfilter
				}}).success(function (data) {
					projects.items = data.data;
					projects.items.total = data.count;
					// pagination
					$scope.totalItems = data.count;
					$scope.currentPage = data.page;
					$scope.itemsPerPage = data.pagesize;
					$scope.bigTotalItems = data.count;
					$scope.bigCurrentPage = data.page;
				});
		};
		
		this.search();
		
    }]);
	
	
    app.controller('ThemeSearchController', ['$scope', '$log', '$http', function ($scope, $log, $http) {
        var themes = this;

        themes.items = [];
		themes.items.total = 0;
				
		// Pagination
		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
			this.store.search();
		};
		$scope.pageChanged = function() {
			$log.log('Page changed to: ' + $scope.currentPage);
			this.store.search();
		};
		$scope.maxSize = 5;
		$scope.itemsPerPage = 12;

		var url = api+'themes';
		var pageconfig = "?page=1&nbpp="+$scope.itemsPerPage;
		url = url + pageconfig;
		$http.get(url).success(function (data) {
			themes.items = data.data;
			themes.items.total = data.count;
			// pagination
			$scope.totalItems = data.count;
			$scope.currentPage = data.page;
			$scope.itemsPerPage = data.pagesize;
			$scope.bigTotalItems = data.count;
			$scope.bigCurrentPage = data.page;
        });
		
		this.search = function() {
			var url = api+'themes';
			var pageconfig = "?page="+$scope.currentPage+"&nbpp="+$scope.itemsPerPage;
			url = url + pageconfig;
			//alert(url);
			$http.get(url).success(function (data) {
				themes.items = data.data;
				themes.items.total = data.count;
				// pagination
				$scope.totalItems = data.count;
				$scope.currentPage = data.page;
				$scope.itemsPerPage = data.pagesize;
				$scope.bigTotalItems = data.count;
				$scope.bigCurrentPage = data.page;
			});
		};
		
    }]);	

	app.controller('UserProjectsController', ['$scope', '$http', function ($scope, $http) {
        var userprojects = this;

        userprojects.items = [];
		userprojects.roles = [];
		userprojects.items.total = 0;
		
		this.btnactions = ACTIONS;
		this.styroles = ROLES;
		
		$scope.$watch('id', getprojects, true);
		function getprojects() {
			var url = api+'projects';
			if ($scope.id != '') url = url+'/'+$scope.id+'/user';
			//alert(url);
			$http.get(url).success(function (data) {
				userprojects.items = data.data;
				userprojects.roles = data.roles;
			});
		}
		
		this.action = function(actionid, projectid, i) {
			if (actionid == "NOT_MEMBER_ANYMORE") {
				this.remove(projectid, i);
			}
			else if (actionid == "UPDATE") {
				this.edit(projectid);
			}
			else if (actionid == "DELETE") {
				this.edit(projectid);
			}
			else {
				alert("ERROR : Action "+actionid+" Unknown");
			}
		}
		
		this.remove = function(projectid, i) {
			alert("TODO : Remove "+projectid);
		};
		
		this.edit = function(projectid) {
			var url = base_url+"/project/"+projectid+"/edit";
			//alert(url);
			window.location.href = url;
		}

		
    }]);
	
	
	app.controller('ProjectUsersController', ['$scope', '$http', 'mySharedService', function ($scope, $http, sharedService) {
        var projectusers = this;

        projectusers.items = [];
		projectusers.roles = [];
		projectusers.items.total = 0;
		
		this.btnactions = ACTIONS;
		this.styroles = ROLES;
		
		$scope.$watch('id', getusers, true);
		function getusers() {
			var url = api+'users';
			if ($scope.id != '') url = url+'/'+$scope.id+'/project';
			//alert(url);
			$http.get(url).success(function (data) {
				projectusers.items = data.data;
				projectusers.roles = data.roles;
			});
		}
		
		this.action = function(actionid, userid, i) {
			if (actionid == "NOT_MEMBER_ANYMORE") {
				this.changerole(userid, i, 9);
			} else if (actionid == "ACCEPT_DEMAND") {
				this.changerole(userid, i, 5);
			} else if (actionid == "DECLINE_DEMAND") {
				this.changerole(userid, i, 9);
			} else if (actionid == "UPDATE") {
				this.edit();
			} else if (actionid == "DEMOTE_TO_MEMBER") {
				this.changerole(userid, i, 5);
			} else if (actionid == "PROMOTE_TO_OWNER") {
				this.changerole(userid, i, 1);
			}
			else {
				alert("ERROR : Action "+actionid+" Unknown");
			}
		}
		
		this.edit = function() {
			var url = base_url+"/profile/edit";
			//alert(url);
			window.location.href = url;
		}
		
		this.changerole = function(userid, i, role) {
			//var url = 'http://multiverse.3do2.fr/app_dev.php/api';
			if (typeof userid !== 'undefined' && userid != '') url = api+'users/'+userid;
			else return false;
			if (typeof $scope.id !== 'undefined' && $scope.id != '') url = url+'/projects/'+$scope.id;
			else return false;
			url = url+'/roles/'+role;

			//alert("ChangeRole User #"+i+" URL : "+url);

			$http.get(url)
				.success(function(data, status, headers, config){
					if (role == 0) projectusers.items.splice(i,1); // Remove but not used
					else {
						if (data.status) {
							projectusers.items[i].actions = data.actions;
							projectusers.roles[i] = role;
						}
						else alert(data.msg);
					}
				})
				.error(function(data, status, headers, config){
					//$scope.error_message = data.error_message;
					alert("Error ="+status);
					alert("Error ="+headers);
					alert("Error ="+data.error_message);
				});
		};
		
		$scope.$on('handleBroadcast', function() {
			//$scope.message = 'ONE: ' + sharedService.message;
			//alert(sharedService.message);
			// Reload the list (message from ProjectController)
			getusers();
		});
		
    }]);
	
	
	
    app.controller('ThemeProjectsController', ['$scope', '$log', '$http', function ($scope, $log, $http) {
        var projects = this;

        projects.items = [];
		projects.items.total = 0;
		
		this.btnactions = ACTIONS;
		
		// Pagination
		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
			this.store.search();
		};
		$scope.pageChanged = function() {
			$log.log('Page changed to: ' + $scope.currentPage);
			this.store.search();
		};
		
		$scope.$watch('themeid', getprojectsbytheme, true);
		function getprojectsbytheme() {
			//alert("themeid="+$scope.themeid);
			projects.search();
		}	
		
		this.search = function() {
			var url = api+'projects';
			var pageconfig = "?page=1&nbpp=10";
			if (typeof $scope.themeid !== 'undefined' && $scope.themeid != '') url = url+'/'+$scope.themeid+'/theme';
			if (typeof $scope.currentPage !== 'undefined' && $scope.currentPage != 0) pageconfig = "?page="+$scope.currentPage+"&nbpp="+$scope.itemsPerPage;
			url = url + pageconfig;
			//alert(url);
			$http.get(url).success(function (data) {
				projects.items = data.data;
				projects.items.total = data.count;
				// pagination
				$scope.totalItems = data.count;
				$scope.currentPage = data.page;
				$scope.itemsPerPage = data.pagesize;
				$scope.bigTotalItems = data.count;
				$scope.bigCurrentPage = data.page;
			});
		};
		
		
    }]);

	

    app.controller('UserController', ['$scope', '$http', function ($scope, $http) {
		var user = this;
		user.profile = {};
		
		this.btnactions = ACTIONS;
		
		$scope.$watch('id', getuser, true);
		function getuser() {
			var url = api+'users';
			if ($scope.id != '') url = url+'/'+$scope.id;
			//alert(url);
			$http.get(url).success(function (data) {
				// clean and check URLS
				if (data.facebook && data.facebook.indexOf("http") != 0) data.facebook = "http://"+data.facebook;
				if (data.twitter && data.twitter.indexOf("http") != 0) data.twitter = "http://"+data.twitter;
				if (data.linkedin && data.linkedin.indexOf("http") != 0) data.linkedin = "http://"+data.linkedin;
				if (data.viadeo && data.viadeo.indexOf("http") != 0) data.viadeo = "http://"+data.viadeo;
				if (data.googleplus && data.googleplus.indexOf("http") != 0) data.googleplus = "http://"+data.googleplus;
				if (data.instagram && data.instagram.indexOf("http") != 0) data.instagram = "http://"+data.instagram;
				user.profile = data;
			});
		}
		
		this.action = function(actionid, userid) {
			if (actionid == "UPDATE") {
				this.edit();
			}
			else {
				alert("ERROR : Action "+actionid+" Unknown");
			}
		}
		
		this.edit = function() {
			var url = base_url+"/profile/edit";
			//alert(url);
			window.location.href = url;
		}
		
    }]);
	
    app.controller('ProjectController', ['$scope', '$http', 'mySharedService', function ($scope, $http, sharedService) {
		var project = this;
		project.profile = {};
		
		this.btnactions = ACTIONS;
		
		$scope.$watch('id', getproject, true);
		function getproject() {
			var url = api+'projects';
			if ($scope.id != '') url = url+'/'+$scope.id;
			//alert(url);
			$http.get(url).success(function (data) {
				if (data.wiki_url) {
					var reg=new RegExp("[ \/]+", "g");
					var servername = data.wiki_url.split(reg);
					if (servername.length >1)
						data.wikiservername = servername[1];
				}
				project.profile = data;
			});
		}
		
		this.action = function(actionid, projectid) {
			if (actionid == "UPDATE") {
				this.edit(projectid);
			} else if (actionid == "FOLLOW") {
				this.changerole(projectid, 9);
			} else if (actionid == "NO_FOLLOW_ANYMORE") {
				this.changerole(projectid, 0);
			} else if (actionid == "DEMAND") {
				this.changerole(projectid, 7);
			} else if (actionid == "NO_DEMAND_ANYMORE") {
				this.changerole(projectid, 9);
			}
			else {
				alert("ERROR : Action "+actionid+" Unknown");
			}
		}
		
		this.changerole = function(projectid, role) {
			if (typeof projectid !== 'undefined' && projectid != '') url = api+'projects/'+projectid;
			else return false;
			url = url+'/users/0/roles/'+role;

			//alert("Change Role ID#"+projectid+" by user 0 : "+url);

			$http.get(url)
				.success(function(data, status, headers, config){
					if (data.status) { 
						project.profile.actions = data.actions;
						// to send an event to the projectuserscontroller to ask him to reload the list
						sharedService.prepForBroadcast("Please reload !");
					}
					else alert(data.msg);
				})
				.error(function(data, status, headers, config){
					//$scope.error_message = data.error_message;
					alert("Error ="+status);
					alert("Error ="+headers);
					alert("Error ="+data.error_message);
				});
		};
				
		this.edit = function(projectid) {
			var url = base_url+"/project/"+projectid+"/edit";
			//alert(url);
			window.location.href = url;
		}
    }]);

	
   app.controller('ThemeController', ['$scope', '$http', function ($scope, $http) {
		var theme = this;
		theme.profile = {};
		
		$scope.$watch('id', gettheme, true);
		function gettheme() {
			var url = api+'themes';
			if ($scope.id != '') url = url+'/'+$scope.id;
			//alert(url);
			$http.get(url).success(function (data) {
				theme.profile = data;
			});
		}
		
    }]);


    app.controller('MainCtrl', function ($scope) {
		//alert('MainCtrl');
    });
	app.controller('DropdownCtrl', function($scope) {
		//alert('DropdownCtrl');
	});
	
	app.controller('wysiwygeditor', function wysiwygeditor($scope) {
		//$scope.htmlContent = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li style="color: blue;">Super Easy <b>Theming</b> Options</li><li>Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li>Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE8+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>';
		$scope.disabled = false;
		
		// wywusyg form validation
		$scope.submitForm = function() {
			if ($scope.tdod_projectbundle_project.$valid) {
				// Submit as normal
				//alert(this.path+"project/21");
				document.tdod_projectbundle_project.action = this.form_action;
				document.tdod_projectbundle_project.submit();
			}
			else {
				// don't submit
			}
		}
	});
	
	app.controller('AccordionDemoCtrl', function ($scope) {
		$scope.oneAtATime = true;
		$scope.status = {
		isFirstOpen: true,
		isFirstDisabled: false
		};
	});
	
	app.controller('UploadAndCropImageCtrl', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
		$scope.upload = function (dataUrl) {
			Upload.upload({
				//url: base_url+'/upload',
				url: '/app_dev.php/upload',
				//url: '/upload.php',
				//method: 'POST',
				file: Upload.dataUrltoBlob(dataUrl),
				//sendFieldsAs: 'form',
				fields: {
					//tags: [ 'dark', 'moon' ],
					filename: $scope.filename,
				},
				//data: {
				//	file: Upload.dataUrltoBlob(dataUrl),
				//	filename: $scope.filename
				//},
			}).then(function (response) {
				$timeout(function () {
					$scope.result = response.data;
				});
			}, function (response) {
				if (response.status > 0) $scope.errorMsg = response.status 
					+ ': ' + response.data;
			}, function (evt) {
				$scope.progress = parseInt(100.0 * evt.loaded / evt.total);
			});
		}
	}]);
	

	angular.module('angularSmoothscroll', []).directive('smoothScroll', [
	  '$log', '$timeout', '$window', function($log, $timeout, $window) {
		/*
			Retrieve the current vertical position
			@returns Current vertical position
		*/

		var currentYPosition, elmYPosition, smoothScroll;
		currentYPosition = function() {
		  if ($window.pageYOffset) {
			return $window.pageYOffset;
		  }
		  if ($window.document.documentElement && $window.document.documentElement.scrollTop) {
			return $window.document.documentElement.scrollTop;
		  }
		  if ($window.document.body.scrollTop) {
			return $window.document.body.scrollTop;
		  }
		  return 0;
		};
		/*
			Get the vertical position of a DOM element
			@param eID The DOM element id
			@returns The vertical position of element with id eID
		*/

		elmYPosition = function(eID) {
		  var elm, node, y;
		  elm = document.getElementById(eID);
		  if (elm) {
			y = elm.offsetTop;
			node = elm;
			while (node.offsetParent && node.offsetParent !== document.body) {
			  node = node.offsetParent;
			  y += node.offsetTop;
			}
			return y;
		  }
		  return 0;
		};
		/*
			Smooth scroll to element with a specific ID without offset
			@param eID The element id to scroll to
			@param offSet Scrolling offset
		*/

		smoothScroll = function(eID, offSet) {
		  var distance, i, leapY, speed, startY, step, stopY, timer, _results;
		  startY = currentYPosition();
		  stopY = elmYPosition(eID) - offSet;
		  distance = (stopY > startY ? stopY - startY : startY - stopY);
		  if (distance < 100) {
			scrollTo(0, stopY);
			return;
		  }
		  speed = Math.round(distance / 100);
		  if (speed >= 20) {
			speed = 20;
		  }
		  step = Math.round(distance / 25);
		  leapY = (stopY > startY ? startY + step : startY - step);
		  timer = 0;
		  if (stopY > startY) {
			i = startY;
			while (i < stopY) {
			  setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
			  leapY += step;
			  if (leapY > stopY) {
				leapY = stopY;
			  }
			  timer++;
			  i += step;
			}
			return;
		  }
		  i = startY;
		  _results = [];
		  while (i > stopY) {
			setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
			leapY -= step;
			if (leapY < stopY) {
			  leapY = stopY;
			}
			timer++;
			_results.push(i -= step);
		  }
		  return _results;
		};
		return {
		  restrict: 'A',
		  link: function(scope, element, attr) {
			return element.bind('click', function() {
			  var offset;
			  if (attr.target) {
				offset = attr.offset || 100;
				$log.log('Smooth scroll: scrolling to', attr.target, 'with offset', offset);
				return smoothScroll(attr.target, offset);
			  } else {
				return $log.warn('Smooth scroll: no target specified');
			  }
			});
		  }
		};
	  }
	]).directive('smoothScrollJquery', [
	  '$log', function($log) {
		return {
		  restrict: 'A',
		  link: function(scope, element, attr) {
			return element.bind('click', function() {
			  var offset, speed, target;
			  if (attr.target) {
				offset = attr.offset || 100;
				target = $('#' + attr.target);
				speed = attr.speed || 500;
				$log.log('Smooth scroll jQuery: scrolling to', attr.target, 'with offset', offset, 'and speed', speed);
				return $('html,body').stop().animate({
				  scrollTop: target.offset().top - offset
				}, speed);
			  } else {
				$log.log('Smooth scroll jQuery: no target specified, scrolling to top');
				return $('html,body').stop().animate({
				  scrollTop: 0
				}, speed);
			  }
			});
		  }
		};
	  }
	]);
	
	app.directive('backgroundImage', function(){
		return function(scope, element, attrs){
			restrict: 'A',
			attrs.$observe('backgroundImage', function(value) {
				element.css({
					'background-image': 'url(' + value +')'
				});
			});
		};
	});
	
	
	// Communicate between controllers
	app.factory('mySharedService', function($rootScope) {
		var sharedService = {};
		
		sharedService.message = '';

		sharedService.prepForBroadcast = function(msg) {
			this.message = msg;
			this.broadcastItem();
		};

		sharedService.broadcastItem = function() {
			$rootScope.$broadcast('handleBroadcast');
		};

		return sharedService;
	});

	
})();