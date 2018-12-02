$(function(){
//     $("#rules").append('<li data-id="12345" class="rules-item list-group-item list-group-item-action flex-column align-items-start expanded" data-raw="%7B%22rule-title%22:%22Test%20Spam%20Rule%22,%22thing-type-link%22:true,%22thing-type-text%22:true,%22thing-type-comment%22:false,%22thing-domains-inverse%22:false,%22thing-domains%22:%22bit.ly%22,%22thing-domains-regex%22:%22error%22,%22thing-titles-inverse%22:false,%22thing-titles-casesensitive%22:false,%22thing-titles%22:%22spam%22,%22thing-titles-regex%22:%22error%22,%22thing-bodies-inverse%22:false,%22thing-bodies-casesensitive%22:false,%22thing-bodies%22:%22spam,spambot%22,%22thing-bodies-regex%22:%22error%22,%22author-usernames-inverse%22:false,%22author-usernames%22:%22spambot%22,%22author-usernames-regex%22:%22error%22,%22author-karma-value%22:10,%22actions-reason%22:%22Spam%20Detection%22,%22actions-flair-text%22:%22Spammed%22,%22actions-flair-cssclass%22:%22spam_flair%22,%22actions-flair-templateid%22:%2208960892736450%22%7D"><div class="d-flex w-100 justify-content-between"><h4>Test Spam Rule</h4><small class="rule-meta-top"><span class="badge badge-primary">6 conditions</span> <span class="badge badge-success">2 actions</span></small></div><div class="row mb-1"><div class="col-6 rule-output"><h5 class="mb-1">YAML</h5><pre>---'+
// '# Test Spam Rule'+"\n"+
// 'type: submission'+"\n"+
// 'domain (includes): ["bit.ly"]'+"\n"+
// 'title (includes-word): ["spam"]'+"\n"+
// 'body (includes-word): ["spam","spambot"]'+"\n"+
// 'author:'+"\n"+
// '	name (includes-word): ["spambot"]'+"\n"+
// '	combined_karma: "&gt; 10"'+"\n"+
// 'action_reason: "Spam Detection"'+"\n"+
// 'set_flair:'+"\n"+
// '	text: Spammed'+"\n"+
// '	css_class: spam_flair'+"\n"+
// '	template_id: 08960892736450'+"\n"+
// '</pre></div><ul class="col-6 rule-summary list-group small"><h5 class="mb-1">Summary</h5><li class="list-group-item">On <span class="badge badge-primary">any submission</span></li><li class="list-group-item">if the domain includes <span class="badge badge-primary">1 keyword</span></li><li class="list-group-item">if the title <span class="badge badge-secondary">includes-word</span> <span class="badge badge-primary">1 keyword</span> </li><li class="list-group-item">if the body text <span class="badge badge-secondary">includes-word</span> <span class="badge badge-primary">2 keywords</span> </li><li class="list-group-item">if the username <span class="badge badge-secondary">includes-word</span> <span class="badge badge-primary">1 keyword</span></li><li class="list-group-item">if the author\'s karma is <span class="badge badge-primary">&gt; 10</span></li><li class="list-group-item">give a reason <span class="badge badge-success">Spam Detection</span></li><li class="list-group-item">set flair to <span class="badge badge-success">Spammed</span></li></ul></div><small class="rule-meta-bot"><span class="btn-expand">Collapse</span> | <span class="btn-edit">Edit</span> | Delete | Export | Save As Template</small></li>');
});
