(function( $ ) {
  min_trigger_length = typeof min_trigger_length !== 'undefined' ? min_trigger_length : 3;
  $.fn.suggestive_multiselect = function(source,target,url,name,min_trigger_length) {
  
    min_trigger_length = typeof min_trigger_length !== 'undefined' ? min_trigger_length : 3;
	  function SuggestiveMultiSelect(source,target,url,name,min_trigger_length){
			this.results={};
			this.checked={};
			this.source=source;
			this.target=target;
			this.url = url;
			this.name =name;
			this.min_trigger_length=min_trigger_length;
		}
		
		
		SuggestiveMultiSelect.prototype.render_checked=function(){
			var self = this;
			$(self.target).empty();
			$.each(this.checked,function(key,val){
				$(self.target).append('<label class="checkbox"><input name='+self.name+' type="checkbox" value="'+key+'" checked/>'+val+'</label>');
			});
			$('input',$(self.target)).change(function(e){
				self.remove_from_checked(this);
			});
		};
		
		SuggestiveMultiSelect.prototype.render_results=function(){
			var self = this;
			$(self.source).empty();
			$.each(this.results,function(key,val){
				if(!(key in self.checked)){
					$(self.source).append('<label class="checkbox"><input type="checkbox" name='+self.name+' value="'+key+'"/>'+val+'</label>');	
					$('input',$(self.source)).change(function(e){
						self.add_to_checked(this);
					});
				}
			});
		};
		
		SuggestiveMultiSelect.prototype.add_to_checked=function(ele){
			var self=this;
			this.checked[ele.value]=this.results[ele.value];
			$(ele).unbind('change');
			$(ele).change(function(e){
				self.remove_from_checked(this);
			});
			$(ele).parent('label').appendTo(this.target);
//			$(this.target).append($(ele).parent('label').html());
//			$(ele).parent('label').remove();
			//this.render_checked();
			//this.render_results();
		};
		
		SuggestiveMultiSelect.prototype.remove_from_checked=function(ele){
			var self=this;
			this.results[ele.value]=this.checked[ele.value];
			delete this.checked[ele.value];
			$(ele).unbind('change');
			$(ele).change(function(e){
				self.add_to_checked(this);
			});
			
//			$(this.source).append($(ele).parent('label').html());
//			$(ele).parent('label').remove();
			$(ele).parent('label').appendTo(this.source);
			//this.render_results();
			//this.render_checked();
		};
		
		SuggestiveMultiSelect.prototype.run=function(ele){
			var self = this;
			if(ele.value.length >= self.min_trigger_length){
				$.ajax({
					url:self.url,
					data:"term="+ele.value,
					success:function(data){
						self.results=data;
						self.render_results();
					},
				});	
			}else if(ele.value.length==0){
				self.results={};
				self.render_results();
			}
		}
		
		var obj=new SuggestiveMultiSelect(source=source,
				target=target,
				url = url,
				name =name,
				min_trigger_length=min_trigger_length);
  
    this.keyup(function(){
		obj.run(this);
	});

  };
})( jQuery );
