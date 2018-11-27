/* Custom JS */
var suspend = false;

$(function(){

    $("[data-check]").change(function(){ if(!suspend) { checkValidate(); } });
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) { checkValidate(); });
    $("#modal-new-rule").on('shown.bs.modal', function(){ checkValidate(); });
    $("#add-rule").click(function(){ createRule(); });
    $("#edit-rule").click(function(){ createRule("edit"); });
    $("#clear-values").click(function(){ refreshRules(); });
    $("#new-rule-modal").click(function(){
        refreshRules();
        $("#edit-rule").attr("data-id",false).hide();
        $("#add-rule").show();
        $('#modal-new-rule').modal('show');
        $('#modal-new-rule').modal('show');
    });

    $(document.body).on('click', '.btn-edit', function(){
        var $el = $(this).closest("li.rules-item");
        var data = JSON.parse(decodeURI($el.attr("data-raw")));
        refreshRules();

        $.each(data, function(a,b){
            if($("#"+a).attr("data-role")=="tagsinput") $('#'+a).tagsinput('add', b);
                else $("#"+a).val(b);
        });

        $("#edit-rule").attr("data-id",$el.attr("data-id")).show();
        $("#add-rule").hide();
        $('#modal-new-rule').modal('show');
    });

    $(document.body).on('click', '.btn-expand', function(){
        var $el = $(this);
        $li = $el.closest("li.rules-item");

        if($li.hasClass("expanded")){
            $li.removeClass("expanded");
            $el.html("Expand");
        } else {
            $li.addClass("expanded");
            $el.html("Collapse");
        }
    });
});

function checkValidate(){
    var errs = [];

    $(".check-cont:not(.bool)").each(function(){
        var $cont = $(this);
        var type = $cont.data("type");
        var valid = validate(type);

        $cont.attr("data-valid", valid);
        if(valid===0) errs.push(type);
    });

    if(errs.length > 0){
        s = errs.length === 1 ? "" : "s";
        console.error("Invalid input"+s+"\nType"+s+": " + errs.join(", "));
    }

    return errs.length === 0;
}

function validate(type){
    var valid = 0;

    if(type=="title"){
        var v = $("#rule-title").val();
        valid = v.length > 0 && v.indexOf("#") == -1 ? 1 : 0;
    }

    else if(type=="thing-type"){
        var n = 0;
        $("input[name=thing-types]").each(function(){ n+= $(this).prop("checked") ? 1 : 0; });
        valid = n > 0 ? 1 : 0;
    }

    else if(type=="thing-domains"){
        if($("#tab-domains a.active").attr("data-tab")=="regex"){
            var v = $("#thing-domains-regex").val().trim();
            if(v == "") return 2;

            var n = 0;

            var arr = v.split(/\n/).map(Function.prototype.call, String.prototype.trim);
            arr.forEach(function(a,b){
                try { new RegExp(a); } catch(e) { n++ };
                valid = n === 0 ? 1 : 0;
            });
        } else {
            var n = 0;
            var v = $("#thing-domains").val().trim();
            if(v == "") return 2;

            var arr = v.split(",").map(Function.prototype.call, String.prototype.trim);
            arr.forEach(function(a,b){ if(!validateURL(a)) n++; });
            valid = n === 0 ? 1 : 0;
        }
    }

    else if(type=="thing-urls"){
        if($("#tab-urls a.active").attr("data-tab")=="regex"){
            var v = $("#thing-urls-regex").val().trim();
            if(v == "") return 2;

            var n = 0;

            var arr = v.split(/\n/).map(Function.prototype.call, String.prototype.trim);
            arr.forEach(function(a,b){
                try { new RegExp(a); } catch(e) { n++ };
                valid = n === 0 ? 1 : 0;
            });
        } else {
            var n = 0;
            var v = $("#thing-urls").val().trim();
            if(v == "") return 2;

            var arr = v.split(",").map(Function.prototype.call, String.prototype.trim);
            arr.forEach(function(a,b){ if(!validateURL(a)) n++; });
            valid = n === 0 ? 1 : 0;
        }
    }

    else if(type=="thing-titles"){
        if($("#tab-titles a.active").attr("data-tab")=="regex"){
            var v =$("#thing-titles-regex").val().trim();
            if(v =="") return 2;

            var n = 0;

            var arr = v.split(/\n/).map(Function.prototype.call, String.prototype.trim);
            arr.forEach(function(a,b){
                try { new RegExp(a); } catch(e) { n++ };
                valid = n === 0 ? 1 : 0;
            });
        } else {
            var n = 0;
            var v = $("#thing-titles").val().trim();
            if(v == "") return 2;

            var arr = v.split(",").map(Function.prototype.call, String.prototype.trim);
            arr.forEach(function(a,b){ if(!validateURL(a)) n++; });
            valid = n === 0 ? 1 : 0;
        }
    }

    else if(type=="thing-bodies"){
        if($("#tab-bodies a.active").attr("data-tab")=="regex"){
            var v =$("#thing-bodies-regex").val().trim();
            if(v =="") return 2;

            var n = 0;

            var arr = v.split(/\n/).map(Function.prototype.call, String.prototype.trim);
            arr.forEach(function(a,b){
                try { new RegExp(a); } catch(e) { n++ };
                valid = n === 0 ? 1 : 0;
            });
        } else {
            var n = 0;
            var v = $("#thing-bodies").val().trim();
            if(v == "") return 2;

            var arr = v.split(",").map(Function.prototype.call, String.prototype.trim);
            arr.forEach(function(a,b){ if(!validateURL(a)) n++; });
            valid = n === 0 ? 1 : 0;
        }
    }

    else if(type=="author-usernames"){
        if($("#tab-usernames a.active").attr("data-tab")=="regex"){
            var v = $("#author-usernames-regex").val().trim();
            if(v == "") return 2;

            var n = 0;

            var arr = v.split(/\n/).map(Function.prototype.call, String.prototype.trim);
            arr.forEach(function(a,b){
                try { new RegExp(a); } catch(e) { n++ };
                valid = n === 0 ? 1 : 0;
            });
        } else {
            var n = 0;
            var v = $("#author-usernames").val().trim();
            if(v == "") return 2;

            var arr = v.split(",").map(Function.prototype.call, String.prototype.trim);
            arr.forEach(function(a,b){ if(!validateURL(a)) n++; });
            valid = n === 0 ? 1 : 0;
        }
    }

    else if(type=="author-karma"){
        var v = $("#author-karma-value").val();
        if(v=="") return 2;

        valid = Number.isInteger(parseInt(v)) ? 1 : 0;
    }

    else if(type=="author-age"){
        var v = $("#author-age-value").val();
        if(v=="") return 2;

        valid = Number.isInteger(parseInt(v)) && parseInt(v) > 0 ? 1 : 0;
    }

    else if(type=="other-reports"){
        var v = $("#other-reports").val();
        if(v=="") return 2;
        valid = Number.isInteger(parseInt(v)) && parseInt(v) > 0 ? 1 : 0;
    }

    else if(type=="other-body-length"){
        var v = $("#other-body-length-value").val();
        if(v=="") return 2;
        valid = Number.isInteger(parseInt(v)) && parseInt(v) > 0 ? 1 : 0;
    }

    else if(type=="actions-action"){
        var v = $("#actions-action").val();
        if(v=="default") return 2;

        var a = ["approve", "remove", "spam", "filter", "report"];
        valid = $.inArray(v, a) > -1 ? 1 : 0;
    }

    else if(type=="actions-reason"){
        var v = $("#actions-reason").val();
        if(v.length < 1 || v == "" ) return 2;
        valid = v.length > 0 && v.indexOf("#") == -1 ? 1 : 0;
    }

    else if(type=="actions-comment"||type=="actions-modmail"||type=="actions-message"){
        var v = $("#"+type).val();
        if(v.length < 1 || v == "" ) return 2;
        valid = v.length > 0 ? 1 : 0;
    }

    else if(type=="actions-suggested"){
        var v = $("#actions-suggested").val();
        if(v=="default") return 2;
        valid = 1;
    }

    else if(type=="actions-flair"){
        var v = $("#actions-flair-text").val();
        if(v.length < 1 || v == "" ) return 2;
        valid = 1;
    }

    return valid;
}

function createRule(param){
    if(!checkValidate()) return false;

    var output = "";
    var conditions = [];
    var actions = [];
    var data = {};


    /* Conditions --------*/


    //title
    if($(".check-cont[data-type=title]").attr("data-valid")==0) return false;
    data.title = $("#rule-title").val();
    output += "# " + data.title + "\n";

    //type
    if($(".check-cont[data-type=thing-type]").attr("data-valid")==0) return false;
    data.type = {};
    data.type.link = $("#thing-type-link").prop("checked");
    data.type.text = $("#thing-type-text").prop("checked");
    data.type.comment = $("#thing-type-comment").prop("checked");

    output += "type: ";
    if(data.type.link&&data.type.text&&data.type.comment){ output += "both"; }
    else if (data.type.link&&data.type.text&&!data.type.comment) { output += "submission"; conditions.push("On <span class='badge badge-primary'>any submission</span>"); }
    else if (data.type.link&&!data.type.text&&!data.type.comment) { output += "link submission"; conditions.push("On a <span class='badge badge-primary'>link submission</span>"); }
    else if (!data.type.link&&data.type.text&&!data.type.comment) { output += "text submission"; conditions.push("On a <span class='badge badge-primary'>text submission</span>"); }
    else if (!data.type.link&&!data.type.text&&data.type.comment) { output += "comment"; conditions.push("On a <span class='badge badge-primary'>comment</span>"); }
    output += "\n";

    //domains
    if($(".check-cont[data-type=thing-domains]").attr("data-valid")==1){
        data.domains = {};
        output += $("#thing-domains-inverse").prop("checked") ? "~" : "";

        if($("#tab-domains a.active").attr("data-tab")=="regex"){
            data.domains.regex = $("#thing-domains-regex").val().trim().split(/\n/).map(Function.prototype.call, String.prototype.trim);
            output += "domain (regex): " + "[/"+data.domains.regex.join("/, /")+"/]";
            output += "\n";
            conditions.push("if the domain "+
                ($("#thing-domains-inverse").prop("checked") ? "<span class='badge badge-secondary'>is not</span> " : "")+
                "matches <span class='badge badge-primary'>"+data.domains.regex.length+" regular expression"+(data.domains.regex.length==1?"":"s")+"</span>");
        }

        else {
            data.domains.simple = $("#thing-domains").val().trim().split(",").map(Function.prototype.call, String.prototype.trim);
            output += "domain (includes): " + JSON.stringify(data.domains.simple);
            output += "\n";
            conditions.push("if the domain "+
                ($("#thing-domains-inverse").prop("checked") ? "<span class='badge badge-secondary'>is not</span> " : "")+
                "includes <span class='badge badge-primary'>"+data.domains.simple.length+" keyword"+(data.domains.simple.length==1?"":"s")+"</span>");
        }

        tmp = null;
    }

    //URLs
    if($(".check-cont[data-type=thing-urls]").attr("data-valid")==1){
        data.urls = {};
        output += $("#thing-urls-inverse").prop("checked") ? "~" : "";

        if($("#tab-urls a.active").attr("data-tab")=="regex"){
            data.urls.regex = $("#thing-urls-regex").val().trim().split(/\n/).map(Function.prototype.call, String.prototype.trim);
            output += "url (regex): " + "[/"+data.urls.regex.join("/, /")+"/]";
            output += "\n";
            conditions.push("if the URL "+
                ($("#thing-urls-inverse").prop("checked") ? "<span class='badge badge-secondary'>is not</span> " : "")+
                "matches <span class='badge badge-primary'>"+data.urls.regex.length+" regular expression"+(data.urls.regex.length==1?"":"s")+"</span>");
        }

        else {
            data.urls.simple = $("#thing-urls").val().trim().split(",").map(Function.prototype.call, String.prototype.trim);
            output += "url (includes): " + JSON.stringify(data.urls.simple);
            output += "\n";
            conditions.push("if the URL "+
                ($("#thing-urls-inverse").prop("checked") ? "<span class='badge badge-secondary'>is not</span> " : "")+
                "includes <span class='badge badge-primary'>"+data.urls.simple.length+" keyword"+(data.urls.simple.length==1?"":"s")+"</span>");
        }

        tmp = null;
    }

    //titles
    if($(".check-cont[data-type=thing-titles]").attr("data-valid")==1){
        data.titles = {};
        data.titles.matchtype = $("#thing-titles-matchtype").val();
        data.titles.casesensitive = $("#thing-titles-casesensitive").prop("checked");

        output += $("#thing-titles-inverse").prop("checked") ? "~" : "";
        output += "title (" + data.titles.matchtype + (data.titles.casesensitive ? ", case-sensitive" : "");

        if($("#tab-titles a.active").attr("data-tab")=="regex"){
            data.titles.regex = $("#thing-titles-regex").val().trim().split(/\n/).map(Function.prototype.call, String.prototype.trim);
            output += ", regex): " + "[/"+data.titles.regex.join("/, /")+"/]";
            output += "\n";
            conditions.push("if the title "+
                ($("#thing-titles-inverse").prop("checked") ? "<span class='badge badge-secondary'>is not</span> " : "")+
                "<span class='badge badge-secondary'>"+data.titles.matchtype+'</span> '+
                "<span class='badge badge-primary'>"+data.titles.regex.length+" regular expression"+(data.titles.regex.length==1?"":"s")+"</span> "+
                (data.titles.casesensitive ? "<span class='badge badge-secondary'>(case sensitive)</span>" : ""));
        }

        else {
            data.titles.simple = $("#thing-titles").val().trim().split(",").map(Function.prototype.call, String.prototype.trim);
            output += "): " + JSON.stringify(data.titles.simple);
            output += "\n";
            conditions.push("if the title "+
                ($("#thing-titles-inverse").prop("checked") ? "<span class='badge badge-secondary'>is not</span> " : "")+
                "<span class='badge badge-secondary'>"+data.titles.matchtype+'</span> '+
                "<span class='badge badge-primary'>"+data.titles.simple.length+" keyword"+(data.titles.simple.length==1?"":"s")+"</span> "+
                (data.titles.casesensitive ? "<span class='badge badge-secondary'>(case sensitive)</span>" : ""));
        }

        tmp = null;
    }

    //bodies
    if($(".check-cont[data-type=thing-bodies]").attr("data-valid")==1){
        data.bodies = {};
        data.bodies.matchtype = $("#thing-bodies-matchtype").val();
        data.bodies.casesensitive = $("#thing-bodies-casesensitive").prop("checked");

        output += $("#thing-bodies-inverse").prop("checked") ? "~" : "";
        output += "body (" + data.bodies.matchtype + (data.bodies.casesensitive ? ", case-sensitive" : "");

        if($("#tab-bodies a.active").attr("data-tab")=="regex"){
            data.bodies.regex = $("#thing-bodies-regex").val().trim().split(/\n/).map(Function.prototype.call, String.prototype.trim);
            output += ", regex): " + "[/"+data.bodies.regex.join("/, /")+"/]";
            output += "\n";
            conditions.push("if the body text "+
                ($("#thing-bodies-inverse").prop("checked") ? "<span class='badge badge-secondary'>is not</span> " : "")+
                "<span class='badge badge-secondary'>"+data.bodies.matchtype+'</span> '+
                "<span class='badge badge-primary'>"+data.bodies.regex.length+" regular expression"+(data.bodies.regex.length===1?"":"s")+"</span> "+
                (data.bodies.casesensitive ? "<span class='badge badge-secondary'>(case sensitive)</span>" : ""));
        }

        else {
            data.bodies.simple = $("#thing-bodies").val().trim().split(",").map(Function.prototype.call, String.prototype.trim);
            output += "): " + JSON.stringify(data.bodies.simple);
            output += "\n";
            conditions.push("if the body text "+
                ($("#thing-bodies-inverse").prop("checked") ? "<span class='badge badge-secondary'>is not</span> " : "")+
                "<span class='badge badge-secondary'>"+data.bodies.matchtype+'</span> '+
                "<span class='badge badge-primary'>"+data.bodies.simple.length+" keyword"+(data.bodies.simple.length===1?"":"s")+"</span> "+
                (data.bodies.casesensitive ? "<span class='badge badge-secondary'>(case sensitive)</span>" : ""));
        }

        tmp = null;
    }

    //author meta
    data.author = {};
    if($(".check-cont[data-type=author-usernames]").attr("data-valid")==1||$(".check-cont[data-type=author-karma]").attr("data-valid")==1||$(".check-cont[data-type=author-age]").attr("data-valid")==1){
        output += "author:\n";

        //author usernames
        if($(".check-cont[data-type=author-usernames]").attr("data-valid")==1){
            data.author.usernames = {};
            data.author.usernames.matchtype = $("#author-usernames-matchtype").val();

            output += "\t"+($("#author-usernames-inverse").prop("checked") ? "~" : "");
            output += "name (" + data.author.usernames.matchtype;

            if($("#tab-usernames a.active").attr("data-tab")=="regex"){
                data.author.usernames.regex = $("#author-usernames-regex").val().trim().split(/\n/).map(Function.prototype.call, String.prototype.trim);
                output += ", regex): " + "[/"+data.author.usernames.regex.join("/, /")+"/]";
                output += "\n";
                conditions.push("if the username "+
                    ($("#thing-usernames-inverse").prop("checked") ? "<span class='badge badge-secondary'>is not</span> " : "")+
                    "<span class='badge badge-secondary'>"+data.author.usernames.matchtype+'</span> '+
                    "<span class='badge badge-primary'>"+data.author.usernames.regex.length+" regular expression"+(data.author.usernames.regex.length==1?"":"s")+"</span>");
            }

            else {
                data.author.usernames.simple = $("#author-usernames").val().trim().split(",").map(Function.prototype.call, String.prototype.trim);
                output += "): " + JSON.stringify(data.author.usernames.simple);
                output += "\n";
                conditions.push("if the username "+
                    ($("#thing-usernames-inverse").prop("checked") ? "<span class='badge badge-secondary'>is not</span> " : "")+
                    "<span class='badge badge-secondary'>"+data.author.usernames.matchtype+'</span> '+
                    "<span class='badge badge-primary'>"+data.author.usernames.simple.length+" keyword"+(data.author.usernames.simple.length==1?"":"s")+"</span>");
            }

            tmp = null;

        }

        //author Karma
        if($(".check-cont[data-type=author-karma]").attr("data-valid")==1){
            data.author.karma = {};
            data.author.karma.logic = $("#author-karma-logic").val();
            data.author.karma.value = $("#author-karma-value").val();

            output += "\tcombined_karma: \""+data.author.karma.logic+" "+data.author.karma.value+"\"\n";
            conditions.push("if the author's karma is <span class='badge badge-primary'>"+data.author.karma.logic+" "+data.author.karma.value+"</span>");
        }

        //author age
        if($(".check-cont[data-type=author-age]").attr("data-valid")==1){
            data.author.age = {};
            data.author.age.logic = $("#author-age-logic").val();
            data.author.age.value = $("#author-age-value").val();

            output += "\taccount_age: \""+data.author.age.logic+" "+data.author.age.value+"\"\n";
            conditions.push("if the author's account age is <span class='badge badge-primary'>"+data.author.age.logic+" "+data.author.age.value+"</span>");
        }
    }

    //author bools
    data.author.is_gold = $("#author-type-gold").prop("checked");
    data.author.is_moderator = $("#author-type-mod").prop("checked");
    if(data.author.is_gold || data.author.is_moderator){
        if(data.author.is_gold){
            output += "is_gold: true\n";
            conditions.push("if the user <span class='badge badge-primary'>has reddit Gold</span>");
        }

        if(data.author.is_moderator){
            output += "is_moderator: true\n";
            conditions.push("if the user <span class='badge badge-primary'>is a moderator</span>");
        }

    }

    //other meta
    if($(".check-cont[data-type=other-reports]").attr("data-valid")==1){
        data.reports = $("#other-reports").val();
        output += "reports: "+parseInt(data.reports) + "\n";
        conditions.push("if it has received <span class='badge badge-primary'>"+data.reports+" reports</span>");
    }

    if($(".check-cont[data-type=other-body-length]").attr("data-valid")==1){
        data.body_length_logic = $("#other-body-length-logic").val();
        data.body_length_value = $("#other-body-length-value").val();

        output+= "body_"+data.body_length_logic+": "+parseInt(data.body_length_value)+"\n";
        conditions.push("if the <span class='badge badge-primary'>body_"+data.body_length_logic+"</span> is <span class='badge badge-primary'>"+data.body_length_value+"</span>");
    }

    if($("#other-oc").prop("checked")){
        data.original_content = true;
        output += "is_orignal_content: true\n";
        conditions.push("if the submission is marked as <span class='badge badge-primary'>OC</span>");
    }

    if($("#other-toplevel").prop("checked")){
        data.top_level = true;
        output += "is_top_level: true\n";
        conditions.push("if the comment is <span class='badge badge-primary'>top-level</span>");
    }

    /* Actions -----------*/

    //action
    if($(".check-cont[data-type=actions-action]").attr("data-valid")==1){
        data.action = $("#actions-action").val();
        output += "action: "+data.action+"\n";
        // actions.push("Take the following actions:");
        actions.push("mark the submission as <span class='badge badge-success'>"+data.action+"</span>");
    }

    //reason
    if($(".check-cont[data-type=actions-reason]").attr("data-valid")==1){
        data.reason = $("#actions-reason").val();
        output += "action_reason: " + JSON.stringify(data.reason) + "\n";
        actions.push("give a reason <span class='badge badge-success'>"+data.reason+"</span>");
    }

    //comment
    if($(".check-cont[data-type=actions-comment]").attr("data-valid")==1){
        data.comment = $("#actions-comment").val();
        data.comment_stickied = $("#actions-comment-sticky").prop("checked");

        var tmp = {};
        tmp.old = data.comment.split("\n");
        tmp.new = [];

        tmp.old.forEach(function(a,b){ tmp.new.push("\t\t"+a); });

        data.comment = tmp.new.join("\n");
        output += "comment: |\n" + data.comment + "\n";
        output += "comment_stickied: " + data.comment_stickied + "\n";
        actions.push("reply with <span class='badge badge-success'>a comment</span>");

        tmp = null;
    }

    //modmail
    if($(".check-cont[data-type=actions-modmail]").attr("data-valid")==1){
        data.modmail = $("#actions-modmail").val();
        data.modmail_subject = $("#actions-modmail-subject").val().trim().length > 0 ? $("#actions-modmail-subject").val().trim() : false;

        var tmp = {};
        tmp.old = data.modmail.split("\n");
        tmp.new = [];
        tmp.old.forEach(function(a,b){ tmp.new.push("\t\t"+a); });

        data.modmail = tmp.new.join("\n");
        if(data.modmail_subject) output += "modmail_subject: " + data.modmail_subject + "\n";
        output += "modmail: |\n" + data.modmail + "\n";
        actions.push("reply with <span class='badge badge-success'>a modmail</span>");

        tmp = null;
    }

    //message
    if($(".check-cont[data-type=actions-message]").attr("data-valid")==1){
        data.message = $("#actions-message").val();
        data.message_subject = $("#actions-message-subject").val().trim().length > 0 ? $("#actions-message-subject").val().trim() : false;

        var tmp = {};
        tmp.old = data.message.split("\n");
        tmp.new = [];
        tmp.old.forEach(function(a,b){ tmp.new.push("\t\t"+a); });

        data.message = tmp.new.join("\n");
        if(data.message_subject) output += "message_subject: " + data.message_subject + "\n";
        output += "message: |\n" + data.message + "\n";
        actions.push("reply with <span class='badge badge-success'>a message</span>");

        tmp = null;
    }

    //suggested sort
    if($(".check-cont[data-type=actions-suggested]").attr("data-valid")==1){
        data.set_suggested_sort = $("#actions-suggested").val();
        output += "set_suggested_sort: "+data.set_suggested_sort+"\n";
        actions.push("set the suggested sort to <span class='badge badge-success'>"+data.set_suggested_sort+"</span>");
    }

    //Flair
    if($(".check-cont[data-type=actions-flair]").attr("data-valid")==1){
        data.flair = {};
        data.flair.text = $("#actions-flair-text").val();
        data.flair.cssclass = $("#actions-flair-cssclass").val();
        data.flair.templateid = $("#actions-flair-templateid").val();

        output += "set_flair:\n";
        output += "\ttext: "+data.flair.text+"\n"
        if(data.flair.cssclass) output += "\tcss_class: " + data.flair.cssclass + "\n";
        if(data.flair.templateid) output += "\ttemplate_id: " + data.flair.templateid + "\n";

        actions.push("set flair to <span class='badge badge-success'>"+data.flair.text+"</span>");
    }

    //other actions
    if($("#actions-sticky").prop("checked")){
        data.set_sticky = true;
        output += "set_sticky: true\n";
        actions.push("mark the post as <span class='badge badge-success'>sticky</span>");
    }

    if($("#actions-nsfw").prop("checked")){
        data.set_nsfw = true;
        output += "set_nsfw: true\n";
        actions.push("mark the post as <span class='badge badge-success'>nsfw</span>");
    }

    if($("#actions-spoiler").prop("checked")){
        data.set_spoiler = true;
        output += "set_spoiler: true\n";
        actions.push("mark the post as <span class='badge badge-success'>spoiler</span>");
    }

    if($("#actions-contest").prop("checked")){
        data.set_contest_mode = true;
        output += "set_contest_mode: true\n";
        actions.push("mark the post as <span class='badge badge-success'>contest</span>");
    }

    if($("#actions-oc").prop("checked")){
        data.set_original_content = true;
        output += "set_original_content: true\n";
        actions.push("mark the post as <span class='badge badge-success'>oc</span>");
    }

    if($("#actions-locked").prop("checked")){
        data.set_locked = true;
        output += "set_locked: true\n";
        actions.push("mark the post as <span class='badge badge-success'>locked</span>");
    }

    var raw = {};
    $(".check-cont[data-valid='1']").each(function(){
        var $c = $(this);
        // raw[$c.attr("data-type")] = {};
        $c.find("input[data-check], textarea[data-check]").each(function(){
            var $i = $(this);

            if($i.is("select")){
                v = $i.val();
            } else if($i.attr("type")=="text"){
                v = $i.val();
            } else if($i.attr("type")=="number"){
                v = parseInt($i.val());
            } else if($i.attr("type")=="checkbox"){
                v = $i.prop("checked");
            } else v = "error";
            // raw[$c.attr("data-type")][$i.attr("id")] = v;
            raw[$i.attr("id")] = v;
        });
    });

    var id;
    if(param=="edit") id = $("#edit-rule").attr("data-id");
        else if(!id) id = 1;
        else id = 1;

    if(param!="edit") $("#rules li").each(function(){ if(id <= $(this).attr("data-id")) id = $(this).attr("data-id") + 1; });


    var output_summary = "<li class='list-group-item'>"+
                conditions.join("</li><li class='list-group-item'>")+
            "</li><li class='list-group-item'>"+
                (actions.length > 0 ? actions.join("</li><li class='list-group-item'>") : "take no action")+
            "</li>";

    var output_rule = '<li data-id="'+id+'" class="rules-item list-group-item list-group-item-action flex-column align-items-start expanded" data-raw=\''+encodeURI(JSON.stringify(raw))+'\'>'+
            '<div class="d-flex w-100 justify-content-between">'+
                '<h4>'+data.title+'</h5>'+
                '<small class="rule-meta-top"><span class="badge badge-primary">'+conditions.length+' condition'+(conditions.length===1 ? "" : "s")+'</span> <span class="badge badge-success">'+actions.length+' action'+(actions.length===1 ? "" : "s")+'</span></small>'+
            '</div>'+
            '<div class="row mb-1">'+
                "<div class='col-6 rule-output'><h5 class='mb-1'>YAML</h5><pre>---\n"+output+'</pre></div>'+
                '<ul class="col-6 rule-summary list-group small"><h5 class="mb-1">Summary</h5>'+output_summary+'</ul>'+
            '</div>'+
            '<small class="rule-meta-bot"><span class="btn-expand">Expand</span> | <span class="btn-edit">Edit</span> | Delete | Export | Save As Template</small>'+
        '</li>';

        //

    if(param=="edit") $("#rules li[data-id="+id+"]").replaceWith(output_rule);
        else $("#rules").append(output_rule);
    $('#modal-new-rule').modal('hide');
    refreshRules();
}

function refreshRules(){
    suspend = true;
    $(".check-cont input, .check-cont textarea").val("");
    $(".check-cont select").each(function(){ $(this).val($(this).find("option:first").val()); });
    $(".check-cont checkbox").prop("checked", false);
    $("#thing-type-link, #thing-type-text").prop("checked",true);
    $("[data-role=tagsinput]").tagsinput('removeAll');
    suspend = false;
    checkValidate();
}


function validateURL(str) {
    var pattern = new RegExp('^(?:[\w-]+\.)*([\w-]{1,63})(?:\.(?:\w{3}|\w{2}))(?:$|\/)/i$','i');
    return !pattern.test(str);
}
