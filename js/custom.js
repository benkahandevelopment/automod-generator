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
        post
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

    var navListItems = $('div.setup-panel div a'),
        allWells = $('.setup-content'),
        allNextBtn = $('.setup-btn');

    allWells.hide();

    navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
            $item = $(this);

        if (!$item.attr('disabled')) {
            navListItems.removeClass('btn-primary').addClass('btn-default');
            $item.addClass('btn-primary');
            allWells.hide();
            $target.show();
            $target.find('input:eq(0)').focus();
        }
    });

    allNextBtn.click(function(){
        if($(this).attr("disabled")) return false;

        var curStep = $(this).closest(".setup-content"),
            curStepBtn = curStep.attr("id"),
            nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
            isValid = true;

        //validity checks here
        isValid = validateStep(curStepBtn);

        //remove existing errors
        // $(".form-group").removeClass("has-error");

        //iterate and do checks
        // for(var i=0; i<curInputs.length; i++){
        //     if (!curInputs[i].validity.valid){
        //         isValid = false;
        //         $(curInputs[i]).closest(".form-group").addClass("has-error");
        //     }
        // }

        if (isValid)
            nextStepWizard.removeAttr('disabled').trigger('click');
    });

    $('div.setup-panel div a.btn-primary').trigger('click');
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

    /*
    step 1
     */
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

    /*
    end code for setup modal
    */

    $(".setup-selection").click(function(){
        $(".setup-selection").removeClass("active");
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

    $(".new-condition-modal").click(function(){ $("#modal-new-condition").modal("show"); })
});

function validateStep(step){
    var step = step.split("-"),
        type = step[0],
        num = step[step.length-1];

    if(type=="condition"){
        if(num==1){
            //condition-step-1
            return $(".setup-selection.active").length > 0;
        } if(num==2){
            //condition-step-2
            var v = $(".check-cont:visible").first().attr("data-type");

            if(v=="search"){
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

                console.log(id);

                if(id == "post-reports" || id == "post-length")
                    return validateField("int", $("#" + id + "-value").val().trim());
                else if(id == "post-oc" || id == "post-toplevel")
                    return $("#" + id).prop("checked");
                else
                    return false;
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
    }

    else if(type=="simple"){
        if(v=="")
            return false;
    }

    else if(type=="posint"){
        return Number.isInteger(parseInt(v)) && parseInt(v) > 0;
    }

    else if(type=="int"){
        return Number.isInteger(parseInt(v));
    }

}
