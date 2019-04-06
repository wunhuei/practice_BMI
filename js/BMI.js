$(function(){
	//下面紀錄區塊
	var list = document.querySelector('.list'); 
	//轉陣列(取出資料，key叫listData的裡面value資料) 或是一開始空陣列
	var data = JSON.parse(localStorage.getItem('wunData')) || [];
	//呼叫更新資料函式(data值)
	updateList(data);
	//下面紀錄區塊中 一小塊一小塊紀錄
	var group = document.getElementsByClassName('detection-group');

	// 上方輸入計算區＿計算
	function Calculation(){
		// 取身高(公尺)*身高(公尺)的值
		var height = (parseInt($("input[name='height']").val())*0.01)*(parseInt($("input[name='height']").val())*0.01);
		// 取體重的值
		var bodyweight = parseInt($("input[name='bodyweight']").val());
		// 計算最後的BMI值
		var final = parseFloat(bodyweight / height).toPrecision(4);

		// 算完後數字顯示在右側
		$('.result p').text(final);
		// 偵測數字，兩個值帶入Variety函式
		if( final < 18.5 ){
			Variety('過輕','Toolight');
		}else if( final < 24 ){
			Variety('理想','Ideal');
		}else if( final < 27 ){
			Variety('過重','Tooheavy');
		}else if( final < 30 ){
			Variety('輕度肥胖','Mild');
		}else if( final < 35 ){
			Variety('中度肥胖','Moderate');
		}else{
			Variety('重度肥胖','Danger');
		}
		function Variety(Text,color){
			$('.status-circle h3').text(Text);
			$('.status-circle').addClass(color);
		};
	};

	//上方輸入計算區＿做點擊反應+結果顯示在右邊
	$('button').click(function(){
		// 偵測有沒有填入資料
		let noheight = $("input[name='height']").val().length;
		let nobodyweight = $("input[name='bodyweight']").val().length;
		if(noheight<=0 || nobodyweight<=0){
			alert('要填入正確資料喔！');
			return;
		}
		// 按鈕本身加.besmall，讓他消失，讓隔壁的div.status-circle加.show讓數字結果出來
		$(this).addClass('besmall').siblings('.status-circle').addClass('show');
		Calculation();
		// 把填入禁止
		$('input').attr('disabled',true);		
	});

	// 上方輸入計算區＿回到原始狀態
	function original(){
		//計算的右側_算出來的狀態移除class，原本的“看結果“按鈕隱藏，所以移除隱藏的class名稱
		$('.status-circle').removeClass('show Toolight Ideal Tooheavy Moderate Danger').siblings('button').removeClass('besmall');
		//原本有被靜止填入狀態，所以切回原本可以填入的狀態
		$("input[name='height']").val('').attr('disabled',false);
		//原本有被靜止填入狀態，所以切回原本可以填入的狀態
		$("input[name='bodyweight']").val('').attr('disabled',false);
	};

	// 上方輸入計算區＿點擊切原始狀態
	$('.result').click(function(){
		original();
	});

	// 下面紀錄區＿偵測數字，加class來變化顏色
	function chagecolor(){
		let ListTotall = $('.list .detection-group').length+1;
		//我用for迴圈方式，先得知每一筆資料中，num裡面的數字多少，依照數值來加class
		for(var j=1; j<ListTotall; j++){
			let BMI = $('.detection-group:nth-child('+j+') .num').text();
			if( BMI < 18.5 ){
				$('.list .detection-group:nth-child('+j+')').addClass('Toolight');
			}else if( BMI < 24 ){
				$('.list .detection-group:nth-child('+j+')').addClass('Ideal');
			}else if( BMI < 27 ){
				$('.list .detection-group:nth-child('+j+')').addClass('Tooheavy');
			}else if( BMI < 30 ){
				$('.list .detection-group:nth-child('+j+')').addClass('Mild');
			}else if( BMI < 35 ){
				$('.list .detection-group:nth-child('+j+')').addClass('Moderate');
			}else{
				$('.list .detection-group:nth-child('+j+')').addClass('Danger');
			}
		}
	};

	//下面紀錄區＿更新內容的函示(帶入items變數接收data值)
	function updateList(items){
		totallHtml = '';
		let len = items.length;
		//跑for迴圈，把值帶進去，一直累加
		for(var i=0; i<len; i++){
			totallHtml += '<div class="detection-group" id='+i+'><div class="status">'+items[i].final+'</div><div class="BMI"><span>BMI</span><p class="num">'+items[i].BMI+'</p></div><div class="weight"><span>weight</span><p class="kg">'+items[i].kg+'</p>kg</div><div class="height"><span>height</span><p class="cm">'+items[i].cm+'</p>cm</div><div class="date">'+items[i].TodayNow+'</div><a data-index='+i+'>X</a></div>';
		}
		list.innerHTML = totallHtml;
		//再跑一次chagecolor函式
		chagecolor();
	};

	//下面紀錄區＿排序：由高到低
	//因為通常都加在資料的最下面，目前資料庫也是最新的資料最下面，所以取得每一筆的資料，再做比較，然後把一開始的資料都塞在最前面
	function downList(){
		let domList = $('.list .detection-group').get();
		domList.sort(function(a,b){
			let AA = $(a).attr("id");
			let BB = $(b).attr("id");
			if(AA > BB) return -1;
			if(AA < BB) return 1;
			return 0;
		});
		$('.list').append(domList);
	};

	
	//加入列表，並同步更新網頁與 localstorage
	$('.add').click(function(){
		let final = $('.status-circle h3').text();
		let BMI = $('.Input .result p').text();
		let kg = $("input[name='bodyweight']").val();
		let cm = $("input[name='height']").val();
		//得知目前的年月日
		let Today = new Date();
		let	YYYY = Today.getFullYear();
		let MM = Today.getMonth()+1;
		let dd = Today.getDate();
		let TodayNow = YYYY+"/"+MM+"/"+dd;
		//用物件來接txt變數資料
		var memo = {	
			final:final,
			BMI:BMI,
			kg:kg,
			cm:cm,
			TodayNow:TodayNow
		};
		//將data這個變數更新memo物件裡的資料
		data.push(memo);
		updateList(data);
		localStorage.setItem('wunData', JSON.stringify(data));
		
		chagecolor();
		downList();
		original();
	});

	// 下面紀錄區＿點擊刪除資料
	$('.list').on('click','a',function(e){
		e.preventDefault();
		let index = e.target.dataset.index;
		data.splice(index, 1);
		localStorage.setItem('wunData', JSON.stringify(data));
		updateList(data);
		downList();
	});

	downList();
});