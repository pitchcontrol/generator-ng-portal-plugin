'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var plur = require('plur');
var changeCase = require('change-case')
var EditPage = require('./utils/localization').EditPage;
var ListPage = require('./utils/localization').ListPage;

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
		}, {
			name: 'fields',
			type: 'input',
			message: 'Название полей через запятую, например: BannerID,Name,Description'

		}];

		this.prompt(prompts, function (props) {
			this.props = props;
			// To access props later use this.props.someAnswer;
			this.props.comeBackUrl = '/' + changeCase.upperCaseFirst(plur(this.props.entityName));
			this.props.editViewUrl = '/Edit' + changeCase.upperCaseFirst(this.props.entityName);
			this.props.editViewName = this.props.editViewUrl + '.html';
			this.props.lowerCaseFirst = changeCase.lowerCaseFirst;
			//Поля
			this.props.fields = this.props.fields ? this.props.fields.split(',') : [];
			done();
		}.bind(this));
	},

	writing: function () {
		let localizationRu = {};
		let localizationEn = {};

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
			localizationRu[this.props.editViewUrl] = new EditPage(this.props.fields);
			localizationEn[this.props.editViewUrl] = new EditPage(this.props.fields);

			let template = this.props.useOdata === true ? 'editOdataController.js' : 'editController.js';
			this.fs.copyTpl(
				this.templatePath(template),
				this.destinationPath(`Scripts/ClientControllers/${this.props.editControllerName}.js`),
				this.props
			);
			this.fs.copyTpl(
				this.templatePath('EditView.html.ejs'),
				this.destinationPath(`Views/${this.props.editViewName}`),
				this.props
			);
		};
		//Добавление списка
		if (this.props.views.includes('list')) {
			localizationRu[this.props.comeBackUrl] = new ListPage(this.props.fields);
			localizationEn[this.props.comeBackUrl] = new ListPage(this.props.fields);

			let template = this.props.useOdata === true ? 'collectionOdataController.ejs' : 'collectionController.ejs';
			this.fs.copyTpl(
				this.templatePath(template),
				this.destinationPath(`Scripts/ClientControllers/${this.props.controllerName}.js`),
				this.props
			);
			template = this.props.useOdata === true ? 'CollectionOdataView.html.ejs' : 'CollectionView.html';
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
		if (!this.fs.exists(`Localization/locale-ru.json`))
			this.fs.writeJSON(`Localization/locale-ru.json`, localizationRu);
		else {
			this.fs.extendJSON(`Localization/locale-ru.json`, localizationRu);
		}
		if (!this.fs.exists(`Localization/locale-en.json`))
			this.fs.writeJSON(`Localization/locale-en.json`, localizationEn);
		else {
			this.fs.extendJSON(`Localization/locale-en.json`, localizationEn);
		}
	},

	install: function () {
		//Установка npm пакетов
		//this.installDependencies();
	}
});