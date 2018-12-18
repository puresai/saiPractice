# ThinkPHP5系列------路由
---
## 一.路由配置
ThinkPHP5.0的路由比较灵活，并且不需要强制定义，可以总结归纳为如下三种方式：
### 1. 普通模式
关闭路由，完全使用默认的PATH_INFO方式URL：
'url_route_on'  =>  false,
路由关闭后，不会解析任何路由规则，采用默认的PATH_INFO 模式访问URL：
>http://serverName/index.php/module/controller/action/param/value/...

但仍然可以通过操作方法的参数绑定、空控制器和空操作等特性实现URL地址的简化。
可以设置url_param_type配置参数来改变pathinfo模式下面的参数获取方式，默认是按名称成对解析，支持按照顺序解析变量，只需要更改为：
>// 按照顺序解析变量
'url_param_type'    =>  1,
### 2.混合模式
开启路由，并使用路由定义+默认PATH_INFO方式的混合：
>'url_route_on'  =>  true,
'url_route_must'=>  false,

该方式下面，对需要定义路由规则的访问地址定义路由规则，其它的仍然按照第一种普通模式的PATH_INFO模式访问URL。
### 3. 强制模式
开启路由，并设置必须定义路由才能访问：

>'url_route_on'  		=>  true,
'url_route_must'		=>  true,

这种方式下面必须严格给每一个访问地址定义路由规则（包括首页），否则将抛出异常。

首页的路由规则采用/定义即可，例如下面把网站首页路由输出Hello,world!

>Route::get('/',function(){
    return 'Hello,world!';
});

---
## 二.注册路由规则
路由注册可以采用方法动态单个和批量注册，也可以直接定义路由定义文件的方式进行集中注册。

### 1.动态注册
路由定义采用\think\Route类的rule方法注册，通常是在应用的路由配置文件application/route.php进行注册，格式是：
Route::rule(‘路由表达式’,‘路由地址’,‘请求类型’,‘路由参数（数组）’,‘变量规则（数组）’);
例如注册如下路由规则：

>use think\Route;
// 注册路由到index模块的News控制器的read操作
Route::rule('new/:id','index/News/read');

我们访问：
>http://serverName/new/5

ThinkPHP5.0的路由规则定义是从根目录开始，而不是基于模块名的。
会自动路由到：
>http://serverName/index/news/read/id/5

并且原来的访问地址会自动失效。

路由表达式（第一个参数）支持定义命名标识，例如：

>// 定义new路由命名标识
Route::rule(['new','new/:id'],'index/News/read');

注意，路由命名标识必须唯一，定义后可以用于URL的快速生成。
可以在rule方法中指定请求类型，不指定的话默认为任何请求类型，例如：

>Route::rule('new/:id','News/update','POST');

表示定义的路由规则在POST请求下才有效。

请求类型包括：
类型 |	描述
--- | ---
GET |GET请求
POST|	POST请求
PUT|	PUT请求
DELETE|	DELETE请求
*	任何请求类型
注意：请求类型参数必须大写。
系统提供了为不同的请求类型定义路由规则的简化方法，例如：

>Route::get('new/:id','News/read'); // 定义GET请求路由规则
Route::post('new/:id','News/update'); // 定义POST请求路由规则
Route::put('new/:id','News/update'); // 定义PUT请求路由规则
Route::delete('new/:id','News/delete'); // 定义DELETE请求路由规则
Route::any('new/:id','News/read'); // 所有请求都支持的路由规则

如果要定义get和post请求支持的路由规则，也可以用：

>Route::rule('new/:id','News/read','GET|POST');
我们也可以批量注册路由规则，例如：

>Route::rule(['new/:id'=>'News/read','blog/:name'=>'Blog/detail']);
Route::get(['new/:id'=>'News/read','blog/:name'=>'Blog/detail']);
Route::post(['new/:id'=>'News/update','blog/:name'=>'Blog/detail']);

注册多个路由规则后，系统会依次遍历注册过的满足请求类型的路由规则，一旦匹配到正确的路由规则后则开始调用控制器的操作方法，后续规则就不再检测。

路由表达式
路由表达式统一使字符串定义，采用规则定义的方式。

正则路由定义功能已经废除，改由变量规则定义完成。
规则表达式
规则表达式通常包含静态地址和动态地址，或者两种地址的结合，例如下面都属于有效的规则表达式：

>'/' => 'index', // 首页访问路由
'my'        =>  'Member/myinfo', // 静态地址路由
'blog/:id'  =>  'Blog/read', // 静态地址和动态地址结合
'new/:year/:month/:day'=>'News/read', // 静态地址和动态地址结合
':user/:blog_id'=>'Blog/read',// 全动态地址

规则表达式的定义以/为参数分割符（无论你的PATH_INFO分隔符设置是什么，请确保在定义路由规则表达式的时候统一使用/进行URL参数分割）。
每个参数中以“:”开头的参数都表示动态变量，并且会自动绑定到操作方法的对应参数。

可选定义
支持对路由参数的可选定义，例如：

>'blog/:year/[:month]'=>'Blog/archive',

[:month]变量用[ ]包含起来后就表示该变量是路由匹配的可选变量。
以上定义路由规则后，下面的URL访问地址都可以被正确的路由匹配：

>http://serverName/index.php/blog/2015
http://serverName/index.php/blog/2015/12

采用可选变量定义后，之前需要定义两个或者多个路由规则才能处理的情况可以合并为一个路由规则。

可选参数只能放到路由规则的最后，如果在中间使用了可选参数的话，后面的变量都会变成可选参数。
#### 完全匹配
规则匹配检测的时候只是对URL从头开始匹配，只要URL地址包含了定义的路由规则就会匹配成功，如果希望完全匹配，可以在路由表达式最后使用$符号，例如：

> 'new/:cate$'=> 'News/category',
http://serverName/index.php/new/info

会匹配成功,而

>http://serverName/index.php/new/info/2 

则不会匹配成功。

如果是采用

>'new/:cate'=> 'News/category',

方式定义的话，则两种方式的URL访问都可以匹配成功。

如果你希望所有的路由定义都是完全匹配的话，可以直接配置

>// 开启路由定义的全局完全匹配
'route_complete_match'  =>  true,

当开启全局完全匹配的时候，如果个别路由不需要使用完整匹配，可以添加路由参数覆盖定义：

>Route::rule('new/:id','News/read','GET|POST',['complete_match' => false]);

#### 额外参数
在路由跳转的时候支持额外传入参数对（额外参数指的是不在URL里面的参数，隐式传入需要的操作中，有时候能够起到一定的安全防护作用，后面我们会提到）。例如：

>'blog/:id'=>'blog/read?status=1&app_id=5',

上面的路由规则定义中额外参数的传值方式都是等效的。status和app_id参数都是URL里面不存在的，属于隐式传值，当然并不一定需要用到，只是在需要的时候可以使用。


### 2.批量注册
如果不希望一个个注册，可以使用批量注册，规则如下：

>Route::rule([
'路由规则1'=>'路由地址和参数',
'路由规则2'=>['路由地址和参数','匹配参数（数组）','变量规则（数组）']
...
],'','请求类型','匹配参数（数组）','变量规则');

如果在外面和规则里面同时传入了匹配参数和变量规则的话，路由规则定义里面的最终生效，但请求类型参数以最外层决定，例如：

>Route::rule([
    'new/:id'  =>  'News/read',
    'blog/:id' =>  ['Blog/update',['ext'=>'shtml'],['id'=>'\d{4}']],
    ...
],'','GET',['ext'=>'html'],['id'=>'\d+']);

以上的路由注册，最终blog/:id只会在匹配shtml后缀的访问请求，id变量的规则则是 \d{4}。
如果不同的请求类型的路由规则是一样的，为了避免数组索引冲突的问题，请使用单独的请求方法定义路由。
同样，我们也可以使用其他几个注册方法进行批量注册。

>// 批量注册GET路由
Route::get([
    'new/:id'  =>  'News/read',
    'blog/:id' =>  ['Blog/edit',[],['id'=>'\d+']]
    ...
]);
// 效果等同于
Route::rule([
    'new/:id'  =>  'News/read',
    'blog/:id' =>  ['Blog/edit',[],['id'=>'\d+']]
    ...
],'','GET');

### 3.定义路由配置文件
除了支持动态注册，也可以直接在应用目录下面的*route.php* 的最后通过返回数组的方式直接定义路由规则，内容示例如下：
>return [
    'new/:id'   => 'News/read',
    'blog/:id'   => ['Blog/update',['method' => 'post|put'], ['id' => '\d+']],
];

路由配置文件定义的路由规则效果和使用any注册路由规则一样。
路由动态注册和配置定义的方式可以共存，例如：

>use think\Route;
Route::rule('hello/:name','index/index/hello');
return [
    'new/:id'   => 'News/read',
    'blog/:id'   => ['Blog/update',['method' => 'post|put'], ['id' => '\d+']],
];

默认情况下，只会加载一个路由配置文件route.php，如果你需要定义多个路由文件，可以修改route_config_file配置参数，例如：
>// 定义路由配置文件（数组）
'route_config_file' =>  ['route', 'route1', 'route2'],
如果存在相同的路由规则，一样可以参考前面的批量注册方式进行定义。

由于检测机制问题，动态注册的性能比路由配置要高一些，尤其是多种请求类型混合定义的时候。

---

## 三.变量规则
ThinkPHP5.0支持在规则路由中为变量用正则的方式指定变量规则，弥补了动态变量无法限制具体的类型问题，并且支持全局规则设置。使用方式如下：

### 1.全局变量规则
设置全局变量规则，全部路由有效：

>// 设置name变量规则（采用正则定义）
Route::pattern('name','\w+');
// 支持批量添加
Route::pattern([
    'name'  =>  '\w+',
    'id'    =>  '\d+',
]);
### 2.局部变量规则
局部变量规则，仅在当前路由有效：

>// 定义GET请求路由规则 并设置name变量规则
Route::get('new/:name','News/read',[],['name'=>'\w+']);
如果一个变量同时定义了全局规则和局部规则，局部规则会覆盖全局变量的定义。

### 3.完整URL规则
如果要对整个URL进行规则检查，可以进行__url__ 变量规则，例如：
>// 定义GET请求路由规则 并设置完整URL变量规则
Route::get('new/:id','News/read',[],['__url__'=>'new\/\w+$']);


---
## 四.路由参数
路由参数是指可以设置一些路由匹配的条件参数，主要用于验证当前的路由规则是否有效，主要包括：

参数 |	说明
--- | ---
method	|请求类型检测，支持多个请求类型
ext	|URL后缀检测，支持匹配多个后缀
deny_ext|	URL禁止后缀检测，支持匹配多个后缀
https	|检测是否https请求
domain	|域名检测
before_behavior|	前置行为（检测）
after_behavior	|后置行为（执行）
callback	|自定义检测方法
merge_extra_vars|	合并额外参数
bind_model	|绑定模型（V5.0.1+）
cache	|请求缓存（V5.0.1+）
param_depr|	路由参数分隔符（V5.0.2+）
ajax	|Ajax检测（V5.0.2+）
pjax	|Pjax检测（V5.0.2+）


---
## 五.路由地址定义
路由地址表示定义的路由表达式最终需要路由到的地址以及一些需要的额外参数，支持下面5种方式定义：

定义方式|	定义格式
---|---
方式1：路由到模块/控制器|	‘[模块/控制器/操作]?额外参数1=值1&额外参数2=值2…’
方式2：路由到重定向地址	|‘外部地址’（默认301重定向） 或者 [‘外部地址’,‘重定向代码’]
方式3：路由到控制器的方法	|‘@[模块/控制器/]操作’（V5.0.4+）
方式4：路由到类的方法	|‘\完整的命名空间类::静态方法’ 或者 ‘\完整的命名空间类@动态方法’（V5.0.4+）
方式5：路由到闭包函数	|闭包函数定义（支持参数传入）


### 1. 路由到模块/控制器/操作
这是最常用的一种路由方式，把满足条件的路由规则路由到相关的模块、控制器和操作，然后由App类调度执行相关的操作。

同时会进行模块的初始化操作（包括配置读取、公共文件载入、行为定义载入、语言包载入等等）。

路由地址的格式为：

>[模块/控制器/]操作?参数1=值1&参数2=值2…

解析规则是从操作开始解析，然后解析控制器，最后解析模块，例如：

>// 路由到默认或者绑定模块
'blog/:id'=>'blog/read',
// 路由到index模块
'blog/:id'=>'index/blog/read',

Blog类定义如下：

>namespace app\index\controller;
class Blog {
    public function read($id){
        return 'read:'.$id;
    }
}

路由地址中支持多级控制器，使用下面的方式进行设置：

>'blog/:id'=>'index/group.blog/read'

表示路由到下面的控制器类，

>index/controller/group/Blog

Blog类定义如下：

>namespace app\index\controller\group;
class Blog {
    public function read($id){
        return 'read:'.$id;
    }
}

还可以支持路由到动态的模块、控制器或者操作，例如：

>// action变量的值作为操作方法传入
':action/blog/:id' => 'index/blog/:action'
// 变量传入index模块的控制器和操作方法
':c/:a'=> 'index/:c/:a'

如果关闭路由功能的话，默认也会按照该规则对URL进行解析调度。
#### 2.额外参数
在这种方式路由跳转的时候支持额外传入参数对（额外参数指的是不在URL里面的参数，隐式传入需要的操作中，有时候能够起到一定的安全防护作用，后面我们会提到）。例如：

>'blog/:id'=>'blog/read?status=1&app_id=5',

上面的路由规则定义中额外参数status和app_id参数都是URL里面不存在的，属于隐式传值，当然并不一定需要用到，只是在需要的时候可以使用。
路由到操作方法
路由地址的格式为：

>@[模块/控制器/]操作
这种方式看起来似乎和第一种是一样的，本质的区别是直接执行某个控制器类的方法，而不需要去解析 模块/控制器/操作这些，同时也不会去初始化模块。
例如，定义如下路由后：
>'blog/:id'=>'@index/blog/read',

系统会直接执行

>Loader::action('index/blog/read');

相当于直接调用 \app\index\controller\blog类的read方法。

Blog类定义如下：

>namespace app\index\controller;
class Blog {
    public function read($id){
        return 'read:'.$id;
    }
}

通常这种方式下面，由于没有定义当前模块名、当前控制器名和当前方法名 ，从而导致视图的默认模板规则失效，所以这种情况下面，如果使用了视图模板渲染，则必须传入明确的参数。

#### 路由到类的方法
路由地址的格式为（动态方法）：

>\类的命名空间\类名@方法名

或者（静态方法）

>\类的命名空间\类名::方法名

这种方式更进一步，可以支持执行任何类的方法，而不仅仅是执行控制器的操作方法，例如：

>'blog/:id'=>'\app\index\service\Blog@read',

执行的是 \app\index\service\Blog类的read方法。
也支持执行某个静态方法，例如：
>'blog/:id'=>'\app\index\service\Blog::read',

V5.0.4+版本开始，支持传入额外的参数作为方法的参数调用（用于参数绑定），例如：
>'blog/:id'=>'\app\index\service\Blog::read?status=1',
#### 路由到重定向地址
重定向的外部地址必须以“/”或者http开头的地址。

如果路由地址以“/”或者“http”开头则会认为是一个重定向地址或者外部地址，例如：

>'blog/:id'=>'/blog/read/id/:id'

和

>'blog/:id'=>'blog/read'

虽然都是路由到同一个地址，但是前者采用的是301重定向的方式路由跳转，这种方式的好处是URL可以比较随意（包括可以在URL里面传入更多的非标准格式的参数），而后者只是支持模块和操作地址。举个例子，如果我们希望avatar/123重定向到
>/member/avatar/id/123_small的话，只能使用：
'avatar/:id'=>'/member/avatar/id/:id_small'

路由地址采用重定向地址的话，如果要引用动态变量，直接使用动态变量即可。

采用重定向到外部地址通常对网站改版后的URL迁移过程非常有用，例如：

>'blog/:id'=>'http://blog.thinkphp.cn/read/:id'

表示当前网站（可能是http://thinkphp.cn ）的 blog/123地址会直接重定向到 http://blog.thinkphp.cn/read/123。

还有更多路由请看官网说明。[完全开发手册][1]


  [1]: https://www.kancloud.cn/manual/thinkphp5/118029/ 