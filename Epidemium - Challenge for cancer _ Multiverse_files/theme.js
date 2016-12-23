(function () {

    var app = angular.module('store-theme', []);

    app.directive('themeItemList', function () {
        return {
            restrict: 'E',
            templateUrl: '/js/theme-item-list.html'
        };
    });
	
})();