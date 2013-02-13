/// <reference path="kooboo/kooboo.js" />
/// <reference path="jquery/jquery-1.4.4-vsdoc.js" />

(function (window, undefined) {
    
    function queryBuilder(option) {

        if (!(this instanceof queryBuilder)) {
            return new queryBuilder(option);
        }

        var 

        config = $.extend(true, {
            $queryContainer: '.comparison-container'
            , $logicSelect: '.logic-operator'
            , $templage: '.comparison-template .comparison'
            , $fieldSelect: '.field select'
            , $operatorSelect: '.operator select'
            , $inputTemplates: '.input-templates'
            , $logicRadioList: '.logic-area'
        }, option)

        , _self = this

        , _guid = kooboo.guid()

        , template = config.container.find(config.$templage)

        , queryContainer = config.container.find(config.$queryContainer)

        , _queryDataName = 'query-data-queryObj'

        , defInputSelector = 'input,select,textarea'

        , _prevDataName = 'query-data-prevData'

        , logicRadios = config.container.find(config.$logicRadioList).find(':radio')

        , logicSelect = config.container.find(config.$logicSelect)

        , inputTemplate = $(config.$inputTemplates)

        , init = kooboo.event.register('kooboo.builder.init');

        if (config.expressions.ex) {
            config.expressions.ex();
            config.fields.ex();
            config.dataTypes.ex();
        }

        function add(queryObj) {

            var isNew = !queryObj || (!queryObj.field && !queryObj.operator);

            if (!queryObj) {
                queryObj = {};
            }

            var tplClone = template.clone()

            , fieldSelect = tplClone.find(config.$fieldSelect)

            , operatorSelect = tplClone.find(config.$operatorSelect)

            , valInputHolder = tplClone.find('.value')

            , getFeildName = function () {
                return queryObj.field || fieldSelect.val();
            }

            , bindValInput = function (val) {
                var input = valInputHolder.find(defInputSelector);
                input.change(function () {
                    queryObj.value = $(this).val();
                    triggerPropertyChange(input);
                }).val(val);

                queryObj.value = input.val();

                clearAndBindValidation(input);

            }

            , triggerPropertyChange = function (input) {
                _self.events.onPropertyChange({
                    input: input
                    , valInputHolder: valInputHolder
                });
            }

            , opreators;

            tplClone.appendTo(queryContainer);

            tplClone.data(_queryDataName, queryObj);

            bindSelect(fieldSelect, config.fields.select(function (o) {
                return {
                    text: o.label
            , value: o.name
                }
            }), queryObj.field);
            opreators = getOperators(getFeildName());
            bindSelect(operatorSelect, opreators.select(function (o) {
                return {
                    text: config.comparisonOperators[o],
                    value: o
                }
            }), queryObj.operator);

            if (isNew) {
                queryObj.field = fieldSelect.val();
                queryObj.operator = operatorSelect.val();
            }

            fieldSelect
            .change(function () {

                var handle = $(this)

                , _opreators = getOperators(handle.val())

                ;

                queryObj.field = handle.val();

                bindSelect(operatorSelect, _opreators.select(function (o) {
                    return {
                        text: config.comparisonOperators[o],
                        value: o
                    }
                }), queryObj.operator);

                operatorSelect.trigger('change');

                valInputHolder.html('').append(getInputTemplate(getFeildName()));

                bindValInput(queryObj.value);

                _self.events.onFieldChange({
                    input: handle
                    , val: handle.val()
                    , name: handle.attr('name')
                    , id: handle.attr('id')
                    , valInputHolder: valInputHolder
                });

            });
            // insert input 
            valInputHolder.html('').append(getInputTemplate(getFeildName()));
            // end 
            operatorSelect.change(function () {
                queryObj.operator = $(this).val();
            });

            tplClone.find('.remove a').click(function () {
                var handle = $(this)
                , callbackParam = {
                    handle: handle
                    , template: tplClone
                    , expression: queryObj
                };
                if (_self.events.beforeRemove(callbackParam)) {
                    tplClone.remove();
                    _self.events.onRemove(callbackParam)
                }
            });
            bindValInput(queryObj.value);
            tplClone.find('input,select,textarea')
            .change(function () {
                var handle = $(this);
                triggerPropertyChange(handle);
            });
        }

        function bindSelect($select, ds, val) {
            $select.html('');
            if (ds) {
                ds.each(function (field, index) {
                    $('<option/>')
                .html(field.text || field)
                .val(field.value || field).appendTo($select);
                });
                $select.val(val);
            }

        }

        init(function () {
            logicRadios.change(function () {
                bindJsonChange();
            })
            .filter('[value="' + config.logicOperator + '"]').attr('checked', 'checked');

            if (config.expressions) {
                config.expressions
                .each(function (queryObj, index) {
                    add(queryObj);
                });
            }
        });

        init(function () {
            inputTemplate
            .find('input,select,textarea')
            .filter(':not(:disabled)')
            .attr('guid', _guid)
            .attr('disabled', 'disabled');
        });

        init();

        function clearAndBindValidation(input) {
            var form = input.parents('form:eq(0)');
            $.data(form[0], 'validator', false);
            form.data('unobtrusiveValidation', false);
            $.validator.unobtrusive.parseElement(input[0], true);
            $.validator.unobtrusive.parse(form);
        }

        function getOperators(fieldName) {
            var result = []
            var field = config.fields.where(function (o) {
                return o.name == fieldName;
            }).first();
            if (field) {
                var typeMeta = config.dataTypes.where(function (o) {
                    return o.name == field.type;
                }).first();
                if (typeMeta) {
                    return typeMeta.operators || [];
                }
            }
            return result.ex ? result.ex() : result;
        }

        function getInputTemplate(fieldName) {
            var clone = inputTemplate
                        .find('div[template-for="' + fieldName + '"]')
                        .clone()
                , inputs = clone.find('select,input,textarea')
            ;

            inputs.filter('[guid="' + _guid + '"]').removeAttr('disabled');

            inputs.each(function () {
                var input = $(this)
                , guid = kooboo.guid()
                , inputId = input.attr('id');
                input.attr({ name: guid, id: guid });
                clone
                .find('[for="' + inputId + '"],[data-valmsg-for="' + inputId + '"]')
                .attr({
                    'for': guid
                    , 'data-valmsg-for': guid
                });
            });

            return clone;
        }

        this.events = {};

        $('onPropertyChange,onAdd,onRemove,beforeAdd,beforeRemove,onFieldChange'.split(','))
        .each(function (index, ev) {
            _self.events[ev] = kooboo.event.register('kooboo.querybuilder.' + ev);
        });

        this.add = function (queryObj) {
            if (this.events.beforeAdd(queryObj)) {
                add(queryObj);
                this.events.onAdd(queryObj);
            }
        };

        this.getQuery = function () {
            var expressions = [];
            queryContainer.children()
            .each(function () {
                var handle = $(this);
                expressions.push(handle.data(_queryDataName));
            });
            return expressions;
        }

        this.getPostData = function () {
            return {
                operator: logicRadios.filter('[checked]').val()
                , expressions: _self.getQuery()
            };
        }

        if (config.jsonHidden) {
            var bindJsonChange = function () {
                config.jsonHidden.val($.toJSON(_self.getPostData()));
            }
            logicSelect.change(function () {
                bindJsonChange();
            });
            this.events.onAdd(bindJsonChange)
            this.events.onPropertyChange(bindJsonChange);
            this.events.onFieldChange(function () {
                clearAndBindValidation(this.valInputHolder.find('input,select,textarea'));
            });
            this.events.onRemove(bindJsonChange);
        }

        if (config.addBtn) {
            config.addBtn.click(function () {
                _self.add();
            });
        }

    }

    window.queryBuilder = queryBuilder;
})(window, undefined);


