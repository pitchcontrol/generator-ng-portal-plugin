<% if(useOdata === true) {%>
app.factory('<%= serviceName %>', ['$odataresource', 'settings', function ($odataresource, settings) {
    return $odataresource(settings.webApiODataUrl + '<%= comeBackUrl %>', '<%= id %>', {
        odata: { isArray: false }
    });
}]);
<%} else {%>
app.factory('<%= serviceName %>', ['$resource', 'settings', function ($resource, settings) {
    return $resource(settings.webApiBaseUrl + '<%= comeBackUrl %>/:id', { <%= id %>: '@id' }, {
		'update': {
			method: 'PUT',
			url: settings.webApiBaseUrl + "<%= comeBackUrl %>/:Id"
		}
	});
}]);	
<% } %>