/* Custom JS */
$(function(){
    $("[data-check]").change(function(){ createRule(); });
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) { createRule(); });
    $("#modal-new-rule").on('shown.bs.modal', function(){ createRule(); });
    $("#add-rule").click(function(){ createRule(); });
});

function checkValidate(){
    var errs = [];

    $(".check-cont").each(function(){
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
            var v = $("#thing-urls").val().trim();
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

    else if(type=="author-username"){
        if($("#tab-usernames a.active").attr("data-tab")=="regex"){
            var v = $("#author-usernames-complex").val().trim();
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

    return valid;
}

function createRule(){
    if(!checkValidate()) return false;

    var output = "";
    var conditions = [];
    var data = {};

    //title
    if($(".check-cont[data-type=title]").attr("data-valid")==0) return false;
    data.title = $("input[name=title]").val();
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
        output += $("#thing-urls-inverse").prop("checked") ? "~" : "";

        if($("#tab-domains a.active").attr("data-tab")=="regex"){
            data.domains.regex = $("#thing-urls").val().trim().split(/\n/).map(Function.prototype.call, String.prototype.trim);
            output += "domain (regex): " + "[/"+data.domains.regex.join("/, /")+"/]";
            output += "\n";
            conditions.push("on domains that match <span class='badge badge-primary'>"+data.domains.regex.length+" regular expression"+(data.domains.regex.length==1?"":"s")+"</span>");
        }

        else {
            data.domains.simple = $("#thing-domains").val().trim().split(",").map(Function.prototype.call, String.prototype.trim);
            output += "domain (includes): " + JSON.stringify(data.domains.simple);
            output += "\n";
            conditions.push("on domains that include <span class='badge badge-primary'>"+data.domains.simple.length+" keyword"+(data.domains.simple.length==1?"":"s")+"</span>");
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
            console.log(data.titles.regex);
            output += ", regex): " + "[/"+data.titles.regex.join("/, /")+"/]";
            output += "\n";
            conditions.push("with titles that match <span class='badge badge-primary'>"+data.titles.regex.length+" regular expression"+(data.titles.regex.length==1?"":"s")+"</span>");
        }

        else {
            data.titles.simple = $("#thing-titles").val().trim().split(",").map(Function.prototype.call, String.prototype.trim);
            output += "): " + JSON.stringify(data.titles.simple);
            output += "\n";
            conditions.push("with titles that include <span class='badge badge-primary'>"+data.titles.simple.length+" keyword"+(data.titles.simple.length==1?"":"s")+"</span>");
        }

        tmp = null;
    }

    //bodies
    if($(".check-cont[data-type=thing-bodies]").attr("data-valid")==1){
        data.bodies = {};
        data.bodies.matchtype = $("#thing-bodies-matchtype").val();
        data.bodies.casesensitive = $("#thing-bodies-casesensitive").prop("checked");

        output += $("#thing-bodies-inverse").prop("checked") ? "~" : "";
        output += "title (" + data.bodies.matchtype + (data.bodies.casesensitive ? ", case-sensitive" : "");

        if($("#tab-bodies a.active").attr("data-tab")=="regex"){
            data.bodies.regex = $("#thing-bodies-regex").val().trim().split(/\n/).map(Function.prototype.call, String.prototype.trim);
            output += ", regex): " + "[/"+data.bodies.regex.join("/, /")+"/]";
            output += "\n";
            conditions.push("whose body texts match <span class='badge badge-primary'>"+data.bodies.regex.length+" regular expression"+(data.bodies.regex.length===1?"":"s")+"</span>");
        }

        else {
            data.bodies.simple = $("#thing-bodies").val().trim().split(",").map(Function.prototype.call, String.prototype.trim);
            output += "): " + JSON.stringify(data.bodies.simple);
            output += "\n";
            conditions.push("whose body texts contain <span class='badge badge-primary'>"+data.bodies.simple.length+" keyword"+(data.bodies.simple.length===1?"":"s")+"</span>");
        }

        tmp = null;
    }

    $("#summary").html(conditions.join("&nbsp;"));
    console.log(output);
}


function validateURL(str) {
    var pattern = new RegExp('^(?:[\w-]+\.)*([\w-]{1,63})(?:\.(?:\w{3}|\w{2}))(?:$|\/)/i$','i');
    return !pattern.test(str);
}