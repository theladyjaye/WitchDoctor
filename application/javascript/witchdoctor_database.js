
function database_initialize()
{
	try 
	{
		if (!window.openDatabase) 
		{
			alert('Sorry, you need to use a more modern browser to allow saving');
		}
		else
		{
			var name        = 'witchdoctor';
			var version     = '1.0';
			var displayName = 'WitchDoctor Saved Requests'
			var maxSize     = 512000;
			
			return openDatabase(name, version, displayName, maxSize);
		}
	}
	catch(e)
	{
		if(e == 2)
		{
			alert("Invalid database version.");
		}
		else
		{
			alert("Unknown error "+e+".");
		}
		return;
	}
}


function database_setup()
{
	database.transaction(function (transaction) 
	{
		transaction.executeSql("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;", [], function(transaction, results)
		{
			console.log(results.rows.length);
			if(results.rows.length <= 2)
			{
				database_create();
			}
		});
	})	
}

function database_create()
{
	database.transaction(function (transaction) 
	{
		transaction.executeSql('CREATE TABLE category(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL DEFAULT "New Category");', []);
		transaction.executeSql('CREATE TABLE request(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL DEFAULT "New Request", data TEXT NULL, category INTEGER NOT NULL DEFAULT 1);', []);
		transaction.executeSql('INSERT INTO CATEGORY (name) VALUES ("Default");', []);
	});
}

function database_reset()
{
	database.transaction(function (transaction) 
	{
		transaction.executeSql('DROP TABLE category;', []);
		transaction.executeSql('DROP TABLE request;', []);
		
	});
}

function database_category_new(category)
{
	var category = category;
	database.transaction(function (transaction) 
	{
		transaction.executeSql('INSERT INTO CATEGORY (name) VALUES (?);', [category]);
	});
}

function database_categories_refresh()
{
	database.transaction(function (transaction) 
	{
		transaction.executeSql('SELECT id, name FROM category WHERE name != "Default" ORDER BY name ASC;', [], function(transaction, results){
			var options = '';
			
			options += Mustache.to_html(WDTemplates.option, {label:"Default", value:1});
			for(var i = 0; i < results.rows.length; i++)
			{
				var row = results.rows.item(i);
				options += Mustache.to_html(WDTemplates.option, {label:row['name'], value:row['id']});
			}
			
			$('#inputCategory').html(options);
		});
	});
}
