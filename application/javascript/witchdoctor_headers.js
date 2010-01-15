function headers_add(sender, key, value)
{
	key   = key   ? key   : 'Name';
	value = value ? value : 'Value';

	var data = {id:parameter_id++,
		        parameter_name:key,
		        parameter_value:value}
		
	var html = Mustache.to_html(WDTemplates.parameter, data);
	$('.headers .context').append(html);
	$('#inputParameterDelete_'+data.id).bind('click', header_delete)
}

function header_delete(target)
{
	parameter_id--;
	var id  = target ? target : $(this).attr('id').split('_')[1];
	$('#parameter_'+id).remove();
}

function headers_clear()
{
	$('.headers .context .parameter').each(function()
	{
		var id = $(this).attr('id').split('_')[1];
		header_delete(id);
	});
}

function headers_collect_custom(request)
{
	$('.headers .context .parameter').each(function()
	{
		var id       = $(this).attr('id').split('_')[1];
		var header   = new WDHeader();
		header.name  = $('#inputParameterName_'+id).val();
		header.value = $('#inputParameterValue_'+id).val();
		request.headers.push(header);
	})
}