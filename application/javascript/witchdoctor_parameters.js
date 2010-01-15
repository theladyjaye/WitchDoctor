function parameters_post_raw(sender)
{
	var checked = $('#inputParametersRaw:checked').val();
	var btn_add = $('#btn_add_parameters');
	var notice  = $('.parameters_post .notice');
	if(typeof checked != 'undefined')
	{
		btn_add.attr('disabled', 'disabled');
		parameters_post_clear();
		parameters_raw_add(parameter_context.kContextPost)
		notice.show();
	}
	else
	{
		btn_add.removeAttr('disabled');
		parameters_raw_delete()
		notice.hide();
	}
}

function parameters_raw_add(context, value)
{
	value = value ? value : '';
	var data = {value:value}
	var html = Mustache.to_html(WDTemplates.parameter_raw, data);
	$('.'+context+' .context').html(html);
}

function parameters_raw_delete()
{
	$('#parameter_raw').remove();
}

function parameters_post_add(sender, key, value)
{
	key   = key   ? key   : 'Key';
	value = value ? value : 'Value';

	var data = {id:parameter_id++,
		        parameter_name:key,
		        parameter_value:value}
		
	var html = Mustache.to_html(WDTemplates.parameter, data);
	$('.parameters_post .context').append(html);
	$('#inputParameterDelete_'+data.id).bind('click', parameters_post_delete)
}

function parameters_post_delete()
{
	parameter_id--;
	var id  = $(this).attr('id').split('_')[1];
	$('#parameter_'+id).remove();
}

function parameters_show_post()
{
	parameters_current_refresh();
	current_parameter_context  = parameter_context.kContextPost
	$('.'+parameter_context.kContextPost).show();
	var checked = $('#inputParametersRaw:checked').val();
	if(typeof checked != 'undefined')
	{
		parameters_post_raw();
	}
}

function parameters_show_put()
{
	parameters_current_refresh();
	current_parameter_context = parameter_context.kContextPut;
	$('.'+parameter_context.kContextPut).show();
	parameters_raw_add(parameter_context.kContextPut);
}

function parameters_show_default()
{
	parameters_current_refresh();
}

function parameters_post_clear()
{
	$('.'+parameter_context.kContextPost+' .context div').each(function(){
		$(this).remove();
	});
}
function parameters_current_refresh()
{
	if(typeof current_parameter_context != 'undefined')
	{
		$('.'+current_parameter_context).hide()
		if(current_parameter_context == parameter_context.kContextPost)
		{
			var checked = $('#inputParametersRaw:checked').val();
			if(typeof checked == "undefined")
			{
				parameters_post_clear();
			}
			else
			{
				parameters_raw_delete();
			}
		}
		else
		{
			parameters_raw_delete();
		}
	}
}

function parameters_collect_custom(request)
{
	switch(current_parameter_context)
	{
		case parameter_context.kContextPost:
			parameters_collect_post(request)
		break;
		
		case parameter_context.kContextPut:
			parameters_collect_put(request)
		break;
	}
}

function parameters_collect_post(request)
{
	var parameters = new Array();
	var data       = '';
	var checked    = $('#inputParametersRaw:checked').val();
	if(typeof checked != 'undefined')
	{
		request.data = encodeURIComponent($('#inputParameterRaw').val());
	}
	else
	{
		$('.parameters_post .context .parameter').each(function()
		{
			var id       = $(this).attr('id').split('_')[1];
			var header   = new WDHeader();
			header.name  = $('#inputParameterName_'+id).val();
			header.value = $('#inputParameterValue_'+id).val();
			parameters.push(header);
		})
	
	
		parameters.forEach(function(param)
		{
			data += encodeURIComponent(param.name)+"="+encodeURIComponent(param.value)+"&";
		})
		
		request.data = data.substr(0, (data.length-1))
	}
}

function parameters_collect_put(request)
{
	request.data = encodeURIComponent($('#inputParameterRaw').val());
}