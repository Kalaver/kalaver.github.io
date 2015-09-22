function radToPix(rad, step){
	return ((rad/Math.PI)*step+512);
};

function pixToRad(pix, step){
	return Math.PI*(pix-512)/step;
};

function getMax( func, args, range, step){
	var max=0;
	var w=range[1]-range[0]
	var n=Math.floor(Math.abs(w)/step);
	var arg=0;
	var f=0.0;
	for (i=0; i<n; i++){ 
		arg=(i*step)+range[0];
		f=func([arg].concat(args));
		if ((max<f) && isFinite(f)) {
			max=f;
		}
	}
	return max;
}

$(document).ready( 
	function() {
		$('#download').click(
			function() {
				var link = document.getElementById("download");
				link.href = document.getElementById("canvas1").toDataURL();
				link.download = "image.png";
			}
		);
		$('#calc').click(
			function() {
				var canvas = document.getElementById("canvas1");
				var width = canvas.width;
				var height = canvas.height;
				
				console.log("width = "+canvas.width);
				console.log("height = "+canvas.height);
				
				
				var i = 0;
				var N = parseFloat($('#N_val').val());
				var d = parseFloat($('#d_val').val());
				var F = parseFloat($('#F_val').val());
				var result = result=$('div.result');
				var psi = N*d;
				var arg=0;
				var max=0;
				var step=width/((Math.abs(psi)+Math.abs(F)+1)*2);
				step=Math.floor(step);
				console.log("step = "+step);
				result.empty();
				result.append("&#968;="+psi+"&#960;<br />");
				
				psi=psi*Math.PI;
				F=F*Math.PI;
				
				height = 512 + 96 + (radToPix(psi, step)-radToPix(-psi, step))/2 + 96;
				canvas.height = height;
				
				var context = canvas.getContext("2d");
				
				
				//func = function (arg) {
				//	return 10*Math.sin(arg[0]);
				//};
				//result.append("max of 10*sin(x)="+getMax(func,[],[0,2*Math.PI],1e-2)+"<br />");
				
				//context.clearRect(0, 0, canvas.width, canvas.height);
				context.fillStyle="white";
				context.fillRect(0, 0, canvas.width, canvas.height);
				context.fillStyle="black";
				
				context.beginPath();
				
				 

				context.moveTo(0, 96);
				context.lineTo(width, 96);  
				var j=0;
				for (j=0; j<3; j++){
					for (i=0; i<width; i++){ 
						if (Math.abs((i-512) % Math.floor(step))==0){
							context.moveTo(i, 96-6+192*j);
							context.lineTo(i, 96+6+192*j);
							context.fillText(Math.round(pixToRad(i, step)/Math.PI)+"π", i-3, 96+12+192*j);
						}
					}
				}
				
				context.moveTo(0, 96+192);
				context.lineTo(width, 96+192);
				
				context.moveTo(0, 96+192*2);
				context.lineTo(width, 96+192*2);
				
				//context.moveTo(0, 96+192*3);
				//context.lineTo(width, 96+192*3);
				
				context.moveTo(0, height-96);
				context.lineTo(width, height-96);
				
				
				context.moveTo(width/2, 0);
				context.lineTo(width/2, 96+192*2); 
				
				context.moveTo(radToPix(-psi, step), 0);
				context.lineTo(radToPix(-psi, step), 96+192*2);
				
				context.moveTo(radToPix(psi, step), 0);
				context.lineTo(radToPix(psi, step), 96+192*2);
				
				
				console.log("radToPix(psi) = "+radToPix(psi, step));
				
				context.stroke();
				
				
				
				var func1 = function (arg) {
						return Math.abs(Math.sin(arg[0]));
				};
				max=getMax(func1, [], [-1000,1000], 1e-3);
				
				context.beginPath();
				
				context.moveTo(0, 96);
				for (i=0; i<width*N; i++){ 
					arg=pixToRad(i/N, step);
				    context.lineTo(i/N, 96-(func1([arg])/max)*64);  
				}
				context.stroke();
				
				var func2 = function (arg) {
					return Math.abs(Math.sin(arg[0]/arg[1])/arg[1]);
				};
				max=getMax(func2, [N], [-1000,1000], 1e-3);
				
				context.beginPath();
				
				context.moveTo(0, 96+192);
				for (i=0; i<width*N; i++){ 
					arg=pixToRad(i/N, step);
				    context.lineTo(i/N, 96+192-(func2([arg,N])/max)*64);    
				}
				context.stroke();
				
				var func3 = function (arg) {
					return (func1(arg)/func2(arg))/arg[1];
				};
				max=getMax(func3, [N], [-100,100], 1e-4);
				console.log("func3 max = "+max);
				
				context.beginPath();
				
				var f=0.0;
				
				context.moveTo(0, 96+192*2);
				for (i=0; i<width*N; i++){ 
					arg=pixToRad(i/N, step);
					f=func3([arg,N]);
					if (isFinite(f)){
						context.lineTo(i/N, 96+192*2-(f/max)*64);
					}
				        
				}
				context.stroke();
				
				//context.beginPath();
				//
				//context.moveTo(0, 96+192*3);
				//for (i=0; i<width*N; i++){ 
				//	arg=pixToRad(i/N, step)+F;
				//	f=func3([arg,N]);
				//	if (isFinite(f)){
				//		context.lineTo(i/N, 96+192*3-(func3([arg,N])/max)*64);  
				//	} 
				//}
				//context.stroke();
				
				
				context.beginPath();
				
				var f3=0.0;
				var x=0.0;
				var y=0.0;
				var R=(radToPix(psi, step)-radToPix(-psi, step))/2;
				var dF=(radToPix(F, step)-radToPix(-F, step))/2;
				var n=0;
				context.moveTo(512-dF, 96+192*2);
				context.lineTo(512-dF, height);
				
				
				context.moveTo(512-dF-R, 96+192*2);
				context.lineTo(512-dF-R, height);
				
				context.moveTo(512-dF+R, 96+192*2);
				context.lineTo(512-dF+R, height);
				
				for (i=0; i<width; i++){ 
					if (Math.abs((i-512) % Math.floor(step))==0){
						context.moveTo(i, height-96-6);
						context.lineTo(i, height-96+6);
						context.fillText(Math.round(pixToRad(i, step)/Math.PI)+"π", i-3, height-96+12);
					}
				}
				context.fillText(((-F)/Math.PI)+"π", radToPix(-F,step)-3, height-96+12);
				
				context.moveTo(512, height-96);
				for (i=0; i<width*1000; i++){ 
					arg=pixToRad(i/1000, step)-F;
					f3=func3([arg,N]);
					arg=pixToRad(i/1000, step);
					if ((arg>=-psi) && (arg<=psi)) {
						
						arg=arg/psi
						
						f3=f3/max;
						x=arg*R;
						x=x*f3;
						
						arg=Math.asin(arg);
						
						y=Math.cos(arg)*R;
						y=y*f3;
						if ((n%250)==0){	
							context.lineTo(x+512-dF, height-y-96);
						} 
						n++;
					}
				    
				}  
				context.lineTo(x+512-dF, height-y-96);
				context.stroke();
				
				context.beginPath();
				context.arc(512-dF, height-96, R, 0, 2 * Math.PI, false);
				context.stroke();
				
			}
		);
		
	}
);