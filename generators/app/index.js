'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var plur = require('plur');
var changeCase = require('change-case')


Array.prototype.addRange = function (objects) {
	for (var i of objects) {
		if (!this.includes(i)) {
			this.push(i);
		}
	}
};

module.exports = yeoman.Base.extend({

	prompting: function () {
		var done = this.async();

		// Have Yeoman greet the user.
		this.log(yosay(
			'Welcome to the praiseworthy ' + chalk.red('generator-ng-help') + ' generator!'
		));

		var prompts = [{
			type: 'checkbox',
			name: 'dependencies',
			message: 'Какие подключить зависимости?',
			choices: [{
				value: '$http',
				name: '$http',
				checked: true
			}, {
				value: '$location',
				name: '$location',
				checked: false
			}, {
				value: 'settings',
				name: 'settings',
				checked: false
			}, {
				value: '$timeout',
				name: '$timeout',
				checked: false
			}, {
				value: '$rootScope',
				name: '$rootScope',
				checked: false
			}, {
				value: '$odata',
				name: '$odata',
				checked: false
			}, {
				value: 'modalService',
				name: 'modalService',
				checked: false
			}, {
				value: 'notificationService',
				name: 'notificationService',
				checked: false
			}]
		}, {
			type: 'input',
			name: 'entityName',
			message: 'Название сущности в единственном числе (Banner,Proposal)'
		}, {
			message: 'Название первичного ключа',
			name: 'id',
			type: 'input',
			default: function (answers) {
				return answers.entityName + 'ID';
			}
		}, {
			type: 'confirm',
			name: 'useOdata',
			message: 'Использовать Odata',
			default: true
		}, {
			type: 'checkbox',
			name: 'views',
			message: 'Какие представления добавлять',
			choices: [{
				value: 'list',
				name: 'Список',
				checked: true
			}, {
				value: 'edit',
				name: 'Раздел редактирования',
				checked: true
			}, {
				value: 'service',
				name: 'Сервис',
				checked: true
			}, {
				value: 'tests',
				name: 'Тесты jasmine',
				checked: true
			}]
		}, {
			name: 'controllerName',
			type: 'input',
			message: 'Название контролера для списка',
			when: function (answers) {
				return answers.views.includes('list');
			},
			default: function (answers) {
				return changeCase.lowerCaseFirst(plur(answers.entityName)) + 'Controller';
			}
		}, {
			name: 'serviceName',
			type: 'input',
			message: 'Название сервиса данных',
			when: function (answers) {
				return answers.views.includes('service');
			},
			default: function (answers) {
				return changeCase.lowerCaseFirst(plur(answers.entityName)) + 'Service';
			}
		}, {
			name: 'editControllerName',
			type: 'input',
			message: 'Название контролера для редактирования',
			when: function (answers) {
				return answers.views.includes('edit');
			},
			default: function (answers) {
				return 'edit' + changeCase.upperCaseFirst(answers.entityName) + 'Controller';
			}
		}];

		this.prompt(prompts, function (props) {
			this.props = props;
			// To access props later use this.props.someAnswer;
			this.props.comeBackUrl = '/' + changeCase.upperCaseFirst(plur(this.props.entityName));
			this.props.editViewUrl = '/Edit' + changeCase.upperCaseFirst(this.props.entityName);
			this.props.editViewName = this.props.editViewUrl + '.html';
			
			done();
		}.bind(this));
	},

	writing: function () {
		//Добавление сервиса
		if (this.props.views.includes('service')) {
			this.fs.copyTpl(
				this.templatePath('service.js'),
				this.destinationPath(`Scripts/ClientServices/${this.props.serviceName}.js`),
				this.props
			);
		};
		//Добавление редактирования
		if (this.props.views.includes('edit')) {
			let template = this.props.useOdata === true ? 'editOdataController.js' : 'editController.js';
			this.fs.copyTpl(
				this.templatePath(template),
				this.destinationPath(`Scripts/ClientControllers/${this.props.editControllerName}.js`),
				this.props
			);
			this.fs.copyTpl(
				this.templatePath('EditView.html'),
				this.destinationPath(`Views/${this.props.editViewName}`),
				this.props
			);
		};
		//Добавление списка
		if (this.props.views.includes('list')) {
			let template = this.props.useOdata === true ? 'collectionOdataController.js' : 'collectionController.js';
			this.fs.copyTpl(
				this.templatePath(template),
				this.destinationPath(`Scripts/ClientControllers/${this.props.controllerName}.js`),
				this.props
			);
			template = this.props.useOdata === true ? 'CollectionOdataView.html' : 'CollectionView.html';
			this.fs.copyTpl(
				this.templatePath(template),
				this.destinationPath(`Views/${this.props.comeBackUrl}.html`),
				this.props
			);
		};
		if (this.props.views.includes('tests')) {
			if (this.props.views.includes('edit')) {
				let template = this.props.useOdata === true ? 'editOdataController.spec.js' : 'editController.spec.js';
				this.fs.copyTpl(
					this.templatePath(template),
					this.destinationPath(`ClientTests/Controllers/${this.props.editControllerName}.spec.js`),
					this.props
				);
			};
			if (this.props.views.includes('list')) {
				let template = this.props.useOdata === true ? 'collectionOdataController.spec.js' : 'collectionController.spec.js';
				this.fs.copyTpl(
					this.templatePath(template),
					this.destinationPath(`ClientTests/Controllers/${this.props.controllerName}.spec.js`),
					this.props
				);
			};
		};
		//Локализация
		this.fs.copyTpl(
			this.templatePath('locale-ru.json'),
			this.destinationPath(`Localization/locale-ru.json`), {});
		this.fs.copyTpl(
			this.templatePath('locale-en.json'),
			this.destinationPath(`Localization/locale-en.json`), {});
	},

	install: function () {
		//Установка npm пакетов
		//this.installDependencies();
	}
});