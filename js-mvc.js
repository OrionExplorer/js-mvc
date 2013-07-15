(function() {
	var global = this;

	global.JSMVC = {
		application : function(originalPath, config) {
			var launchFunction = null,
				controllers = [],
				i = 0;

			global[originalPath] = config;
			global.JSMVC['name'] = originalPath;

			controllers = global[originalPath].controllers;
			for(i = 0; i < controllers.length; i++) {
				JSMVC.Utils.loadController(controllers[i]);
			}

			if(config && typeof config['launch'] === 'function') {
				launchFunction = JSMVC.Utils.getObjectValue(originalPath, 'launch', global);
				if(typeof launchFunction === 'function') {
					launchFunction();
				}
			}
		},
		create : function(originalPath) {
			var path = originalPath.split('.'),
				newPath = path.join('/'),
				parts = [],
				parent = global;

			if (originalPath !== '') {
				parts = originalPath.split('.');
				for (i = 0; i < parts.length; i++) {
					if (!parent[parts[i]]) {
						parent[parts[i]] = {};
					}
					parent = parent[parts[i]];
				}
			}

			this.Utils.loadJSFile(newPath);
			return JSMVC.Utils.getObjectValue(originalPath, null, global);
		},
		define : function(originalPath, config) {
			var parent = null,
				i = 0,
				path = '',
				controllers = [],
				parts = [],
				item = null,
				newPath = '',
				initFunction = null;

			if(typeof path === 'string') {
				parent = global;
				path = originalPath.split('.');
				newPath = path.join('/');

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
						JSMVC.Utils.initController(originalPath);
					}
					try {
						initFunction = JSMVC.Utils.getObjectValue(originalPath, 'init', global); //eval(originalPath+'[\'init\']');
						if(typeof initFunction === 'function') {
							initFunction();
						}
					} catch(ex) {
						console.error(ex);
					}
				}
			}
		},
		Utils : {
			initController : function(controllerPath) {
				this.loadControllerViews(controllerPath);
				this.loadControllerModels(controllerPath);
			},
			loadController : function(controllerName) {
				this.loadJSFile(JSMVC.name+'/controller/'+controllerName+'/'+controllerName+'.js');
			},
			loadModel : function(controllerName, modelName) {
				this.loadJSFile(JSMVC.name+'/model/'+controllerName+'/'+modelName+'.js');
			},
			loadView : function(controllerName, viewName) {
				this.loadJSFile(JSMVC.name+'/view/'+controllerName+'/'+viewName+'.js');
			},
			loadControllerViews : function(controllerName) {
				var controller = JSMVC.Utils.getObjectValue(controllerName, null, global), //global[JSMVC.name],
					views = controller.views,
					i = 0;
				
				if(views) {
					for(i = 0; i < views.length; i++) {
						this.loadView(controller.name, views[i]);
					}
				}
			},
			loadControllerModels : function(controllerName) {
				var controller = JSMVC.Utils.getObjectValue(controllerName, null, global), //global[JSMVC.name],
					models = controller.models,
					i = 0;

				if(models) {
					for(i = 0; i < models.length; i++) {
						this.loadModel(controller.name, models[i]);
					}
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
			},
			getObjectValue : function(pathStr, key, object) {
				var parts = pathStr.split('.'),
					i = 0,
					len = 0,
					obj = {};
				
				for(i = 0, len = parts.length, obj = object; i < len; ++i) {
					obj = obj[parts[i]];
				}

				return (typeof key === 'string' ?  obj[key] : obj);
			}
		}
	}
})();