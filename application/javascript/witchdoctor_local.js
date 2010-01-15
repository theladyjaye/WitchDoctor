function local_show_save(sender)
{
	local_hide_load();
	$('.storage .storage-save').show();
	return false;
}

function local_show_load(sender)
{
	local_hide_save();
	$('.storage .storage-load').show();
	return false;
}

function local_hide_load()
{
	$('.storage .storage-load').hide();
	return false;
}

function local_hide_save()
{
	$('.storage .storage-save').hide();
	return false;
}

function local_new_category(sender)
{
	if($('.storage-save .context-select').is(':visible'))
	{
		$('.storage-save .context-select').hide();
		$('.storage-save .context-new').show();
		$('#btn_new_category').html("x");
		current_category_context = category_context.kCategoryNew;
	}
	else
	{
		$('.storage-save .context-select').show();
		$('.storage-save .context-new').hide();
		$('#btn_new_category').html("+");
		$('#inputNewCategory').val('New Category');
		current_category_context = category_context.kCategoryExisting
	}
	return false;
}

function local_save_request(sender)
{
	if(current_category_context == category_context.kCategoryNew)
	{
		var category    = $('#inputNewCategory').val();
		local_new_category();
		local_category_new(category, local_request_new);
	}
	else
	{
		local_request_new($('#inputCategory').val())
	}
	
	return false;
}

function local_category_new(category, callback)
{
	var category_id = 0;
	category_id = database_category_new(category, callback);
	database_categories_refresh();
	return category_id;
}

function local_request_new(category_id)
{
	var data  = local_serialize_request()
	var label = $('#inputRequestName').val();
	database_save_request(label, category_id, data);
	local_hide_save();
	
}

function local_request_load(id)
{
	database_load_request(id, local_request_load_process);
}

function local_request_load_process(data)
{
	var archive = JSON.parse(data['data']);
	$('#inputUrl').val(archive.endpoint);
	$('#inputPort').val(archive.port);
	
	$("#inputVerb option[selected]").removeAttr("selected");
	$("#inputVerb option[value='"+archive.method+"']").attr("selected", "selected");
	
	
	local_request_load_process_authorization(archive);
	local_request_load_process_parameters(archive);
	local_request_load_process_headers(archive);
	
}

function local_request_load_process_authorization(data)
{
	switch(data.authorization.context)
	{
		case 'none':
			$('#inputNoAuthorization').attr('checked', 'checked');
			break;
		
		case 'basic':
			$('#inputBasicAuthorization').attr('checked', 'checked');
			authorization_show_basic(null, data.authorization.username, data.authorization.password);
			break;
		
		case 'custom':
			$('#inputCustomAuthorization').attr('checked', 'checked');
			authorization_show_custom(null, data.authorization.value);
			break;
	}
}

function local_request_load_process_parameters(data)
{
	if(typeof data.parameters != 'undefined')
	{
		if(data.parameters instanceof Array)
		{
			$('#inputParametersRaw').removeAttr('checked');
			parameters_show_post();
			data.parameters.forEach(function(item)
			{
				parameters_post_add(null, item.name, item.value);
			})
		}
		else
		{
			if(data.method == 'POST')
			{
				$('#inputParametersRaw').attr('checked', 'checked');
				parameters_show_post();
				$('#inputParameterRaw').val(data.parameters);
			}
			else if (data.method == 'PUT')
			{
				parameters_show_put();
				$('#inputParameterRaw').val(data.parameters);
			}
		}
	}
}

function local_request_load_process_headers(data)
{
	if(data.headers.length > 0)
	{
		data.headers.forEach(function(item){
			headers_add(null, item.name, item.value);
		})
	}
}

function local_serialize_request()
{
	var data      = {};
	data.endpoint = $('#inputUrl').val();
	data.port     = $('#inputPort').val();
	data.method   = $("#inputVerb").val();
	local_serialize_authorization(data);
	local_serialize_parameters(data);
	local_serialize_headers(data)
	
	return JSON.stringify(data);
}

function local_serialize_authorization(data)
{
	data.authorization = {}
	data.authorization.context = $("input[name='inputAuthorization']:checked").val();
	
	switch(data.authorization.context)
	{
		case 'none':
			break;
		
		case 'basic':
			data.authorization.username = $('#inputAuthorizationName').val();
			data.authorization.password = $('#inputAuthorizationPassword').val();
			break;
		
		case 'custom':
			data.authorization.value = $('#inputAuthorizationValue').val(); 
			break;
	}
}

function local_serialize_parameters(data)
{
	var method = data.method.toLowerCase();
	switch(method)
	{
		case 'get':
		case 'head':
		case 'delete':
			break;
		
		case 'post':
			local_serialize_parameters_post(data);
			break;
		
		case 'put':
			local_serialize_parameters_put(data);
			break;
	}
}

function local_serialize_parameters_post(data)
{
	var checked    = $('#inputParametersRaw:checked').val();
	if(typeof checked != 'undefined')
	{
		data.parameters = $('#inputParameterRaw').val();
	}
	else
	{
		data.parameters = new Array();
		$('.parameters_post .context .parameter').each(function()
		{
			var id      = $(this).attr('id').split('_')[1];
			var param   = {};
			param.name  = $('#inputParameterName_'+id).val();
			param.value = $('#inputParameterValue_'+id).val();
			data.parameters.push(param);
		})
	}
}

function local_serialize_parameters_put(data)
{
	data.parameters = $('#inputParameterRaw').val();
}

function local_serialize_headers(data)
{
	data.headers = new Array();
	$('.headers .context .parameter').each(function()
	{
		var id       = $(this).attr('id').split('_')[1];
		var header   = {};
		header.name  = $('#inputParameterName_'+id).val();
		header.value = $('#inputParameterValue_'+id).val();
		data.headers.push(header);
	})
}