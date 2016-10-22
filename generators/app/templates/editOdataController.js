(function () {
	"use strict";
	<% 
		dependencies.addRange(['$location', '$scope', '$routeParams', 'notificationService', serviceName]);
	%>
	var controller = function (<%= dependencies.join(', ') %>) {
		<% dependencies.forEach(function (item) { %>
			this._<%= item %> = <%= item %>;<% }); %>

		if (this._$routeParams.id !== undefined) {
			this._$scope.item = <%= serviceName %>.odata().get($routeParams.id);
			this._notificationService.loadError(this._$scope.item.$promise);
		} else {
			this._$scope.item = new <%= serviceName %>();
		}
	};
	controller.$inject = [<%- dependencies.map(function (item) { return "'" + item + "'" }).join(', ') %>];
	controller.prototype.save = function (item) {
		var self = this;
		var promise;
		if (self._$routeParams.id === undefined) {
			promise = this._$scope.item.$save();
			self._notificationService.notice('save', promise);
		} else {
			promise = this._$scope.item.$update();
			self._notificationService.notice('update', promise);
		}

		promise.then(function () {
			self._$location.path('<%= comeBackUrl %>');
		});
	};

	app.controller("<%= editControllerName %>", controller);
})();