function local_new_category(sender)
{
	if($('.save .context-select').is(':visible'))
	{
		$('.save .context-select').hide();
		$('.save .context-new').show();
		$('#btn_new_category').html("x");
	}
	else
	{
		$('.save .context-select').show();
		$('.save .context-new').hide();
		$('#btn_new_category').html("+");
	}
	return false;
}

function local_save_category(sender)
{
	local_new_category();
	var category = $('#inputNewCategory').val();
	$('#inputNewCategory').val('New Category');
	database_category_new(category);
	database_categories_refresh();
}
