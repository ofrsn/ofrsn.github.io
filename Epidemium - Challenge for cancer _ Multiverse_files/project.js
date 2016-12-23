(function () {

    var app = angular.module('store-project', []);

    app.directive('projectItemList', function () {
        return {
            restrict: 'E',
            templateUrl: '/js/project-item-list.html'
        };
    });
	
})();