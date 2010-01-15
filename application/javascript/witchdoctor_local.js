function local_new_category(sender)
{
	if($('.save .context-select').is(':visible'))
	{
		$('.save .context-select').hide();
		$('.save .context-new').show();
		$('#btn_new_category').html("x");
		current_category_context = category_context.kCategoryNew;
	}
	else
	{
		$('.save .context-select').show();
		$('.save .context-new').hide();
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
	console.log(category_id)
}