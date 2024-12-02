// ==============================================
// 		scrolling
// ==============================================

class ScrollClass {
	
	constructor(){
		var __this=this;
		this.track=$('#track');
		this.scrTop=$(window).scrollTop();
		this.headerWidth=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--headerWidth'));
		this.isLerp=0;
		this.currPos=0;
		this.finalPos=0;
		this.isMobile=0;
		$(window).on('resize', function(){
			__this.testMobile();
			__this.configureAllElements();
			__this.configurePageLimits();
		})
		$(window).on('scroll load', function(){
			__this.scrollConfig();
			__this.scrollPage();
			__this.testScrollElements();	
		})
		this.testMobile();
		this.configureAllElements();
		this.configurePageLimits();
		this.scrollConfig();
		this.scrollPage();
		this.testScrollElements();
	}
	testMobile(){
		if($('#isMobile').is(':visible')) this.isMobile=1;
		else this.isMobile=0;
	}
	configureAllElements(){
		var __this=this;
		this.windowWidth=$(window).outerWidth();
		this.windowHeight=$(window).outerHeight();
		this.logoLimit=this.windowWidth/2;
		this.block=$('[dataVisibilityElement]');
		this.last=0;
		this.block.each(function(){
			var el=$(this);
			if(!this.isMobile) {
				var left=el.offset().left-el.parent().offset().left;
				var start=left;
				var width=el.outerWidth();
				var end=start+width;
			}else {
				var start=el.offset().top;
				var end=start+el.height();
			}
			el.data('start', start);
			el.data('end', end);
		})
	}
	configurePageLimits(){
		var __this=this;
		this.end=$(window).height();
		$('#container .section').last().each(function(){
			var el=$(this);
			var left=el.offset().left-el.parent().offset().left;
			var start=left;
			var width=el.outerWidth();
			var diff=__this.windowWidth-__this.windowHeight;
			__this.end=start+width-diff+__this.headerWidth;
		})
		$('body').height(this.end);
	}
	scrollConfig(){
		this.scrTop=$(window).scrollTop();
		this.scrLeft=this.scrTop;
		this.scrFarLeft=this.scrLeft+this.windowWidth-this.headerWidth;
		if(this.isMobile) this.scrFarLeft=this.scrLeft+this.windowHeight;
	}
	scrollPage(){
		var top=this.scrLeft;
		if(top>this.logoLimit) {
			$('body').removeAttr('logoVisibility');
		}else {
			$('body').attr('logoVisibility', 1);
		}
		this.finalPos=top;
		if(!this.isLerp){
			this.isLerp=1;
			this.runLerp();
		}
		
		this.percent=top*100/(this.end - this.windowHeight);
		$('#scroll--bar').css('height', this.percent+'%');
		
	}
	runLerp(){
		var __this=this;
		var diff=(this.finalPos-this.currPos)*.05;
		if(diff<.025){
			this.currPos=this.finalPos;
			var end=this.currPos*-1;
			this.isLerp=0;
			this.track.css('transform', 'translateX('+end+'px)');
		}else{
			var end=this.currPos+diff;
			this.currPos=end;
			end=end*-1;
			this.track.css('transform', 'translateX('+end+'px)');
			requestAnimationFrame(function(){
				__this.runLerp();
			})
		}
	}
	testScrollElements(){
		var __this=this;
		var useAlt=0;
		this.block.each(function(){
			var el=$(this);
			if(__this.scrFarLeft>el.data('start')&&__this.scrLeft<el.data('end')){
				el.attr('dataVisibilityInit', 1)
				el.attr('dataVisibility', 1)
			}else{
				if(el.is('[dataVisibility]')) el.removeAttr('dataVisibility');
			}
			// testing logo stuff
			if(__this.scrLeft>=el.data('start')&&__this.scrLeft<el.data('end')){
				if(el.is('.section.dark--image')) useAlt=1;
			}
		})
		if(useAlt) $('body').attr('useAltLogo', 1);
		else $('body').removeAttr('useAltLogo');
	}
}

// ==============================================
// 		loading styles
// ==============================================

class Loader {
	
	constructor(){
		var __this=this;
		this.block=$('.Main-content .sqs-layout > div > div > div');
		this.footerBlock=$('#footerBlocksTop > div > div > div');
		this.headerBlock=$('#footerBlocksMiddle > div > div > div');
		this.blockArray=[];
		
		this.elArray=[];
		this.clearBlocks();
		this.configureBlocks();
		this.configurePage();
		new Footer(this.footerBlock);
		new Header(this.headerBlock);
		new Logo();
		new ScrollClass();
	}
	clearBlocks(){
		$('.sqs-block').each(function(){
			$(this).removeClass('sqs-block');
		})
		$('.min-font-set').each(function(){
			$(this).removeClass('min-font-set');
		})
		$('body [style]').each(function(){
			$(this).removeAttr('style');
		})
	}
	configureBlocks(){
		var __this=this;
		var array=[];
		this.block.each(function(){
			var el=$(this);
			if(el.is('.spacer-block')) {
				if(array.length) {
					__this.blockArray.push(array);
					array=[];
				}
			}else{
				array.push(el);
			}
		})
		if(array.length) this.blockArray.push(array);
	}
	configurePage(){
		var __this=this;
		$.each(this.blockArray, function(index, array){
			__this.runArray(array);
		})
	}
	runArray(array){
		var first=array[0];
		var elArr=this.elArray;
		if(first.is('.html-block')){
			elArr[elArr.length]=new ContentBlock(array, elArr);
		}else{
			elArr[elArr.length]=new ImageBlock(array, elArr);
		}
	}
}

// ============================
// logo
// ============================

class Logo {
	constructor(){
		var __this=this;
		this.logo=$('#logo-large');
		this.configureLogo();
		this.placeLogo();
	}
	configureLogo(){
		var __this=this;
		this.logo.each(function(){
			var el=$(this);
			__this.large=el;
		})
	}
	placeLogo() {
		if(typeof(this.large)!='undefined') {
			var el=$('<a href="/" id="logo"></a>');
			el.append(this.large.clone())
			el.appendTo('body');
		}
		if(typeof(this.small)!='undefined') {
			var el=$('<a href="/" id="logo--small"></a>');
			el.append(this.small.clone())
			el.appendTo('#header .inner');
		}
	}
}

// ============================
// header
// ============================

class Header {
	
	constructor(block){
		var __this=this;
		this.block=block;
		this.blockArray=[];
		this.configureBlocks();
		new HeaderBlock(this.blockArray);
		new Navigation();
	}
	configureBlocks(){
		var __this=this;
		var array=[];
		this.block.each(function(){
			var el=$(this);
			if(el.is('.spacer-block')) {
				if(array.length) {
					__this.blockArray.push(array);
					array=[];
				}
			}else{
				array.push(el);
			}
		})
		if(array.length) this.blockArray.push(array);
	}
}

// ============================
// navigation
// ============================

class Navigation {
	
	constructor(){
		 var __this=this;
		 this.btn=$('#menu');
		 this.btn.on('click', function(e){
			 e.preventDefault();
			 __this.updateNavigation();
		 })	
	}
	updateNavigation(){
		var __this=this;
		if($('body').is('[dataNavigation]')) {
			$('body').removeAttr('dataNavigation')
		}else{
			$('body').attr('dataNavigation', 'active');
		}
		
	}
}

// ============================
// header
// ============================

class HeaderBlock {

	constructor(array){
		var __this=this;
		this.header=$('#header');
		this.array=array;
		this.innerArray=[];
		
		this.createBase();
		this.populateBase();
	}
	createBase(){
		var __this=this;
		this.section=$('<div id="navigation"></div>');
		this.section.appendTo(this.header);
	}
	populateBase(){
		var __this=this;
		$.each(this.array, function(index, array){
			var el=$('<div class="nav--item"><div class="nav--item__footer"></div></div>');
			el.appendTo(__this.section);
			__this.populateBaseInner(index, array, el);
		})
	}
	populateBaseInner(index, array, el){
		var __this=this;
		var newIndex=index+1;
		$('<span class="cnt">0'+newIndex+'.</span>').prependTo(el);
		$.each(array, function(index, item){
			if(!item.is('.horizontalrule-block')) item.clone().appendTo(el.find('.nav--item__footer'));
		})
	}
}

// ============================
// footer
// ============================

class Footer {
	
	constructor(block){
		var __this=this;
		this.block=block;
		this.blockArray=[];
		this.configureBlocks();
		new FooterBlock(this.blockArray);
	}
	configureBlocks(){
		var __this=this;
		var array=[];
		this.block.each(function(){
			var el=$(this);
			if(el.is('.spacer-block')) {
				if(array.length) {
					__this.blockArray.push(array);
					array=[];
				}
			}else{
				array.push(el);
			}
		})
		if(array.length) this.blockArray.push(array);
	}
}

class FooterBlock {

	constructor(array){
		var __this=this;
		this.container=$('#track');
		this.array=array;
		this.innerArray=[];
		
		this.createBase();
		this.createContent();
		this.populateBase();
	}
	createBase(){
		var __this=this;
		this.section=$('<div class="section section--content section--footer padding-top-double padding-bottom-double medium-up--padding-top-col medium-up--padding-bottom-col" dataVisibilityElement="1"><div class="wrapper"><div class="grid grid--column"><div class="grid grid--content"></div></div></div></div>');
		this.section.appendTo(this.container);
		this.wrapper=this.section.find('.wrapper');
		this.gridBase=this.section.find('.grid--column');
		this.grid=this.section.find('.grid:not(.grid--column)');
	}
	createContent(){
		var __this=this;
		this.contentArray=[];
		var cnt=0;
		$.each(this.array, function(index, item){
			__this.contentArray.push(item);
			cnt++;
		});		
		this.first=this.contentArray[0];
		this.last=this.contentArray[this.contentArray.length-1];
		
	}
	populateBase(){
		var __this=this;
		var header=$('<div class="content--header"><div class="grid"></div></div>');
		$.each(this.first, function(index, item){
			item.clone().appendTo(header.find('.grid'));
		})
		header.prependTo(this.gridBase);
		var footer=$('<div class="content--footer"><div class="grid"></div></div>');
		$.each(this.last, function(index, item){
			item.clone().appendTo(footer.find('.grid'));	
		});
		footer.appendTo(this.gridBase);
		
		for(var x=1; x<this.contentArray.length-1; x++){
			var array=this.contentArray[x];
			this.innerArray.push(array);
			this.populateBaseInner(array, x);
		}
	}
	
	populateBaseInner(array, index){
		var __this=this;
		var block=$('<div class="footer--inner-col grid--new one-whole medium-up--seven-col medium-up--margin-left-col" dataColIndex="'+index+'"><div class="grid grid--html flex-align--end"></div></div>');
		var cnt=0;
		$.each(array, function(index, item){
			if(item.is('.image-block')){
				block.addClass('image-col');
				item.find('img').clone().appendTo(block);
			}else if(item.is('.html-block')) {
				var className="one-whole medium-up--one-half";
				var paddingClassName=!cnt ? '':'padding-top-double';
				var head=item.find('h2, h3').first();
				if(head.length){
					var str=head.text().split(' | ');
					if(str.length>1){
						if(str.indexOf('fullwidth')>-1) className="one-whole";
						head.text(str[0]);
					}
				}
				var el=$('<div class="'+className+' '+paddingClassName+'"></div>');
				item.clone().appendTo(el);
				el.appendTo(block.find('.grid--html'));
				cnt++;
			}else if(item.is('.form-block')){
				var el=item.clone()
				el.appendTo(block);
				/*
				var field=el.find('.field');
				field.each(function(){
					
					var place=$.trim($(this).find('.title').text()).replace(/(\r\n|\n|\r)/gm, " ");
					console.log(place+'place');
					var input=$(this).find('input, textarea');
					input.attr('placeholder', 'testing placeholder text');
					
				})
				*/
			}else if(item.is('.horizontalrule-block')){
				
			}else{
				item.clone().appendTo(block);
			}
		})
		block.appendTo(this.grid);
	}
}


// ==============================================
// 		block (content)
// ==============================================

class ContentBlock {
	
	constructor(array, elArray){
		var __this=this;
		this.container=$('#track');
		this.array=array;
		this.elArray=elArray;
		this.innerArray=[];
		/*
		this.first=this.array[0];	
		this.last=this.array[this.array.length-1];
		*/
		
		this.createBase();
		this.createContent();
		this.populateBase();
	}
	createBase(){
		var __this=this;
		this.section=$('<div class="section section--content padding-top-double padding-bottom-double medium-up--padding-top-col medium-up--padding-bottom-col" dataVisibilityElement="1"><div class="wrapper"><div class="grid grid--column"><div class="grid grid--content"></div></div></div></div>');
		this.section.appendTo(this.container);
		this.wrapper=this.section.find('.wrapper');
		this.gridBase=this.section.find('.grid--column');
		this.grid=this.section.find('.grid:not(.grid--column)');
	}
	createContent(){
		var __this=this;
		this.contentArray=[];
		var cnt=0;
		$.each(this.array, function(index, item){
			if($(this).is('.html-block')) {
				__this.contentArray.push(item);
				item.attr('dataTransitionDelay', cnt);
				cnt++;
			}
		});
		this.first=this.contentArray[0];
		this.last=this.contentArray[this.contentArray.length-1];
	}
	populateBase(){
		var __this=this;
		var header=$('<div class="content--header"><div class="grid"></div></div>');
		this.first.clone().prependTo(header.find('.grid'));
		header.prependTo(this.gridBase);
		var footer=$('<div class="content--footer"><div class="grid"></div></div>');
		this.last.clone().prependTo(footer.find('.grid'));
		footer.appendTo(this.gridBase);
		
		for(var x=1; x<this.contentArray.length-1; x++){
			var el=this.contentArray[x];
			this.innerArray.push(el);
			var addEl=el.clone();
			var blockWidth='medium-up--seven-col';
			// testing strings
			var str=el.text().split(' | ');
			if(str.length>1){
				var options=str[1];
				if(options.indexOf('fullwidth')>-1) blockWidth=' medium-up--padding-bottom-double';
			}
			addEl.addClass('one-whole '+blockWidth+' medium-up--margin-left-col')
			addEl.appendTo(this.grid);
			this.sanitiseBlock(addEl);
		}
		
		this.updateWrapper();
	}
	updateWrapper(){
		if(this.innerArray.length==1)this.wrapper.addClass('wrapper--ten-col')
		if(this.innerArray.length==2) this.wrapper.addClass('wrapper--seventeen-col')
	}
	sanitiseBlock(el){
		var __this=this;
		var elArray=el.find('.sqs-html-content > *');
		elArray.each(function(){
			var el=$(this);
			var str=el.text().split(' | ');
			el.text(str[0]+'\u00A0');
		})
	}
}

// ==============================================
// 		block (base image)
// ==============================================

class ImageBlock {
	
	constructor(array, elArray){
		var __this=this;
		this.container=$('#track');
		this.array=array;
		this.elArray=elArray;
		this.first=this.array[0];
		this.createBase();
		this.populateBase();
	}
	createBase(){
		var __this=this;
		this.section=$('<div class="section section--image-overlay" dataVisibilityElement="1"><div class="image--caption padding-top--double padding-bottom-double padding-left padding-right medium-up--padding-top-col medium-up--padding-bottom-col medium-up--padding-left-col medium-up--padding-right-col"><div class="grid grid--column"></div></div></div>');
		this.section.appendTo(this.container);
		this.wrapper=this.section.find('.wrapper');
		this.grid=this.section.find('.grid--column');
	}
	populateBase(){
		var __this=this;
		this.img=this.first.find('img');
		this.overlayText=this.first.find('figcaption');
		this.heading=this.overlayText.find('.image-title-wrapper > div');
		this.subheading=this.overlayText.find('.image-subtitle-wrapper > div');
		var imgEl=$('<div class="image--overlay"></div>');
		this.img.attr('class');
		var imgAttr=this.img.attr('alt');
		if(typeof imgAttr!='undefined') {
			if(imgAttr.indexOf('width100')>-1) this.section.addClass('width--full');
			if(imgAttr.indexOf('darkimage')>-1) this.section.addClass('dark--image');
		}
		this.img.clone().prependTo(imgEl);
		imgEl.prependTo(this.section);
		var imgWidth=parseInt(this.img.attr('width'));
		var imgHeight=parseInt(this.img.attr('height'));
		var aspect=imgWidth/imgHeight;
		
		if(this.array.length){
			this.content=$('<div class="image--overlay__content"></div>').append(this.subheading.clone());
			this.grid.append(this.content);
			$.each(this.array, function(index, item){
				if(item.is('.html-block')) item.clone().appendTo(__this.content);
			})
		}
	}
}

(function($) {
	$(document).ready(function(){ 
		var url=window.location.href;
		if(url.indexOf('squarespace')==-1) new Loader();
		else {
			$('body').addClass('admin');
		}
	})
})(jQuery);
