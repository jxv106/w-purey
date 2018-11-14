;(function(global, factory){
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  	typeof define === 'function' && define.amd ? define(factory) :
  	(global.purey = factory());
})(this, function () {
	
	if (window === undefined && window.document === undefined) {
		throw new Error('[purey]: only supported on browsers')
	}
	
	function parseQuery () {
		const search = location.search;
		const map = {};
        const array = search.replace(/^\?+/g, '').split('&');
        array.length && array.forEach(item => {
    		const current = item.split('=')
    		if (current.length && current.length > 1) {
    			map[current[0]] = decodeURI(current[1])
    		}
        });
        return map
	};
			
	function defineObject (obj) {
		Object.keys(obj).forEach(key => {
			let value = obj[key];
			Object.defineProperty(obj, key, {
				get: function defineGetter () {
					return value
				},
				set: function defineSetter (newVal) {
					if (newVal !== value && typeof newVal !== 'function' && typeof newVal !== 'object') {
						value = newVal;
						updateQuery(obj)
					}
				}
			})
		});
		return obj
	};
			
	function updateQuery (query) {
		let result;
		const map = Object.entries(query);
		map.forEach((item, index) => {
			if (index === 0) {
				result = `?${item[0]}=${item[1]}`
			} else {
				result = `${result}&${item[0]}=${item[1]}`
			}
		});
		history.replaceState(null, null, result)
	};
			
	function proxyQuery (query) {
		return new Proxy(query, {
			set: function proxySetter (model, key, value) {
				model[key] = value;
				defineObject(model);
				updateQuery(model);
				return true
			}
		})
	};
	
	return proxyQuery(defineObject(parseQuery()))
});
