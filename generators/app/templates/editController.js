(function() {
	"use strict";
	var controller = function($location, <%= dependencies.join(', ') %>, $scope, $routeParams, notificationService, <%= serviceName %>) {
		<% dependencies.forEach(function(item) { %>
		this._<%= item %> = <%= item %>;<% }); %>
		this._$routeParams = $routeParams;
		this._$location = $location;
		this._$scope = $scope;
		this._notificationService = notificationService;
		this._$scope.item = new <%= serviceName %> ();
		if (this._$routeParams.id !== undefined) {
			this._$scope.item.<%= id %> = $routeParams.id;
			var promise = this._$scope.item.$get().$promise;
			this._notificationService.loadError(promise);
		}
	}
	controller.$inject = ['$location', <%- dependencies.map(function(item){return "'"+item+"'"}).join(', ') %>, '$scope', '$routeParams', 'notificationService', '<%= serviceName %>'];
	controller.prototype.save = function(item) {
		var self = this;
		var promise;
		if (self._$routeParams.id !== undefined) {
			promise = self._$scope.item.$save();
			self._notificationService.notice('save', promise);
		} else {
			promise = self._$scope.item.$update();
			self._notificationService.notice('update', promise);
		}
		
		promise.then(function() {
			self._$location.path('#<%= comeBackUrl %>');
		});
	};

	app.controller("<%= editControllerName %>", controller);
})();