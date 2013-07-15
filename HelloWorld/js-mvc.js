(function() {
	var global = this,
		i = 0;

	global.JSMVC = {
		application : function(originalPath, config) {
			global[originalPath] = config;
			global.JSMVC['name'] = originalPath;

			this.controllers = global[originalPath].controllers;
			for(i = 0; i < this.controllers.length; i++) {
				JSMVC.utils.loadController(this.controllers[i]);
			}

			if(config && typeof config['launch'] === 'function') {
				eval(originalPath+'.launch()');
			}
		},
		define : function(originalPath, config) {
			var parent = null,
				i = 0,
				path = '',
				controllers = [],
				parts = [],
				item = null;

			if(typeof path === 'string') {
				parent = global;
				path = originalPath.split('.');

				if (originalPath !== '') {
					parts = originalPath.split('.');
					for (i = 0; i < parts.length; i++) {
						if (!parent[parts[i]]) {
							parent[parts[i]] = {};
						}
						parent = parent[parts[i]];
					}
				}

				if(config) {
					for (item in config) {
						if (config.hasOwnProperty(item)) {
							parent[item] = config[item];
						}
					}
					if(parts[1] === 'controller') {
						JSMVC.utils.initController(config['name']);
					}
					if(typeof config['init'] === 'function') {
						eval(originalPath+'.init()');
					}
				}
			}
		},
		utils : {
			initController : function(controllerName) {
				this.loadControllerViews(controllerName);
				this.loadControllerModels(controllerName);
			},
			loadController : function(controllerName) {
				this.loadJSFile(JSMVC.name+'/controller/'+controllerName+'/'+controllerName+'.js');
			},
			loadModel : function(modelName) {
				this.loadJSFile(JSMVC.name+'/model/'+modelName+'/'+modelName+'.js');
			},
			loadView : function(viewName) {
				this.loadJSFile(JSMVC.name+'/view/'+viewName+'/'+viewName+'.js');
			},
			loadControllerViews : function(controllerName) {
				var application = global[JSMVC.name],
					controller = application.controller[controllerName],
					views = controller.views,
					i = 0;
				
				for(i = 0; i < views.length; i++) {
					this.loadView(views[i]);
				}
			},
			loadControllerModels : function(controllerName) {
				var application = global[JSMVC.name],
					controller = application.controller[controllerName],
					models = controller.models,
					i = 0;

				for(i = 0; i < models.length; i++) {
					this.loadModel(models[i]);
				}
			},
			loadJSFile : function(fileName, callback) {
				var newFile = document.createElement('script');
				newFile.setAttribute('type', 'text/javascript');
				newFile.setAttribute('src', fileName);

				if(callback) {
					newFile.onreadystatechange = newFile.onload = callback();
				}
				document.getElementsByTagName('head')[0].appendChild(newFile);
			}			
		}
	}
})();