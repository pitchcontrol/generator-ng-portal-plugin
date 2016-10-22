describe('<%= controllerName %> test', function() {
	var controllerName = '<%= controllerName %>';
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
	it('Открываем выполняется запрос', function() {
		$httpBackend.expect('GET', '/api<%= comeBackUrl %>').respond([]);
		var controller = $controller(controllerName, {
			$scope: scope
		});
		$httpBackend.flush();
	});
	it('Открываем выполняется запрос - ошибка', function() {
		var name, promise;
		$httpBackend.expect('GET', '/api<%= comeBackUrl %>').respond(500, '');

		var controller = $controller(controllerName, {
			$scope: scope,
			notificationService: notificationService
		});
		$httpBackend.flush();
		expect(notificationService.error).toHaveBeenCalled();
		expect(notificationService.error.calls.argsFor(0)[0]).toBe('load');
		expect(notificationService.error.calls.argsFor(0)[1].$$state.status).toBe(2);
	});
	it('Удаление - отказ пользователя', function() {
		$httpBackend.expect('GET', '/api<%= comeBackUrl %>').respond([]);
		var controller = $controller(controllerName, {
			$scope: scope,
			modalService: modalService
		});
		$httpBackend.flush();
		modalService.confirm.and.returnValues($q.reject({}));
		controller.delete();
		expect(modalService.confirm).toHaveBeenCalled();
		//Вызова DELETE нет иначе afterEach будет исключение!
	});
	it('Удаление - ошибка', function() {
		$httpBackend.expect('GET', '/api<%= comeBackUrl %>').respond([]);
		var controller = $controller(controllerName, {
			$scope: scope,
			modalService: modalService,
			notificationService
		});
		$httpBackend.flush();
		modalService.confirm.and.returnValues($q.when({}));

		$httpBackend.expect('DELETE', '/api<%= comeBackUrl %>/1').respond(500, '');
		controller.delete({<%= id %>: 1});
		$httpBackend.flush();
		expect(modalService.confirm).toHaveBeenCalled();
		expect(notificationService.notice.calls.argsFor(0)[0]).toBe('delete');
		expect(notificationService.notice.calls.argsFor(0)[1].$$state.status).toBe(2);
	});
	it('Удаление', function() {
		//Вызов будет дважды при при загрузке и при удалении, поэтому when
		$httpBackend.when('GET', '/api<%= comeBackUrl %>').respond([]);
		var controller = $controller(controllerName, {
			$scope: scope,
			modalService: modalService,
			notificationService
		});
		$httpBackend.flush();
		modalService.confirm.and.returnValues($q.when({}));

		$httpBackend.expect('DELETE', '/api<%= comeBackUrl %>/1').respond({});
		controller.delete({<%= id %>: 1});
		$httpBackend.flush();
		expect(modalService.confirm).toHaveBeenCalled();
		expect(notificationService.notice.calls.argsFor(0)[0]).toBe('delete');
		expect(notificationService.notice.calls.argsFor(0)[1].$$state.status).toBe(1);
	});
	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
});