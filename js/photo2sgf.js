var temp1;
var temp2;
var temp3;
var back='#C0C0C0FF'
var staneX=new Array();
var staneY=new Array();
var staneR;
var staneP=new Array();
document.getElementById('file').onchange=function(evt){
    if(document.body.childNodes[3].hidden==false)
	document.body.childNodes[3].hidden=true;
    var div=document.getElementById('result');
    var file=evt.target.files;
    var reader=new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = function(evt){
	div.innerHTML='<img src="'+evt.target.result+'" hidden></img>';
	var c=document.getElementById('myCanvas');
	var ctx=c.getContext('2d');
	div.childNodes[0].onload=function(){
	    ctx.drawImage(div.childNodes[0],0,0,div.childNodes[0].width,div.childNodes[0].height);
	    var img=ctx.getImageData(0,0,div.childNodes[0].width,div.childNodes[0].height);
	    var data=new Array(img.data.length/4);
	    for(var i=0;i<img.data.length/4;i++){
		data[i]='#';
		data[i]+=(img.data[i*4+0].toString('16').length==2)?img.data[i*4+0].toString('16'):'0'+img.data[i*4+0].toString('16');
		data[i]+=(img.data[i*4+1].toString('16').length==2)?img.data[i*4+1].toString('16'):'0'+img.data[i*4+1].toString('16');
		data[i]+=(img.data[i*4+2].toString('16').length==2)?img.data[i*4+2].toString('16'):'0'+img.data[i*4+2].toString('16');
		data[i]+=(img.data[i*4+3].toString('16').length==2)?img.data[i*4+3].toString('16'):'0'+img.data[i*4+3].toString('16');
	    }
	    if(temp1==undefined){
		temp1=data;
	    }
	    else if(temp2==undefined){
		temp2=data;
		test1(ctx,div.childNodes[0].width,div.childNodes[0].height);
	    }
	    else{
		temp3=data;
		document.body.childNodes[3].hidden=true;
		test4(ctx,div.childNodes[0].width,div.childNodes[0].height);
		document.body.childNodes[3].hidden=false;
	    }
	}
    }
}

function test1(ctx,width,height){
    var data=new Array();
    for(var i=0;i<temp1.length;i++){
	if(temp1[i]==temp2[i])
	    data[i]=back;
	else
	    data[i]=temp2[i];
    }
    test2(ctx,data,width,height);
}

function test2(ctx,data,width,height){
    var count=0;
    for(var i=0;i<data.length;i++){
	count+=test3(data[i]);
    }
    count/=data.length;
    for(var i=0;i<data.length;i++){
	if(data[i]==back)
	    continue
	else if(test3(data[i])>count)
	    data[i]='#FFFFFFFF';
	else if(test3(data[i])<=count)
	    data[i]='#000000FF';
    }
    for(var i=0;i<data.length;i++){
	if(data[i]!=back){
	    staneX.push(i%width);
	    staneY.push(Math.floor(i/width));
	}
    }
    staneX=staneX.sort();
    staneY=staneY.sort();
    var d1=staneX[staneX.length-1]-staneX[0];
    var d2=staneY[staneY.length-1]-staneY[0];
    var x=staneX[0]+d1/2;
    var y=staneY[0]+d2/2;
    staneR=d1/2;
    //drawImg(ctx,data,0,0,width,height);
    ctx.strokeStyle='#FF0000';
    ctx.beginPath();
    ctx.arc(x,y,staneR,0,2*Math.PI);
    ctx.stroke();
}

function test3(color){
    var r=parseInt('0x'+color[1]+color[2]);
    var g=parseInt('0x'+color[3]+color[4]);
    var b=parseInt('0x'+color[5]+color[6]);
    var a=parseInt('0x'+color[7]+color[8]);
    return Math.sqrt(r*r+g*g+b*b+a*a);
}

function test4(ctx,width,height){
    var data=new Array();
    for(var i=0;i<temp1.length;i++){
	if(temp1[i]==temp3[i])
	    data[i]=back;
	else
	    data[i]=temp3[i];
    }
    test5(ctx,data,width,height);
}

function test5(ctx,data,width,height){
    var count=0;
    for(var i=0;i<data.length;i++){
	count+=test3(data[i]);
    }
    count/=data.length;
    for(var i=0;i<data.length;i++){
	if(data[i]==back)
	    continue
	else if(test3(data[i])>count)
	    data[i]='#FFFFFFFF';
	else if(test3(data[i])<=count)
	    data[i]='#000000FF';
    }
    staneX=[];
    staneY=[];
    for(var i=0;i<data.length;i++){
	if(data[i]!=back){
	    staneX.push(i%width);
	    staneY.push(Math.floor(i/width));
	}
    }
    //drawImg(ctx,data,0,0,width,height);
    while(test6(ctx,data,width,height));
}

function test6(ctx,data,width,height){
    var x=999;
    var y=999;
    var countX;
    var countY;
    for(var i=0;i<staneX.length;i++){
	if(staneX[i]==1000)
	    continue;
	if(staneX[i]<x){
	    x=staneX[i];
	    countX=i;
	}
    }
    for(var i=0;i<staneY.length;i++){
	if(staneY[i]==1000)
	    continue;
	if(staneX[i]>=x&&staneX[i]<=x+staneR*2){
	    if(staneY[i]<y){
		y=staneY[i];
		countY=i;
	    }
	}
    }
    if(x==999||y==999)
	return false;
    console.log(x,y);
    console.log(countX,countY);
    x+=staneR;
    y+=staneR;
    console.log(x,y);
    //var color=data[y*width+x];
    var color=test7(ctx,data,x,y,width,height);
    console.log(color);
    if(color=='#000000FF')
	ctx.strokeStyle='#FF0000';
    else if(color=='#FFFFFFFF')
	ctx.strokeStyle='#0000FF';
    staneP.push({x:x,y:y,color:color});
    ctx.beginPath();
    ctx.arc(x,y,staneR,0,2*Math.PI);
    ctx.stroke();
    for(var i=0;i<staneX.length;i++){
	if(staneX[i]>=x-staneR&&staneX[i]<=x+staneR&&staneY[i]>=y-staneR&&staneY[i]<=y+staneR){
	    //console.log(staneX[i],staneY[i]);
	    staneX[i]=1000;
	    staneY[i]=1000;
	}
    }
    return true;
}

function test7(ctx,data,x,y,width,height){
    var a=new Array();
    for(var i=x-staneR;i<x+staneR;i++){
	for(var j=y-staneR;j<y+staneR;j++){
	    a[data[j*width+i]]=(a[data[j*width+i]]>=0)?++a[data[j*width+i]]:0;
	}
    }
    if(a['#000000FF'] > a['#FFFFFFFF']){
	return '#000000FF';
    }
    else if(a['#000000FF'] < a['#FFFFFFFF']){
	return '#FFFFFFFF';
    }
    console.log(a);
}

function test8(){
    var a=staneP[0].x;
    var b;
    var c;
    for(var i=0;i<staneP.length;i++){
	b=staneP[i].x;
	if(b>a)
	    break;
	else
	    b=0;
    }
    if(b==0){
	console.log('error');
    }
    else{
	c=b-a;
	console.log(c);
	var sgf_H='(;\r\n';
	var sgf_B='AB';
	var sgf_W='AW';
	for(var i=0;i<staneP.length;i++){
	    var x=staneP[i].x;
	    var y=staneP[i].y;
	    var str="abcdefghijklmnopqrs";
	    staneP[i].x=Math.floor((x-staneR)/c)+1;
	    staneP[i].y=Math.floor((y-staneR)/c)+1;
	    staneP[i].x=str[staneP[i].x-1];
	    staneP[i].y=str[staneP[i].y-1];
	    if(staneP[i].color=='#000000FF'){
		sgf_B+='['+staneP[i].x+staneP[i].y+']';
	    }
	    else if(staneP[i].color=='#FFFFFFFF'){
		sgf_W+='['+staneP[i].x+staneP[i].y+']';
	    }
	}
    }
    sgf_B+='\r\n';
    sgf_W+='\r\n';
    saveFile('export.sgf',sgf_H+sgf_B+sgf_W+')');
}

function drawImg(ctx,data,x,y,width,height){
    var img=ctx.createImageData(width,height);
    for(var i=0;i<data.length;i++){
	var r='0x'+data[i][1]+data[i][2];
	var g='0x'+data[i][3]+data[i][4];
	var b='0x'+data[i][5]+data[i][6];
	var a='0x'+data[i][7]+data[i][8];
	img.data[i*4+0]=parseInt(r);
	img.data[i*4+1]=parseInt(g);
	img.data[i*4+2]=parseInt(b);
	img.data[i*4+3]=parseInt(a);
    }
    ctx.putImageData(img,x,y);
}

function saveFile(filename,data){
    var blob=new Blob([data],{type:"text/plain"});
    var url=window.URL.createObjectURL(blob);
    var link=document.createElement('a');
    link.href=url;
    link.setAttribute("download",filename);
    document.body.append(link);
    link.click();
    link.remove();
}
