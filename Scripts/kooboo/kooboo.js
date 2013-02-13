/// <reference path="../jquery-1.4.4-vsdoc.js" />

// kooboo
(function (window) {
    if (window.kooboo) {
        return kooboo;
    }
    var _k = {},
    kooboo = function (dom) {
        ///<summary>
        /// kooboo JS Frame
        /// by kooboo.namespace("adminJs.global"); adminJs.global is avaliable 
        /// adminJs.global.extend({ sayHello: function(){ alert('hello ') }});
        /// adminJs.global.extend({ sayHi: function(){ alert('hi ') }});
        /// adminJs.global.extend({ ready: function(){ alert('i am going here! ') }});//ready method will execute immediately
        /// kooboo.namespace("adminJs.fileJs");
        /// adminJs.fileJs.extend({ sayHello: function(){ alert('hello ') }});
        /// kooboo.using(adminJs.global,function(global){
        ///     sayHello();
        ///     global.sayHello();
        /// });
        /// kooboo.using([adminJs.global,adminJs.fileJs],function(global,fileJs){
        ///     fileJs.sayHello();
        ///     global.sayHello();
        ///     sayHi();
        /// });
        ///</summary>

    },
    _extendMethod = function (obj) {
        if (typeof (obj) == 'function' || typeof (obj) == 'object') {
            obj.extend = function (objx, objx2) {
                if (objx) {
                    if (objx2) {
                        if (typeof (objx) == 'string') {
                            obj[objx] = objx2;
                        }
                    } else {
                        if (typeof (objx) == 'function' || typeof (objx) == 'object') {
                            for (var p in objx) {
                                obj[p] = objx[p];
                                _extendMethod(obj[p]);
                            } // end for
                            if (objx.ready && typeof (objx.ready) == 'function') {
                                kooboo.ready(function () {
                                    objx.ready.call(objx);
                                });
                            }
                        } //end if
                    } //end  if (typeof (objx) == 'string') 
                } //end if(objx)
            } // end extend
        } //end if
    };

    kooboo.namespace = function (spaceName, obj) {
        ///<summary>
        /// registing method or object to kooboo
        ///</summary>
        ///<param type="string" name="spaceName">
        /// create a namespace
        ///</param>

        if (spaceName && typeof (spaceName) == 'string') {
            ///
            function _creatObject(objName, obj) {
                if (objName.indexOf('.') > 0) {
                    var first = objName.substring(0, objName.indexOf("."));
                    if (!obj[first]) {
                        obj[first] = new Object();
                        _extendMethod(obj[first]);
                    }
                    _creatObject(objName.substring(objName.indexOf(".") + 1), obj[first]);
                } else {
                    if (!obj[objName]) {
                        obj[objName] = new Object();
                        _extendMethod(obj[objName]);
                    }
                }
            }
            _creatObject(spaceName, obj || window);
        }
        else {
            throw " typeof(spaceName) must be string!";
        }
    }
    kooboo.using = function (spaces, func) {
        ///<summary>
        /// registing method or object to kooboo
        ///</summary>
        ///<param type="object" name="spaceName">
        /// create a namespace
        ///</param>
        if (spaces instanceof Array) {
            var conflict = {};
            var count = spaces.length;
            for (var s in spaces) {
                for (var p in spaces[s]) {
                    if (window[p]) {
                        conflict[p] = spaces[s][p];
                    } else {
                        window[p] = spaces[s][p];
                    }
                }
            }
            func.apply(this, spaces);
            for (var s in spaces) {
                for (var p in s) {
                    if (!conflict[p]) {
                        delete window[p];
                    }
                }
            }
        } else {
            var conflict = {};
            for (var p in spaces) {
                if (window[p]) {
                    conflict[p] = spaces[p];
                } else {
                    window[p] = spaces[p];
                }
            }
            func(conflict);

            for (var p in spaces) {
                if (!conflict[p]) {
                    delete window[p];
                }
            }
        }
    }
    kooboo.extend = function (obj1, obj2) {
        ///<summary>
        /// this method can extend fJs
        ///</summary>
        ///<param type="object" name="obj1">
        /// fist object to extend if obj2 is null obj1's attribute will be extended to kooboo
        ///</param>
        ///<param type="object" name="obj2">
        /// extend obj2's attribute to obj1
        ///</param>
        ///<returns type="function">

        var obj1 = arguments[0];
        var obj2 = arguments[1];
        if (obj1) {
            if (obj2) {
                if (typeof (obj1) == 'string') {
                    kooboo[obj1] = obj2;
                    _extendMethod(kooboo[obj1]);
                }
                else if (typeof (obj1) == 'object' || typeof (obj1) == 'function') {
                    for (var p in obj2) {
                        obj1[p] = obj2[p];
                    }
                }
            }
            else {
                if (typeof (obj1) == 'object' || typeof (obj1) == 'function') {
                    for (var p in obj1) {
                        kooboo[p] = obj1[p];
                        _extendMethod(kooboo[p]);
                    }
                }
            }
        }

        return kooboo;
    }

    //------useful method in js----------------------

    ///Class kooboo.object
    var koobooObject = {
        getVal: function (obj, pStr) {
            if (pStr.indexOf('.') > 0) {
                var firstProp = pStr.substring(0, pStr.indexOf("."));

                var lastProp = pStr.substring(pStr.indexOf('.') + 1);
                if (firstProp.indexOf('[') >= 0) {
                    var index = firstProp.substring(firstProp.indexOf('[') + 1, firstProp.lastIndexOf(']'));
                    index = parseInt(index);
                    if (firstProp.indexOf('[') == 0) {
                        return this.getVal(obj[index], lastProp);
                    } else if (firstProp.indexOf('[') > 0) {
                        var propertyName = pStr.substring(0, pStr.indexOf('['));
                        return this.getVal(obj[propertyName][index], lastProp);
                    }
                } else {
                    var pObj = obj[firstProp];
                    return this.getVal(pObj, lastProp);
                }
            } else {
                if (pStr.indexOf('[') >= 0) {
                    var index = pStr.substring(pStr.indexOf('[') + 1, pStr.lastIndexOf(']'));
                    index = parseInt(index);
                    if (pStr.indexOf('[') == 0) {
                        return obj[index];
                    } else if (pStr.indexOf('[') > 0) {
                        var propertyName = pStr.substring(0, pStr.indexOf('['));
                        return obj[propertyName][index];
                    }
                } else {
                    return obj[pStr];
                }
            }
        },
        setVal: function (obj, pStr, val) {
            //debugger;
            //pStr = pStr.trim();
            if (pStr.indexOf('.') > 0) {
                var firstProp = pStr.substring(0, pStr.indexOf("."));

                var lastProp = pStr.substring(pStr.indexOf('.') + 1);

                if (firstProp.indexOf('[') >= 0) {
                    var index = firstProp.substring(firstProp.indexOf('[') + 1, firstProp.indexOf(']'));
                    index = parseInt(index);

                    if (firstProp.indexOf('[') == 0) {
                        if (!obj[index]) { obj[index] = {}; };
                        this.setVal(obj[index], lastProp, val);
                    } else if (firstProp.indexOf('[') > 0) {
                        var propertyName = pStr.substring(0, pStr.indexOf('['));

                        if (!obj[propertyName]) { obj[propertyName] = []; };

                        if (!obj[propertyName][index]) { obj[propertyName][index] = {}; };

                        this.setVal(obj[propertyName][index], lastProp, val);
                    }
                } else {
                    if (!obj[firstProp]) {
                        obj[firstProp] = {};
                    }
                    this.setVal(obj[firstProp], lastProp, val);
                }


            } else {
                var arrayReg = /\[\d*\]/;
                if (arrayReg.test(pStr)) {


                    var index = pStr.substring(pStr.indexOf('[') + 1, pStr.lastIndexOf(']'));

                    index = parseInt(index);
                    if (pStr.indexOf('[') == 0) {
                        obj[index] = val;
                    } else if (pStr.indexOf('[') > 0) {
                        var propertyName = pStr.substring(0, pStr.indexOf('['));
                        if (!obj[propertyName]) {
                            obj[propertyName] = [];
                        }
                        obj[propertyName][index] = val;
                    }
                } else {
                    obj[pStr] = val;
                }

            }
            return obj;
        }
    };

    kooboo.object = function (obj) {
        var api = {
            getVal: function (pStr) {
                return koobooObject.getVal(obj, pStr);
            },
            setVal: function (pStr, val) {
                return koobooObject.setVal(obj, pStr, val);
            }
        };
        return api;
    }

    kooboo.extend(kooboo.object, koobooObject);

    var _tempdata = {};
    kooboo.data = function (name, value) {
        if (arguments.length == 1) {
            try {
                var result = kooboo.object.getVal(_tempdata, name);
                return result;
            }
            catch (E) { }
            return null;
        } else if (arguments.length == 2) {
            kooboo.object.setVal(_tempdata, name, value);
        }
    }

    kooboo.guid = function () {
        return Math.random().toString().replace('.', '-');
    }

    //-------end us -useful method in js------------

    window.kooboo = kooboo;
    if (!top.kooboo) {
        top.kooboo = kooboo;
    }
})(window);        //end kooboo

// kooboo.alert
(function () {

    kooboo.extend("alert", function (msg) {
        alert(msg);
    });

    kooboo.extend("confirm", function (msg, callback, title) {
        //Disable confirm if the message is null.
        if (msg == undefined || msg == '') {
            callback(true);
        }
        else
            callback(confirm(msg));
    });

})();

(function () {
    var objReference = [];
    kooboo.getHash = top.kooboo.getHash || function (obj) {
            var query = objReference
            .ex()
            .where(function (val) { return val.obj == obj; }).first();
            if (query == null) {
                query = {
                    obj: obj,
                    key: Math.random()
                };
                objReference.push(query);
            }

            return query.key;
        }
})();


(function () {
    
    //kooboo.namespace('kooboo.event');

    var  event = kooboo.event = {} ;

    event._event = {
        eventList: {},
        add: function (func, name, data, rtnResult) {
            
            name = name || "default";
            
            if( !this.eventList[name] ) {
                this.eventList[name] = [];
            }

            var eve = {
                func: function(param){ return func.call(this , param); },
                data:data 
            };
            
            this.eventList[name].push(eve);
            if(rtnResult){
                return rtnResult;
            }
        },
        execute: function (name , context ) {
            name = name || 'default';

            this.eventList[name] = this.eventList[name] || [];

            context = context || kooboo.event._event;

            var result = true;
            this.eventList[name].ex().each(function (fnObj) {
                result = result && (!(fnObj.func.call(context , fnObj.data) == false));
            });
            return result;
        },
        clear : function(name) {
            this.eventList[name] = [];
        }
    };
    
    event.events = event._event.eventList ;

    event.register = function(fnName) {
        var func = function (func,data) {
            if (typeof( func) == 'function') {
                kooboo.event._event.add(func,fnName,data);
            } else { //func is a param when ajax-submit execute
                data = func;
                return kooboo.event._event.execute.call(kooboo.event._event,fnName,data);
            }
        }

        return event._event[fnName] = func;
    }

    event.remove = function(fnName) {
        if(event._event[fnName])
            delete event._event[fnName];
    }

    event.clear = function(fnName){
        event._event.clear(fnName);
    }

    var methods = 'ajaxSubmit,afterSubmit,onSuccess'.split(',');

    $(methods)
    .each(function(index,fnName){
        event.register(fnName);
    });

})();
/* 
extensions for :
string 
array : array.ex()
*/
; (function () {
    
    /*---
    String Extension
    */
    String.prototype.trim = function () {
        var reg = /(^\s*)|(\s*$)/g;
        return this.replace(reg, "");
    }

    String.prototype.trimAll = function () {
        var reg = /\s*/g;
        return this.replace(reg, '');
    }

    String.prototype.toLower = String.prototype.toLowerCase;

    String.prototype.toUpper = String.prototype.toUpperCase;

    //end string extension

    /*---
    Array Extension
    */

    function arrayEx(instance) {
        
        function isFunc (func) {
            return typeof func == 'function';
        }


        function sort ( field , dirc ) {
            dirc = dirc || 1 ;
            return instance.sort(function (x,y) {
                if (field) {
                    if( x[field] > y[field]) {
                        return dirc;
                    } else {
                        return -1 * dirc ;
                    }
                } else {
                    if( x > y ) {
                        return dirc;
                    } else {
                        return -1 * dirc ;
                    }   
                }                
            });
        }

        instance.asc = function(field) {
            return sort(field,1);
        }

        instance.desc = function (field){
            return sort(field,-1);
        }

        instance.each = function (func) {
            for (var i = 0; i < this.length; i++) {
                if (func(this[i], i) == false) {
                    break;
                }
            }
            return this;
        }

        instance.where = function (func) {
            var results = [];
            results.ex();
            this.each(function (value, index) {
                if (func(value, index) == true) {
                    results.push(value);
                }
            });
            return results;
        }

        instance.first = function (func) {
            if (this.length == 0) {
                return null;
            }
            if(isFunc(func)){
                return this.where(func).first();
            }else{
                return this[0];
            }
        }

        instance.last = function () {
            if (this.length == 0) {
                return null;
            }
            return this[this.length - 1];
        }

        instance.take = function (num) {
            var result = [];
            for (var i = 0; i < num; i++) {
                result.push(this[i]);
            }
            return result;
        }

        instance.skip = function (num) {
            var result = [];
            for (var i = num; i < this.length; i++) {
                result.push(this[i]);
            }
            return result;
        }

        instance.select = function (func) {
            var results = [];
            this.each(function (value, index) {
                results.push(func(value, index));
            });
            return results;
        }

        instance.remove = function (func) {
            var toRemove = [];
            toRemove.ex();
            this.each(function (val, index) {
                if (func(val, index)) { toRemove.push(index); }
            });
            var arr = this;
            toRemove.reverse().each(function (val) { arr.splice(val, 1) });
            return arr;
        }

        instance.removeElement = function (elment) {
            return this.remove(function (value, index) { return value == elment; });
        }

        instance.removeAt = function (index) {
            return this.remove(function (value, index) { return index == index; });
        }

        instance.indexOf = function (element) {
            var i = -1;
            this.each(function (value, index) {
                if (value == element) {
                    i = index;
                    return false;
                }
            });

            return i;
        }

        instance.contain = function (element) {
            return this.indexOf(element) >= 0;
        }

        return instance;
    }

    Array.prototype.ex = function (toNewIntance) {
        
        if (Array.prototype.where) {
            return this;
        }

        var instance = toNewIntance ? this.clone() : this;

        return arrayEx(instance);

    }

    Array.prototype.clone = function () {
        var arr = [];
        for (var i = 0; i < this.length; i++) {
            arr.push(this[i]);
        }
        return arr;
    }

})();

//kooboo.cms.ui.formHelper
(function ui_formhelper() {
    $.fn.addHidden = function (name, val, fieldSet) {
        if (this.find('[name="' + name + '"]').length > 0) {
            this.find('[name="' + name + '"]').val(val);
            return this;
        }
        var hiddenInput = $('<input type="hidden"/>').val(val).attr("name", name);

        if (fieldSet) {
            var fieldSet = this.find("fieldset[name=" + fieldSet + "]");
            if (fieldSet.length > 0) {
                fieldSet.append(hiddenInput);
            } else {
                fieldSet = $("<fieldset></fieldset>").attr("name", fieldSet).appendTo(this);
            }
        }
        this.append(hiddenInput);
    }

    kooboo.namespace("kooboo.formHelper");
    kooboo.formHelper.extend({

        hiddenCls: 'machine-column-input-field',

        createHidden: function (data, name, $form) {
            var current = this;
            form = $($form);

            if ($.isPlainObject(data)) {
                for (var p in data) {
                    current.createHidden(data[p], name + '.' + p, form);
                }
            } else if ($.isArray(data)) {
                data.ex().each(function (val, index) {
                    current.createHidden(val, name + '[' + index + ']', form);
                });
            } else {
                form.addHidden(name, data);
            }
        },

        setForm: function (data, $form, pre) {
            form = $($form);
            var current = this;
            for (var prop in data) {
                var fullName = pre ? (pre + "." + prop) : prop;
                if ($.isPlainObject(data[prop])) {
                    current.setForm(data[prop], form, fullName);
                } else if (!$.isArray(data[prop])) {
                    form.setFormField(fullName, data[prop]);
                }
            }
        },

        tempForm: function (dataObj, url, pre, formAttr, $form) {
            ///<summary>
            /// make data into hidden field
            /// data can be object or array
            /// 
            ///</summary>
            /// 
            ///	<param name="dataObj" type="object">
            ///	the data you want to put into form
            ///	</param>
            /// 
            ///	<param name="url" type="String">
            ///	the form's url  (can be null)
            ///	</param>
            /// 
            ///	<param name="pre" type="String">
            ///	the data's prefix (can be null)
            ///	</param>
            ///	<param name="formAttr" type="object">
            ///	the form's html attributes
            ///	</param>
            ///	<param name="$form" type="jQuery">
            ///	can be null or jquery object
            ///	</param>
            ///	<returns type="formHelpAPI" />
            var formAttrConfig = {
                action: url,
                method: 'post'
            };
            var current = this;
            $.extend(formAttrConfig, formAttr);

            var form = $form || $("<form></form>").attr(formAttrConfig);

            form.appendTo($("body"));

            function init(data) {
                current.createHidden(data, pre, form);
            }

            init(dataObj);

            var api = {
                clear: function () {
                    form.html('');
                },
                reset: function (data) {
                    form.html('');
                    data = data || dataObj;
                    init(data);
                },
                submit: function () {
                    form.submit();
                },
                addData: function (data, dataPre) {
                    dataPre = dataPre ? dataPre : pre;
                    current.createHidden(data, dataPre, this.form);
                    return this;
                },
                ajaxSubmit: function (option) {
                    option = option ? option : {};
                    option.url = option.url ? option.url : formAttrConfig.action;
                    option.type = option.type ? option.type : formAttrConfig.method;
                    var ajaxConfig = {
                        data: form.serialize()
                    };
                    $.extend(option, ajaxConfig);
                    $.ajax(option);
                },
                form: form
            };

            return api;
        },

        clearHidden: function (source) {
            $(source).find('.' + this.hiddenCls).remove();
            return this;
        },

        copyForm: function (source, dest, nameProvider) {
            ///<summary>
            /// copy input or select or hidden value to destination form
            /// UNDONE
            ///</summary>
            ///	<param name="$source" type="String,jQuery">
            /// 
            ///	</param>
            ///	<param name="$form" type="jQuery">
            ///		
            ///	</param>
            ///	<returns type="jQuery" />
            var getName = function (input) {
                var name = input.attr('name');
                if (typeof (nameProvider) == 'function') {
                    name = nameProvider.call(input);
                }
                return name;
            },
            hiddenStr = "<input type='hidden'/>",
            tempForm = dest || $('<form/>'),
            machineCls = this.hiddenCls;
            source = $(source);

            source.find(':checkbox').each(function () {
                var input = $(this);
                var hidden = $(hiddenStr)
                    .attr('name', getName(input))
                    .addClass(machineCls);
                if (source.find(input.attr('name')).length == 2) {
                    hidden.val(input.attr('checked'));
                    hidden.appendTo(tempForm);
                } else if (input.attr('checked')) {
                    hidden.val(input.val());
                    hidden.appendTo(tempForm);
                }
            });

            source.find('input:not(:checkbox),textarea').each(function () {
                var handle = $(this);
                var hidden = $(hiddenStr).attr({ name: getName(handle), value: handle.val() }).appendTo(tempForm).addClass(machineCls);
            });

            source.find("select").each(function () {
                var input = $(this), inputValue;

                inputValue = input.val() && input.val().length ? input.val() : input.find('option:eq(0)').val();

                var hidden = $(hiddenStr)
                    .attr('name', getName(input))
                    .val(inputValue)
                    .addClass(machineCls);
                hidden.appendTo(tempForm);
            });

            return tempForm;
        }

    });
    var _hiddenStr = '<input type="hidden" />';
    function generateHidde() {
        return $(_hiddenStr);
    }
    var formHelper = {
        inputTypeHandle: {
            'radio': function (input, $source, $dest) {
                var hidden = generateHidde();

                if (input.attr('checked')) {
                    hidden.val(input.val());
                    return hidden;
                } else {
                    return false;
                }
            },
            'checkbox': function (input, $source, $dest) {
                var hidden = generateHidde();
                if (hidden.attr('checked')) {
                    hidden.val(true);
                }
            },
            'select-one': function (input, $source, $dest) {
                var hidden = generateHidde();

            },
            'select-many': function (input, $source, $dest) {
                var hidden = generateHidde();
            },
            'hidden': function (input, $source, $dest) {
                var hidden = generateHidde();
            },
            defaultInput: function (input, $source, $dest) {
                var hidden = generateHidde();

            }
        }
    };
})();