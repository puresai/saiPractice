;(function($){
	var LightBox = function(){
		var This = this;

		//创建弹出框 遮罩
		this.popupMask = $('<div id="lightbox-mask">');
		this.popupWin = $('<div id="lightbox-popup">');

		//保存body
		this.bodyNode = $(document.body);

		//渲染dom 并插入
		this.renderDOM();

		this.picViewArea = this.popupWin.find('div.lightbox-pic-view');  //预览区域
		this.popupPic = this.popupWin.find('img.lightbox-image');  //图片
		this.picCaptionArea = this.popupWin.find('lightbox-caption-area');  //文字区域
		
		this.picCaption = this.popupWin.find('p.lightbox-caption');  //标题
		this.curIndex = this.popupWin.find('span.lightbox-index');  //索引
		this.closeBtn = this.popupWin.find('span.lightbox-close-btn');
		
		this.prevBtn = this.popupWin.find('span.lightbox-prev-btn'); //按钮组
		this.nextBtn = this.popupWin.find('span.lightbox-next-btn');

		//事件委托机制 获取数据
		this.groupName = null;
		this.groupData = [];
		
		this.bodyNode.delegate(".js-lightbox,*data-role[data-role=lightbox]",'click',function(e){
			//阻止事件冒泡
			e.stopPropagation();

			var curGroupName = $(this).attr('data-group');

			if(curGroupName != This.groupName){
				This.groupName = curGroupName;
				//alert(This.groupName)

				//根据当前组名 取同一组数据
				This.getGroup();
			}

			//初始化弹出
			This.initPopup($(this));
		});

		//关闭弹出框
		this.popupMask.click(function(){
			$(this).fadeOut();
			This.popupWin.fadeOut();
		});
		this.closeBtn.click(function(){
			This.popupMask.fadeOut();
			This.popupWin.fadeOut();
		});

		//上下按钮
		this.flag = true;
		this.prevBtn.hover(function(){
			if(!$(this).hasClass('disabled') && This.groupData.length > 1){
				$(this).addClass('lightbox-prev-btn-show');
			}
		},function(){
			if(!$(this).hasClass('disabled') && This.groupData.length > 1){
				$(this).removeClass('lightbox-prev-btn-show');
			}
		}).click(function(e){
			if(!$(this).hasClass('disabled') && This.flag){
				This.flag = false;
				e.stopPropagation();
				This.goto('prev');
			}
		});
		this.nextBtn.hover(function(){
			if(!$(this).hasClass('disabled') && This.groupData.length > 1){
				$(this).addClass('lightbox-next-btn-show');
			}
		},function(){
			if(!$(this).hasClass('disabled') && This.groupData.length > 1){
				$(this).removeClass('lightbox-next-btn-show');
			}
		}).click(function(e){
			if(!$(this).hasClass('disabled') && This.flag){
				This.flag = false;
				e.stopPropagation();
				This.goto('next');
			}
		});
	};

	LightBox.prototype = {
		//运动事件
		goto: function(type){
			if(type === 'next'){
				this.index++;
				if(this.index >= this.groupData.length - 1){
					this.nextBtn.addClass('disabled');
					this.nextBtn.removeClass('lightbox-next-btn-show');
				}
				if(this.index != 0 ){
					this.prevBtn.removeClass('disabled');
				}

				var src = this.groupData[this.index].src;
				this.loadPicSize(src);
			}else{
				this.index--;
				if(this.index <= 0){
					this.prevBtn.addClass('disabled');
					this.prevBtn.removeClass('lightbox-prev-btn-show');
				}
				if(this.index < this.groupData.length - 1){
					this.nextBtn.removeClass('disabled');
				}
				var src = this.groupData[this.index].src;
				this.loadPicSize(src);
			}
		},
		//显示弹窗 遮罩层
		showMaskAndPopup: function(src, id){
			var This = this;

			this.popupPic.hide();
			this.picCaptionArea.hide();

			this.popupMask.fadeIn();

			var winW = $(window).width(),
				winH = $(window).height();

			this.picViewArea.css({
				width : winW/2,
				height : winH/2
			});

			this.popupWin.fadeIn();

			var viewH = winH/2 + 10;

			this.popupWin.css({
				width : winW/2 + 10,
				height : winH/2 + 10,
				marginLeft : -(winW/2 + 10)/2,
				top: -viewH
			}).animate({
				top: (winH - viewH)/2
			},function(){
				//加载图片
				This.loadPicSize(src);
			});

			//获取索引
			this.index = this.getIndex(id);
			//console.log(this.index)

			var groupDataLength = this.groupData.length;

			if(groupDataLength > 1){
				if(this.index === 0){
					this.prevBtn.addClass("disabled");
					this.nextBtn.removeClass("disabled");
				}else if(this.index === groupDataLength - 1){
					this.nextBtn.addClass("disabled");
					this.prevBtn.removeClass("disabled");
				}else{
					this.nextBtn.removeClass("disabled");
					this.prevBtn.removeClass("disabled");
				}
			}
		},
		//设置合适的图片
		loadPicSize:function(src){
			var This = this;

			//清除之前图片尺寸
			This.popupPic.css({
				width: 'auto',
				height: 'auto'
			}).hide();
			this.preLoadImg(src,function(){
				This.popupPic.attr('src',src);

				var picW = This.popupPic.width(),
					picH = This.popupPic.height();

				//console.log(picW+'-'+picH)
				This.changePic(picW, picH);
			});
		},
		//改变图片尺寸 信息
		changePic:function(width,height){
			var This = this,
				winH = $(window).height(),
				winW = $(window).width();

			//如果img宽高大于 window  取比例
			var scale = Math.min(winW/(width+10), winH/(height+10),1);
			width = width * scale;
			height = height * scale;

			this.picViewArea.animate({
				width : width - 10,
				height : height - 10
			});

			this.popupWin.animate({
				width : width,
				height : height,
				marginLeft : -(width/2),
				top : (winH - height)/2
			},function(){
				This.popupPic.css({
					width : width - 10,
					height : height - 10
				}).fadeIn();

				This.picCaptionArea.fadeIn();
				This.flag = true;
			});
			//设置标题
			//console.log(this.index)
			//console.log(this.groupData[this.index])
			this.picCaption.text(this.groupData[this.index].caption);
			this.curIndex.text((this.index + 1) + '/' + this.groupData.length)
		},
		//加载图片
		preLoadImg:function(src,callback){
			var img = new Image();
			//alert('1')

			if(!!window.ActiveXObject){
				img.onreadystatechange = function(){
					if(this.readyState == 'complete'){
						callback();
					}
				}
			}else{
				img.onload = function(){
					callback();
				}
			}
			img.src = src;
			
		},
		getIndex: function(id){
			var index = 0;

			//运用jquery  each  array

			$(this.groupData).each(function(i){
				//console.log(1);
				index = i;
				if(this.id === id){
					return false;
				}
			});

			return index;
		},
		//初始化弹窗
		initPopup: function(obj){
			var This = this,
				sourceSrc = obj.attr('data-source');
				curId = obj.attr('data-id');

			this.showMaskAndPopup(sourceSrc, curId);
		},
		//获取同组图片信息，并写入数组
		getGroup: function(){
			var This = this;

			var groupList = this.bodyNode.find("*[data-group="+this.groupName+"]");
			//console.log(groupList.size())

			//清空
			This.groupData.length = 0;
			groupList.each(function(){
				This.groupData.push({
					src: $(this).attr('data-source'),
					id: $(this).attr('data-id'),
					caption: $(this).attr('data-caption')
				});
			});
			//console.log(This.groupData)
		},
		//加载dom结构
		renderDOM: function(){
			var strDom = '<div class="lightbox-pic-view">' +
					        '<span class="lightbox-btn lightbox-prev-btn"></span>'+
					        '<img src="images/2-2.jpg" alt="" class="lightbox-image">'+
					        '<span class="lightbox-btn lightbox-next-btn"></span>' +
					    '</div>' +
					    '<div class="lightbox-pic-caption">' +
					        '<div class="lightbox-caption-area">' +
					            '<p class="lightbox-caption"></p>' +
					            '<span class="lightbox-index">0/0</span>'+
					        '</div>' +
					        '<span class="lightbox-close-btn"></span>' +
					    '</div>'+
					'</div>';
			//插入到this.popupWin
			this.popupWin.html(strDom);

			//遮罩插入
			this.bodyNode.append(this.popupMask, this.popupWin)
		}
	};
	window.LightBox = LightBox;
})(jQuery)