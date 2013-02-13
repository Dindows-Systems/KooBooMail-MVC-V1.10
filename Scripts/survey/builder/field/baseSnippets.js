/*
*
* base snippets
* author: ronglin
* create date: 2010.08.27
*
*/

(function ($) {

    // text resource
    var options = {
        titleGroupName: 'Title',
        titleTipCaption: 'Field Label',
        titleTipContent: 'The label that appears above all other text in this section.',
        guidelinesGroupName: 'Guidelines',
        guidelineTipCaption: 'Guidelines',
        guidelineTipContent: 'This text will be displayed to your users while they are filling out this section of the survey.',
        commentTitle: 'Comment:',
        commentCheckLabel: 'Let respondents add a comment.',
        commentTipCaption: 'Comment',
        commentTipContent: '',
        requiredCheckLabel: 'Make this field required.',
        requiredTipCaption: 'Required',
        requiredTipContent: ''
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.baseSnippets_js); }

    /*
    * baseSnippets
    */
    yardi.baseSnippets = {

        fieldCommon: function (html, ctx, title) {
            html.push('<div class="fieldtop">&nbsp;</div>');
            html.push('<label class="fieldindex custitle"></label>');
            this.fieldtitle.f(html, ctx, title);
            this.required.f(html, ctx);
            this.guideline.f(html, ctx);
        },

        fieldtitle: {
            f: function (html, ctx, title) { html.push('<label #{sync}="fieldtitle" class="fieldtitle custitle">' + title + '</label>'); },
            p: function (html, ctx) {
                html.push('<div class="baserow">');
                html.push('<label class="baselabel">' + options.titleGroupName + ' #{titleTip}</label>');
                html.push('<textarea #{sync}="fieldtitle" class="fieldtitle"></textarea>');
                html.push('</div>');
                // tips
                ctx.setTips({
                    titleTip: {
                        title: options.titleTipCaption,
                        message: options.titleTipContent
                    }
                });
            }
        },

        required: {
            f: function (html, ctx) { html.push('<label #{sync}="required" class="require">*</label>'); },
            p: function (html, ctx) {
                html.push('<div class="baserow">');
                html.push('<input #{sync}="required" id="#{uuid}_required" type="checkbox" class="basecheck" /><label for="#{uuid}_required" class="basechecklabel"> ' + options.requiredCheckLabel + '</label>');
                html.push('</div>');
                // tips
                ctx.setTips({
                    requiredTip: {
                        title: options.requiredTipCaption,
                        message: options.requiredTipContent
                    }
                });
            }
        },

        guideline: {
            f: function (html, ctx) { html.push('<label #{sync}="guideline" class="guideline"></label>'); },
            p: function (html, ctx) {
                html.push('<div class="baserow">');
                html.push('<label class="baselabel">' + options.guidelinesGroupName + ' #{guidelineTip}</label>');
                html.push('<textarea #{sync}="guideline" class="guideline"></textarea>');
                html.push('</div>');
                // tips
                ctx.setTips({
                    guidelineTip: {
                        title: options.guidelineTipCaption,
                        message: options.guidelineTipContent
                    }
                });
            }
        },

        comment: {
            f: function (html, ctx) {
                html.push('<div #{sync}="comment" class="comment custext">');
                html.push('<label>' + options.commentTitle + '</label>');
                html.push('<textarea id="#{n}_comment" name="#{n}_comment"></textarea>');
                html.push('</div>');
            },
            p: function (html, ctx) {
                html.push('<div class="baserow">');
                html.push('<input #{sync}="comment" id="#{uuid}_comment" type="checkbox" class="basecheck" /><label for="#{uuid}_comment" class="basechecklabel"> ' + options.commentCheckLabel + '</label>');
                html.push('</div>');
                // tips
                ctx.setTips({
                    commentTip: {
                        title: options.commentTipCaption,
                        message: options.commentTipContent
                    }
                });
            }
        }

    };

})(jQuery);
