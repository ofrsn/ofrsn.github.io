(function () {

    var app = angular.module('store-user', []);

    app.directive('userItemList', function () {
        return {
            restrict: 'E',
            templateUrl: '/js/user-item-list.html'
        };
    });

	/*
    app.directive('userPanel', function () {
        return {
            restrict: 'E',
            templateUrl: '/js/user-panel.html',
            controller: function () {
                this.tab = 1;

                this.selectTab = function (setTab) {
                    this.tab = setTab;
                };

                this.isSelected = function (checkTab) {
                    return this.tab === checkTab;
                };
            },
            controllerAs: 'panel'
        };
    });
	*/

})();