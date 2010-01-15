var parameter_id              = 0;
var parameter_context         = {kContextPost:'parameters_post', kContextPut:'parameters_put'}
var category_context          = {kCategoryNew:1, kCategoryExisting:2}
var current_parameter_context = null;
var current_category_context  = category_context.kCategoryExisting;
var database                  = {};

$(function()
{
	database = database_initialize();
	database_reset();
	database_setup();
	database_categories_refresh();
	
	$('#btn_add_headers').bind('click', headers_add);
	$('#btn_send').bind('click', action_submit);
	$("#inputVerb").bind('change', method_change)
	$('#btn_add_parameters').bind('click', parameters_post_add);
	$('#inputParametersRaw').bind('click', parameters_post_raw);
	$("input[name='inputAuthorization']").bind('change', authorization_change);
	$('#btn_new_category').bind('click', local_new_category)
	$('#btn_save_request').bind('click', local_save_request)
	
});

function method_change()
{
	var method = $("#inputVerb").val()
	switch(method)
	{
		case 'POST':
			parameters_show_post();
			break;
		
		case 'PUT':
			parameters_show_put();
			break;
		
		default:
			parameters_show_default();
			break;
	}
}

function authorization_change()
{
	var type = $("input[name='inputAuthorization']:checked").val();
	switch(type)
	{
		case 'none':
			authorization_show_default();
			break;
		
		case 'basic':
			authorization_show_basic();
			break;
		
		case 'custom':
			authorization_show_custom();
			break;
	}
}

function action_submit()
{
	var request = new WDRequest();
	
	request.endpoint         = $("#inputUrl").val();
	request.method           = $("#inputVerb").val();
	request.port             = $("#inputPort").val();
	var authorizationContext = $("input[name='inputAuthorization']:checked").val(); 
	switch(authorizationContext)
	{
		case 'none':
			break;
		
		case 'basic':
			request.headers.push(authorization_basic());
			break;
		
		case 'custom':
			request.headers.push(authorization_custom());
			break;
	}
	
	headers_collect_custom(request);
	parameters_collect_custom(request);
	action_connect(request);
}

function action_connect(request)
{
	var params = null;
	var url    = null;
	
	if(request.endpoint.indexOf('?') > 0)
	{
		request.query_string = request.endpoint.substr(request.endpoint.indexOf('?')+1);
		request.endpoint     = request.endpoint.substr(0, request.endpoint.indexOf('?'));
		
		url = "http://witchdoctor/application/system/witchdoctor.php?endpoint="+encodeURIComponent(request.endpoint)+"&port="+request.port+"&params="+encodeURIComponent(request.query_string);
	}
	else
	{
		url = "http://witchdoctor/application/system/witchdoctor.php?endpoint="+encodeURIComponent(request.endpoint)+"&port="+request.port;
	}
	
	
	var transfer = {
		type:request.method,
		url:url,
		dataType:'json',
		data:request.data,
		success:action_complete,
		error:action_error,
		beforeSend:function(xhrObj) { action_prepeare_headers(xhrObj, request) }
	}
	
	$.ajax(transfer)
	
}

function action_prepeare_headers(xhrObj, request)
{
	if(request.headers.length > 0)
	{
		request.headers.forEach(function(item)
		{
			xhrObj.setRequestHeader("X-WitchDoctor-"+item.name, item.value);
		})
	}
}

function action_complete(data, textStatus)
{
	//console.log(data);
	var template = {};
	template.body = data.response.body;
	template.response_headers = data.response.headers.join('\n');
	template.request_headers = data.request.info.request_header+"\r\n"+data.request.body;
	
	var html = Mustache.to_html(WDTemplates.response, template);
	$('.response .context').html(html);
	$('#btn_response').bind('click', action_show_response);
	$('#btn_request').bind('click', action_show_request);
}

function action_error(XMLHttpRequest, textStatus, errorThrown)
{
	console.log(textStatus);
	console.log(errorThrown);
	console.log(XMLHttpRequest.responseText)
	var html = Mustache.to_html(WDTemplates.response_error, {});
	$('.response .context').html(html);
}

function action_show_response()
{
	$('.request-details').hide();
	$('.response-details').show();
	return false;
}

function action_show_request()
{
	$('.request-details').show();
	$('.response-details').hide();
	return false;
}
