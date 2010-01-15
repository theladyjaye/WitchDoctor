function authorization_show_default()
{
	$('#authorization').remove();
}

function authorization_show_basic(sender, username, password)
{
	authorization_show_default()
	username = username ? username : 'Username';
	password = password ? password : 'Password';
	
	var data = {authorization_name:username,
		        authorization_password:password}
		
	var html = Mustache.to_html(WDTemplates.authorization_basic, data);
	
	$('.authorization .context').html(html)
}

function authorization_show_custom(sender, value)
{
	authorization_show_default();
	value = value ? value : '';
	
	var data = {authorization_value:value}
	var html = Mustache.to_html(WDTemplates.authorization_custom, data);
	
	$('.authorization .context').html(html)
}

function authorization_custom()
{
	var header   = new WDHeader();
	header.name  = "Authorization";
	header.value = $('#inputAuthorizationValue').val();
	return header;
}

function authorization_basic()
{
	
	var username = $('#inputAuthorizationName').val();
	var password = $('#inputAuthorizationPassword').val();
	
	var header   = new WDHeader();
	header.name  = "Authorization";
	header.value = "Basic "+$.base64Encode(username+":"+password);
	return header;
}