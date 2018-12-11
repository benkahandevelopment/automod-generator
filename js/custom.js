/* Custom JS */
var suspend = false;

$(function(){

    /*
    REFERENCE ----
    on list
        title
        type

    conditions
        search
          domain
          url
          title
          body
          username
        author meta
          karma
          age
          gold
          moderator
        post/comment meta
          reports
          body length
          oc
          top level only

    actions
        moderate
          action
          reason
          sort
          flair
        announce
          comment
          modmail
          message
     */

    /*
     code for setup modal
     */

    var navListItems_c = $('#modal-new-condition .setup-panel div a'),
        allWells_c = $('#modal-new-condition .setup-content'),
        allNextBtn_c = $('#modal-new-condition .setup-btn');

    allWells_c.hide();

    navListItems_c.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
            $item = $(this);

        if (!$item.attr('disabled')) {
            navListItems_c.removeClass('btn-primary').addClass('btn-default');
            $item.addClass('btn-primary');
            allWells_c.hide();
            $target.show();
            $target.find('input:eq(0)').focus();
        }
    });

    allNextBtn_c.click(function(){
        if($(this).attr("disabled")) return false;

        var curStep = $(this).closest(".setup-content"),
            curStepBtn = curStep.attr("id"),
            nextStepWizard = $('#modal-new-condition .setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
            isValid = validateStep(curStepBtn);

        if (isValid)
            nextStepWizard.removeAttr('disabled').trigger('click');
    });

    var navListItems_a = $('#modal-new-action .setup-panel div a'),
        allWells_a = $('#modal-new-action .setup-content'),
        allNextBtn_a = $('#modal-new-action .setup-btn');

    allWells_a.hide();

    navListItems_a.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
            $item = $(this);

        if (!$item.attr('disabled')) {
            navListItems_a.removeClass('btn-primary').addClass('btn-default');
            $item.addClass('btn-primary');
            allWells_a.hide();
            $target.show();
            $target.find('input:eq(0)').focus();
        }
    });

    allNextBtn_a.click(function(){
        if($(this).attr("disabled")) return false;

        var curStep = $(this).closest(".setup-content"),
            curStepBtn = curStep.attr("id"),
            nextStepWizard = $('#modal-new-action .setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
            isValid = validateStep(curStepBtn);

        if (isValid)
            nextStepWizard.removeAttr('disabled').trigger('click');
    });

    $('#modal-new-condition .setup-panel div a.btn-primary').trigger('click');
    $('#modal-new-action .setup-panel div a.btn-primary').trigger('click');
    $("#search-input-regex-cont").hide();

    $("[data-check]").on('class-change', function(){
        var curStep = $(this).closest(".setup-content"),
            curStepBtn = curStep.attr("id"),
            nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
            isValid = validateStep(curStepBtn);

        if(isValid) {
            curStep.find(".setup-btn").first().removeAttr("disabled");
        } else {
            curStep.find(".setup-btn").first().attr("disabled",true);
        }
    });

    $("[data-check]").change(function(){
        var curStep = $(this).closest(".setup-content"),
            curStepBtn = curStep.attr("id"),
            nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
            isValid = validateStep(curStepBtn);

        if(isValid) {
            curStep.find(".setup-btn").first().removeAttr("disabled");
        } else {
            curStep.find(".setup-btn").first().attr("disabled",true);
        }
    })

    $(".match-domain").change(function(){
        var checked = [];
        $(".match-domain").each(function(){
            if($(this).prop("checked")) checked.push($(this).attr("id").split("-")[1]);
        });

        if(checked.includes("domain")||
            checked.includes("url")||
            checked.includes("username")) $("#search-casesensitive").attr("disabled", true).parent().addClass("d-none");
            else $("#search-casesensitive").removeAttr("disabled").parent().removeClass("d-none");
    });

    $("#search-regex").change(function(){
        if($(this).prop("checked")) { $("#search-input-simple-cont").hide(); $("#search-input-regex-cont").show(); }
            else { $("#search-input-simple-cont").show(); $("#search-input-regex-cont").hide(); }
    });

    $(".check-cont:visible [data-check]").change(function(){
        var $el = $(this).closest(".setup-content");

        if(validateStep($el.attr("id")))
            $el.find(".setup-btn").first().removeAttr("disabled");
        else
            $el.find(".setup-btn").first().attr("disabled", true);
    });

    $(".finishBtn:not(disabled)").click(function(){
        var type = $(this).attr("data-btn-type"),
            $o = $(".rules-item2[data-id="+$(this).attr("data-id")+"] ul.rule-"+$(this).attr("data-btn-type")+"s"),
            t = "",
            data = {};

        if(type=="condition"){
            //type
            var type = $("#modal-new-condition .setup-selection.active").first().parent().attr("data-selection");

            if(type=="search"){
                data.search = {};

                //match
                data.search.matches = [];
                $("[data-selection=match] input[type=checkbox]").each(function(){
                    if(($(this)).prop("checked")) data.search.matches.push($(this).attr("id").split("-")[1]);
                });
                t += "<span class='badge badge-primary'>" + data.search.matches.join("</span>, <span class='badge badge-primary'>") + "</span> ";

                //matchtype/inverse/regex
                data.search.inverse = $("#search-inverse").prop("checked");
                if(data.search.inverse === true) t += "<span class='badge badge-danger'>don't</span> ";
                data.search.matchtype = $("#search-matchtype").val();
                t += "<span class='badge badge-primary'>" + data.search.matchtype + "</span> ";
                data.search.regex = $("#search-regex").prop("checked");

                //keywords
                if(data.search.regex === true) data.search.keywords = $("#search-input-regex").val().trim().split(/\n/).map(Function.prototype.call, String.prototype.trim);
                    else data.search.keywords = $("#search-input-simple").val().trim().split(",").map(Function.prototype.call, String.prototype.trim);

                t += "<span class='badge badge-primary'>" + data.search.keywords.length + " keyword" + s(data.search.keywords.length)  + "</span> ";
                if(data.search.regex === true) t += "<span class='badge badge-primary'>RegEx</span> ";

                //casesensitive
                data.search.casesensitive = !data.search.regex && $("#search-casesensitive").prop("checked");
                if(data.search.casesensitive === true) t += "<span class='badge badge-primary'>Case Sensitive</span> ";

            }

            else if(type=="author"){
                data.author = {};

                //match
                data.author.match = $("#author-selection li.active:first").attr("data-selection").split("-").slice(1).join("-");

                if(data.author.match=="karma"){
                    data.author.logic = $("#author-karma-logic").val();
                    data.author.value = $("#author-karma-value").val();
                } else if(data.author.match=="age"){
                    data.author.logic = $("#author-age-logic").val();
                    data.author.value = $("#author-age-value").val();
                }

                if(data.author.match=="karma" || data.author.match=="age"){
                    t += "submission author's <span class='badge badge-primary'>" + data.author.match + "</span> ";
                    t += "is <span class='badge badge-secondary'>";
                    if(data.author.logic==">") t += "greater than";
                    if(data.author.logic==">=") t += "greater than or equal to";
                    if(data.author.logic=="<=") t += "less than";
                    if(data.author.logic=="<") t += "less than or equal to";
                    t += "</span> <span class='badge badge-warning'>"+data.author.value+"</span> ";
                } else if(data.author.match=="type-gold"){
                    t += "submission author <span class='badge badge-primary'>has reddit gold</span> ";
                } else if(data.author.match=="type-mod"){
                    t += "submission author <span class='badge badge-primary'>is a moderator of this sub</span> ";
                }
            }

            else if(type=="post"){
                data.post = {};

                //match
                data.post.match = $("#post-selection li.active:first").attr("data-selection").split("-")[1];

                if(data.post.match == "length"){
                    data.post.logic = $("#post-length-logic").val();
                    data.post.value = $("#post-length-value").val();

                    t += "submission <span class='badge badge-primary'>text length</span> is <span class='badge badge-secondary'>";
                    if(data.post.logic==">") t += "greater than";
                        else if(data.post.logic==">=") t += "greater than or equal to";
                        else if(data.post.logic=="<=") t += "less than";
                        else if(data.post.logic=="<") t += "less than or equal to";
                    t += "</span> <span class='badge badge-warning'>"+data.post.value+"</span> ";
                } else if(data.post.match=="reports"){
                    data.post.value = $("#post-reports-value").val();
                    t += "submission has recevied <span class='badge badge-primary'>"+data.post.value+"+ reports</span> ";
                } else if(data.post.match=="oc"){
                    t += "submission is a post marked as <span class='badge badge-primary'>Original Content</span> ";
                } else if(data.post.match=="toplevel"){
                    t += "submission is a <span class='badge badge-primary'>top-level comment</span> ";
                }
            }
        } else if(type=="action"){
            //types
            var type = $("#modal-new-action .setup-selection.active").first().parent().attr("data-selection");

            if(type=="moderate"){
                data.moderate = {};

                //match
                data.moderate.match = $("#moderate-selection li.active:first").attr("data-selection").split("-").slice(1).join("-");

                if(data.moderate.match == "action"){
                    data.moderate.action = $("#moderate-action").val();
                    t += "<span class='badge badge-primary'>"+data.moderate.action+"</span> the submission ";
                    if(validateField("simple", $("#moderate-action-reason").val())){
                        data.moderate.reason = $("#moderate-action-reason").val();
                        t += "with a <span class='badge badge-warning'>reason</span> ";
                    }
                }

                else if(data.moderate.match == "sort"){
                    data.moderate.sort = $("#moderate-sort").val();
                    t += "set the post's suggested sort to <span class='badge badge-primary'>" + data.moderate.sort + "</span> ";
                }

                else if(data.moderate.match == "flair"){
                    data.moderate.flair = $("#moderate-flair-text").val();
                    if(validateField("simple", $("#moderate-flair-cssclass").val())) data.moderate.cssclass = $("#moderate-flair-cssclass").val();
                    if(validateField("simple", $("#moderate-flair-templateid").val())) data.moderate.templateid = $("#moderate-flair-templateid").val();
                    t += "set the flair to <span class='badge badge-primary'>"+data.moderate.flair+"</span> ";
                }

                else if(data.moderate.match == "other"){
                    n = 0;
                    if($("#moderate-other-sticky").prop("checked")==true) { data.moderate.sticky = true; n++; }
                    if($("#moderate-other-nsfw").prop("checked")==true) { data.moderate.nsfw = true; n++; }
                    if($("#moderate-other-spoiler").prop("checked")==true) { data.moderate.spoiler = true; n++; }
                    if($("#moderate-other-contest").prop("checked")==true) { data.moderate.contest = true; n++; }
                    if($("#moderate-other-oc").prop("checked")==true) { data.moderate.oc = true; n++; }
                    if($("#moderate-other-locked").prop("checked")==true) { data.moderate.locked = true; n++; }

                    t += "set <span class='badge badge-secondary'>"+n+"</span> post settings ";
                }
            }

            else if(type=="message"){
                data.message = {};

                // match
                data.message.match = $("#message-selection li.active:first").attr("data-selection").split("-").slice(1).join("-");

                if(data.message.match == "comment"){
                    data.message.value = $("#message-comment").val();
                    t += "send a <span class='badge badge-primary'>comment reply</span> ";
                }

                else if(data.message.match == "message"){
                    data.message.value = $("#message-message").val();
                    if(validateField("simple", $("#message-message-subject").val())) data.message.subject = $("#message-message-subject").val();
                    t += "send a <span class='badge badge-primary'>message to the user</span>";
                }

                else if(data.message.match == "modmail"){
                    data.message.value = $("#message-modmail").val();
                    if(validateField("simple", $("#message-modmail-subject").val())) data.message.subject = $("#message-modmail-subject").val();
                    t += "send a <span class='badge badge-primary'>message to modmail</span>";
                }
            }
        }

        //save
        $o.append("<li class='rule-condition' data-raw=\""+encodeURI(JSON.stringify(t))+"\">"+t+"</li>");
        $("#modal-new-"+$(this).attr("data-btn-type")).modal('hide');
    })

    /*
   code for list
   */

    $("[data-type-btn]").click(function(){
        var $el = $(this).closest("li.rules-item2"),
            o = [];

        if($(this).hasClass("btn-success")){
            if($el.find("[data-type-btn].btn-success").length === 1) return false;
                else $(this).removeClass("btn-success").addClass("btn-secondary");
        } else {
            $(this).removeClass("btn-secondary").addClass("btn-success");
        }

        $el.find("[data-type-btn].btn-success").each(function(){
            o.push($(this).attr("data-type-btn")+"s");
        });

        $el.find(".search-label").html(o.length < 3 ? o.join(" and ") : o[0]+", "+o[1]+" and "+o[2]);
    });

    /*
    Other
     */

    $(".setup-selection").click(function(){
        $(this).parent().parent().find(".setup-selection").removeClass("active");
        $(this).addClass("active");
        $(this).trigger('class-change');

        if($(this).parent().attr("data-selection")){
            $(".modal-body[data-selection-content]").addClass("d-none");
            $(".modal-body[data-selection-content='"+$(this).parent().attr("data-selection")+"']").removeClass("d-none");
        }
    });

    $(".setup-overview li").click(function(){
        var id = $(this).parent().attr("id")
            cont = $(this).parent().attr("data-cont");

        $("#" + id + " li").removeClass("active");
        $(this).addClass("active");

        $("." + cont).addClass("d-none");
        $("#" + $(this).attr("data-selection") + "-cont").removeClass("d-none");

        $("." + cont + ":first [data-check]:first").trigger("change");
    });

    $(".new-condition-modal").click(function(){
        $(".finishBtn[data-btn-type=condition]").attr("data-id", $(this).closest(".rules-item2").attr("data-id"));
        allWells_c.hide();
        $("#modal-new-condition #condition-step-1").show();
        $("#modal-new-condition").modal("show");
    });

    $(".new-action-modal").click(function(){
        $(".finishBtn[data-btn-type=action]").attr("data-id", $(this).closest(".rules-item2").attr("data-id"));
        allWells_a.hide();
        $("#modal-new-action #action-step-1").show();
        $("#modal-new-action").modal("show");
    });
});

function validateStep(step){
    var step = step.split("-"),
        type = step[0],
        num = step[step.length-1];

    if(type=="condition"){
        if(num==1){
            //condition-step-1
            return $("#modal-new-condition .setup-selection.active").length > 0;
        } if(num==2){
            //condition-step-2
            var v = $(".check-cont:visible").first().attr("data-type");

            if(v=="search"){
                var s = false;

                $("[data-selection=match] input[type=checkbox]").each(function(){
                    if($(this).prop("checked")) s = true;
                });

                if(!s) return false;

                return ($("#search-regex").prop("checked")==true)
                    ? validateField("regex", $("#search-input-regex").val())
                    : validateField("simple", $("#search-input-simple").val());
            }

            else if(v=="author"){
                var $el = $(".author-cont:visible").first(),
                    id = $el.attr("id").split("-").slice(0,-1).join("-");

                if(id == "author-karma")
                    return validateField("int", $("#" + id + "-value").val().trim());
                else if(id == "author-age")
                    return validateField("posint", $("#" + id + "-value").val().trim());
                else if(id == "author-type-gold" || id == "author-type-mod")
                    return $("#" + id ) .prop("checked");
                else
                    return false;
            }

            else if(v=="post"){
                var $el = $(".post-cont:visible").first(),
                    id = $el.attr("id").split("-").slice(0,-1).join("-");

                if(id == "post-reports" || id == "post-length")
                    return validateField("int", $("#" + id + "-value").val().trim());
                else if(id == "post-oc" || id == "post-toplevel")
                    return $("#" + id).prop("checked");
                else
                    return false;
            }
        }

    } else if(type=="action"){
        if(num==1){
            // action-step-1
            return $("#modal-new-action .setup-selection.active").length > 0;
        }

        else if(num==2){
            // action-step-2
            var v = $(".check-cont:visible").first().attr("data-type");

            if(v=="moderate"){
                var $el = $(".moderate-cont:visible").first(),
                    id = $el.attr("id").split("-").slice(0,-1).join("-");

                if(id == "moderate-action")
                    return $("#moderate-action").val()!="default";
                else if(id == "moderate-sort")
                    return $("#moderate-sort").val()!="default";
                else if(id == "moderate-flair")
                    return validateField("simple", $("#moderate-flair-text").val());
                else if(id == "moderate-other")
                    return ($("#moderate-other-sticky").prop("checked") ||
                            $("#moderate-other-nsfw").prop("checked") ||
                            $("#moderate-other-spoiler").prop("checked") ||
                            $("#moderate-other-contest").prop("checked") ||
                            $("#moderate-other-oc").prop("checked") ||
                            $("#moderate-other-locked").prop("checked"));
                else return false;
            }

            else if(v == "message") {
                var $el = $(".message-cont:visible").first(),
                    id = $el.attr("id").split("-").slice(0,-1).join("-");

                if(id == "message-comment")
                    return validateField("simple", $("#message-comment").val());
                else if(id == "message-message")
                    return validateField("simple", $("#message-message").val());
                else if(id == "message-modmail")
                    return validateField("simple", $("#message-modmail").val());
                else return false;
            }
        }
    }
}

function validateField(type, val){
    var v = val.trim();

    if(type=="regex"){
        if(v=="")
            return false;
        v.split(/\n/).map(Function.prototype.call, String.prototype.trim).forEach(function(a,b){
            try { new RegExp(a); } catch(e) {return false };
        });

        return true;
    }

    else if(type=="simple"){
        return v!=="";
    }

    else if(type=="posint"){
        return Number.isInteger(parseInt(v)) && parseInt(v) > 0;
    }

    else if(type=="int"){
        return Number.isInteger(parseInt(v));
    }

}

function s(n){
    return parseInt(n) != 1 ? "s" : "";
}
