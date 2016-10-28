
    //生成随机数
    function pRandom(arr){
        var max = Math.max(arr[0],arr[1]),
            min = Math.min(arr[0],arr[1]),
            diff = max - min,
            num = Math.ceil(Math.random()*diff + min);
            return num;
    }
    //翻转控制
    function turn(ele){
        var classN = ele.className;
        if(/photo-front/.test(classN)){
            classN = classN.replace(/photo-front/,'photo-back');
        }else{
            classN = classN.replace(/photo-back/,'photo-front');
        }
        return ele.className = classN;
    }

    //公共函数
    function g(selector){
        var method = selector.substr(0,1) == '.'? 'getElementsByClassName' : 'getElementById';
        return document[method](selector.substr(1));
    }

    var data = data;
    function addPhotos(){
        var str = g('#wrap').innerHTML;
        var html = [];
        for(s in data){
            var iHtml = str.replace('{{index}}',s)
                .replace('{{img}}',data[s].img)
                .replace('{{caption}}',data[s].caption)
                .replace('{{desc}}',data[s].desc);
            html.push(iHtml);
        }
        g('#wrap').innerHTML = html.join('');

        pSort(pRandom([0,data.length-1]));
    }
    addPhotos();

    //排序海报
    function pSort(n){
        var photos = g('.photo');
        var arr = [];
        for(i=0;i<photos.length;i++){
            photos[i].className = photos[i].className.replace(/\s*photo-center\s*/,' ');
            photos[i].className = photos[i].className.replace(/\s*photo-back\s*/,' ');
            photos[i].className = photos[i].className.replace(/\s*photo-front\s*/,' ');

            //photos[i].className += 'photo-front';

            photos[i].style.left = '';
            photos[i].style.top = '';
            photos[i].style['-webkit-transform'] = 'rotate(0deg)';
            arr.push(photos[i]);
        }
        var photo_center = g('#photo-'+n);
        photo_center.className += ' photo-center';
        
        photo_center = arr.splice(n,1)[0];

        //以中位数作为基准  左右分区

        var photoL = arr.splice(0, Math.ceil(arr.length/2));
        var photoR = arr;
        //console.log(photoL.length+'-'+photoR.length)

        var ran = range();
        //console.log(ran)

        //左右分区 随机分配

        for(i in photoL){
            var photo = photoL[i];
            photo.style.left = pRandom(ran.left.x) + 'px';
            photo.style.top = pRandom(ran.left.y) + 'px';
            //console.log(photo)
            photo.style['-webkit-transform'] = 'rotate('+pRandom([-180,180])+'deg)';
        }

        for(i in photoR){
            //console.log(i)
            var photo = photoR[i];
            //photo.style.left = pRandom(ran.right.x) + 'px';
            //photo.style.top = pRandom(ran.right.y) + 'px';
            photo.style['-webkit-transform'] = 'translate('+pRandom(ran.right.x)+'px,'+pRandom(ran.right.y)+'px) rotate('+pRandom([-180,180])+'deg)';
        }
    }

    function range(){
        var range = {left:{x:{}, y:{}},right:{x:{}, y:{}}};
        var wrapO = {
            w:g('#wrap').clientWidth,
            h:g('#wrap').clientHeight
        };
        
        var photoO = {
            w:g('.photo')[0].clientWidth,
            h:g('.photo')[0].clientHeight
        };


        range.wrap = wrapO;
        range.photo = photoO;
        range.left.x = [0 - range.photo.w, (range.wrap.w - range.photo.w)/2];
        range.left.y = [0 - range.photo.h, range.wrap.h];
        range.right.x = [(range.wrap.w - range.photo.w)/2, range.wrap.w + range.photo.w/2];
        range.right.y = range.left.y;
        return range;
    }