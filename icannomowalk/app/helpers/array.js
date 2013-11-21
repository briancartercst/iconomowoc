function array_diff(a1, a2)
{
  var a=[], diff=[];
  for(var i=0;i<a1.length;i++)
    a[a1[i]]=true;
  for(var i=0;i<a2.length;i++)
    if(a[a2[i]]) delete a[a2[i]];
    else a[a2[i]]=true;
  for(var k in a)
    diff.push(k);
  return diff;
}

function array_difference(a1,a2)
{
	var diff = [];
	for(var x = a1.length-1;x>=0;x--)
	{
		for(var y = 0; y<a2.length;y++)
		{
			if(a1[x])
			{
				if(a1[x].id == a2[y].id)
				{
					//diff.push(a1[x]);
					a1.splice(x,1);
				}
			}
		}
	}
	return a1;
}

module.exports = array_difference;