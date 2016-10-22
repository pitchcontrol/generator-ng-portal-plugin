describe('<%= editControllerName %> test', function() {
	var controllerName = '<%= editControllerName %>';
	var scope, $httpBackend, notificationService, $q;
	beforeEach(function() {
		module('app');
		notificationService = jasmine.createSpyObj('notificationService', ['error', 'notice']);
		modalService = jasmine.createSpyObj('modalService', ['confirm']);
	});
	var $controller;

	beforeEach(inject(function(_$controller_, _$rootScope_, _$httpBackend_, _$q_) {
		$controller = _$controller_;
		scope = _$rootScope_.$new();
		$httpBackend = _$httpBackend_;
		$q = _$q_;
	}));
	it('Открываем, создание - запроса нет', function() {
		var controller = $controller(controllerName, {
			$scope: scope
		});
		expect(scope.item).toBeDefined();
	});
	it('Открываем редактирование, загрузка', function() {
		$httpBackend.expect('GET', '/odata<%= comeBackUrl %>(1)').respond({});

		var controller = $controller(controllerName, {
			$scope: scope,
			$routeParams: {
				id: 1
			}
		});
		$httpBackend.flush();
	});
	it('Сохранение - ошибка', function() {
		var controller = $controller(controllerName, {
			$scope: scope,
			notificationService
		});

		$httpBackend.expect('POST', '/odata<%= comeBackUrl %>').respond(500, '');
		scope.save();
		$httpBackend.flush();

		expect(notificationService.notice.calls.argsFor(0)[0]).toBe('save');
		expect(notificationService.notice.calls.argsFor(0)[1].$$state.status).toBe(2);
	});
	it('Сохранение', function() {
		var $location = jasmine.createSpyObj('$location', ['path'])
		var controller = $controller(controllerName, {
			$scope: scope,
			notificationService,
			$location: $location
		});

		$httpBackend.expect('POST', '/odata<%= comeBackUrl %>').respond({});
		scope.save();
		$httpBackend.flush();

		expect(notificationService.notice.calls.argsFor(0)[0]).toBe('save');
		expect(notificationService.notice.calls.argsFor(0)[1].$$state.status).toBe(1);

		//Переход к таблице
		expect($location.path.calls.argsFor(0)[0]).toBe('<%= comeBackUrl %>');
	});
	it('Обновление - ошибка', function() {
		$httpBackend.expect('GET', '/odata<%= comeBackUrl %>(1)').respond({
			<%= id %>: 1
		});
		var controller = $controller(controllerName, {
			$scope: scope,
			notificationService,
			$routeParams: {
				id: 1
			}
		});
		$httpBackend.flush();
		$httpBackend.expect('PUT', '/odata<%= comeBackUrl %>(1)').respond(500, '');
		scope.save();

		$httpBackend.flush();

		expect(notificationService.notice.calls.argsFor(0)[0]).toBe('update');
		expect(notificationService.notice.calls.argsFor(0)[1].$$state.status).toBe(2);
	});
	it('Обновление', function() {
		var $location = jasmine.createSpyObj('$location', ['path'])
		$httpBackend.expect('GET', '/odata<%= comeBackUrl %>(1)').respond({
			<%= id %>: 1
		});
		var controller = $controller(controllerName, {
			$scope: scope,
			notificationService,
			$routeParams: {
				id: 1
			},
			$location: $location
		});
		$httpBackend.flush();
		$httpBackend.expect('PUT', '/odata<%= comeBackUrl %>(1)').respond({});
		scope.save();

		$httpBackend.flush();

		expect(notificationService.notice.calls.argsFor(0)[0]).toBe('update');
		expect(notificationService.notice.calls.argsFor(0)[1].$$state.status).toBe(1);

		//Переход к таблице
		expect($location.path.calls.argsFor(0)[0]).toBe('<%= comeBackUrl %>');
	});

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
})