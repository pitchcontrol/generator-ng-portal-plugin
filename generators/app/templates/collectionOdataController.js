(function() {
	"use strict";
	<% 
		dependencies.addRange(['$scope', 'metadataService']);
	%>
	var controller = function(<%= dependencies.join(', ') %>) {
		<% dependencies.forEach(function(item) { %>
		this._<%= item %> = <%= item %>;<% }); %>
		this._$scope.metadata = metadataService.tgIntit({
			serviceName: '<%= serviceName %>',
			filters: ['Name']
		});
		this._$scope.metadata.load();
	};
	controller.$inject = [<%- dependencies.map(function(item){return "'"+item+"'"}).join(', ') %>];
	app.controller("<%= controllerName %>", controller);
})();