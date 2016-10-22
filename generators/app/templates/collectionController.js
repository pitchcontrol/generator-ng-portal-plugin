(function() {
	"use strict";
	var controller = function(<%= dependencies.join(', ') %>, $scope, notificationService, modalService, <%= serviceName %>) {
		<% dependencies.forEach(function(item) { %>
		this._<%= item %> = <%= item %>;<% }); %>
		this._$scope = $scope;
		this._notificationService = notificationService;
		this._modalService = modalService;
		this.refresh();
	};
	controller.prototype.delete = function(item) {
		var self = this;
		modalService.confirm().then(function(){
            var promise = item.$delete();
            self._notificationService.notice('delete', promise);
            promise.then(self.refresh());
        });
	};
	controller.prototype.refresh = function() {
        $scope.dataset = <%= serviceName %>.query();
        notificationService.loadError($scope.dataset.$promise);
    };
	controller.$inject = [<%- dependencies.map(function(item){return "'"+item+"'"}).join(', ') %>, '$scope', 'notificationService', 'modalService', '<%= serviceName %>'];
	app.controller("<%= controllerName %>", controller);
})();