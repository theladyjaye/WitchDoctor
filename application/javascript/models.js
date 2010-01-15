function WDRequest()
{
	this.endpoint     = null;
	this.port         = null;
	this.method       = null;
	this.data         = null;
	this.query_string = null;
	this.headers      = [];
}

function WDHeader()
{
	this.name  = null;
	this.value = null;
}