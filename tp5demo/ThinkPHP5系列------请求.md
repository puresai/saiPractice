# ThinkPHP5系列------请求
---
## 一.请求信息
如果要获取当前的请求信息，可以使用\think\Request类，
除了下文中的
>$request = Request::instance();

也可以使用助手函数

>$request = request();

当然，最方便的还是使用注入请求对象的方式来获取变量。
例如：

>获取URL信息
$request = Request::instance();
// 获取当前域名
echo 'domain: ' . $request->domain() . '<br/>';
// 获取当前入口文件
echo 'file: ' . $request->baseFile() . '<br/>';
// 获取当前URL地址 不含域名
echo 'url: ' . $request->url() . '<br/>';
// 获取包含域名的完整URL地址
echo 'url with domain: ' . $request->url(true) . '<br/>';
// 获取当前URL地址 不含QUERY_STRING
echo 'url without query: ' . $request->baseUrl() . '<br/>';
// 获取URL访问的ROOT地址
echo 'root:' . $request->root() . '<br/>';
// 获取URL访问的ROOT地址
echo 'root with domain: ' . $request->root(true) . '<br/>';
// 获取URL地址中的PATH_INFO信息
echo 'pathinfo: ' . $request->pathinfo() . '<br/>';
// 获取URL地址中的PATH_INFO信息 不含后缀
echo 'pathinfo: ' . $request->path() . '<br/>';
// 获取URL地址中的后缀信息
echo 'ext: ' . $request->ext() . '<br/>';

输出结果为：

>domain: http://tp5.com
file: /index.php
url: /index/index/hello.html?name=thinkphp
url with domain: http://tp5.com/index/index/hello.html?name=thinkphp
url without query: /index/index/hello.html
root:
root with domain: http://tp5.com
pathinfo: index/index/hello.html
pathinfo: index/index/hello
ext: html

### 设置/获取 模块/控制器/操作名称
>$request = Request::instance();
echo "当前模块名称是" . $request->module();
echo "当前控制器名称是" . $request->controller();
echo "当前操作名称是" . $request->action();

如果当前访问的地址是 http://serverName/index.php/index/hello_world/index
输出结果为：

>当前模块名称是index
当前控制器名称是HelloWorld
当前操作名称是index

设置模块名称值需要向module方法中传入名称即可，同样使用于设置控制器名称和操作名称

>Request::instance()->module('module_name');

获取请求参数
>$request = Request::instance();
echo '请求方法：' . $request->method() . '<br/>';
echo '资源类型：' . $request->type() . '<br/>';
echo '访问ip地址：' . $request->ip() . '<br/>';
echo '是否AJax请求：' . var_export($request->isAjax(), true) . '<br/>';
echo '请求参数：';
dump($request->param());
echo '请求参数：仅包含name';
dump($request->only(['name']));
echo '请求参数：排除name';
dump($request->except(['name']));

输出结果为：

>请求方法：GET
资源类型：html
访问ip地址：127.0.0.1
是否Ajax请求：false
请求参数：
array (size=2)
  'test' => string 'ddd' (length=3)
  'name' => string 'thinkphp' (length=8)
  
  
>请求参数：仅包含name
array (size=1)
  'name' => string 'thinkphp' (length=8)
  
>请求参数：排除name
array (size=1)
  'test' => string 'ddd' (length=3)
获取路由和调度信息
hello方法修改如下：

>$request = Request::instance();
echo '路由信息：';
dump($request->route());
echo '调度信息：';
dump($request->dispatch());

路由定义为：

>return [
    'hello/:name' =>['index/hello',[],['name'=>'\w+']],
];
访问下面的URL地址：

http://serverName/hello/thinkphp

输出信息为：

>路由信息：
array (size=4)
  'rule' => string 'hello/:name' (length=11)
  'route' => string 'index/hello' (length=11)
  'pattern' => 
    array (size=1)
      'name' => string '\w+' (length=3)
  'option' => 
    array (size=0)
      empty
      
调度信息：
>array (size=2)
  'type' => string 'module' (length=6)
  'module' => 
    array (size=3)
      0 => null
      1 => string 'index' (length=5)
      2 => string 'hello' (length=5)
      
### 设置请求信息
如果某些环境下面获取的请求信息有误，可以手动设置这些信息参数，使用下面的方式：

>$request = Request::instance();
$request->root('index.php');
$request->pathinfo('index/index/hello');


---
二.输入变量
参见[完全开发手册][1]

---
## 三.更改变量
参见[完全开发手册][2]

---
## 四.请求类型
参见[完全开发手册][3]

---
## 五.请求伪装
请求类型伪装
支持请求类型伪装，可以在POST表单里面提交_method变量，传入需要伪装的请求类型，例如：
<form method="post" action="">
    <input type="text" name="name" value="Hello">
    <input type="hidden" name="_method" value="PUT" >
    <input type="submit" value="提交">
</form>
提交后的请求类型会被系统识别为PUT请求。
你可以设置为任何合法的请求类型，包括GET、POST、PUT和DELETE等。
如果你需要改变伪装请求的变量名，可以修改应用配置文件：

>// 表单请求类型伪装变量
'var_method'             => '_m',
AJAX/PJAX伪装
可以对请求进行AJAX请求伪装，如下：
http://localhost/index?_ajax=1 
或者PJAX请求伪装
http://localhost/index?_pjax=1 
如果你需要改变伪装请求的变量名，可以修改应用配置文件：

>// 表单ajax伪装变量
'var_ajax'               => '_a',
// 表单pjax伪装变量
'var_pjax'               => '_p',
_ajax和_pjax可以通过GET/POST/PUT等请求变量伪装。

---
## 六.注入
###1.方法注入
如果你需要在Request请求对象中添加自己的方法，可以使用Request对象的方法注入功能，例如：
```
// 通过hook方法注入动态方法
Request::hook('user','getUserInfo');
getUserInfo函数定义如下
function getUserInfo(Request $request, $userId)
{
    return $info; // 根据$userId获取用户信息
}
```
接下来，我们可以直接在控制器中使用：

```
public function index()
{
    $info = Request::instance()->user($userId);
}
```

### 2.属性注入
可以动态注入当前Request对象的属性，方法：
>// 动态绑定属性
Request::instance()->bind('user',new User);
// 或者使用
Request::instance()->user = new User;
获取绑定的属性使用下面的方式：

>Request::instance()->user;

如果控制器注入请求对象的话，也可以直接使用

>$this->request->user;

或者使用助手函数：

>request()->user;

### 3.依赖注入
ThinkPHP的依赖注入（也称之为控制反转）是一种较为轻量的实现，无需任何的配置，并且主要针对访问控制器进行依赖注入。可以在控制器的构造函数或者操作方法（指访问请求的方法）中类型声明任何（对象类型）依赖，这些依赖会被自动解析并注入到控制器实例或方法中。

### 自动注入请求对象
架构方法注入
在控制器的架构方法中会自动注入当前请求对象，例如：
```
namespace app\index\controller;
use think\Request;
class Index
{
	protected $request;
    
	public function __construct(Request $request)
    {
    	$this->request = $request;
    }
    
    public function hello()
    {
        return 'Hello,' . $this->request->param('name') . '！';
    }
    
}
```
#### 操作方法注入
控制器的操作方法中如果需要调用请求对象Request的话，可以在方法中定义Request类型的参数，并且参数顺序无关，例如：
```
namespace app\index\controller;
use think\Request;
class Index
{
    public function hello(Request $request)
    {
        return 'Hello,' . $request->param('name') . '！';
    }
    
}
```
访问URL地址的时候 无需传入request参数，系统会自动注入当前的Request对象实例到该参数。
如果继承了系统的Controller类的话，也可以直接调用request属性，例如：
<?php
namespace app\index\controller;
use think\Controller;
class Index extends Controller
{

    public function hello()
    {
        return 'Hello,'.$this->request->param('name');
    }
    
}
#### 其它对象自动注入（V5.0.1）
从5.0.1版本开始，控制器的架构方法和操作方法支持任意对象的自动注入。
架构方法注入
```
namespace app\index\controller;
use app\index\model\User;
use think\Request;
class Index
{
	protected $request;
    protected $user;
    
	public function __construct(Request $request, User $user)
    {
    	$this->request = $request;
        $this->user = $user;
    }
    
}
```
对于已经进行了绑定（属性注入）的对象，即可自动完成依赖注入，如果没有进行对象绑定的话，会自动实例化一个新的对象示例传入（如果类定义有instance方法，则会自动调用instance方法进行实例化）。
架构方法的依赖注入不影响其它类型的参数绑定。

操作方法注入
我们把User模型绑定到当前请求对象：
>Request::instance()->bind('user', \app\index\model\User::get(1));

然后就可以在操作方法中进行对象参数的自动注入，代码：
```
<?php
namespace app\index\controller;
use app\index\model\User;
use think\Controller;

class Index extends Controller
{

    public function hello(User $user)
    {
        return 'Hello,'.$user->name;
    }
    
}
```
如果没有事先在Request对象中进行对象绑定的话，调用hello方法的时候user参数会自动实例化，相当于完成了下面的绑定操作：
>Request::instance()->bind('user', new \app\index\model\User);

对象自动注入不影响原来的参数绑定。
#### invoke方法自动调用（v5.0.2）
5.0.2版本开始，如果依赖注入的类有定义一个可调用的静态invoke方法，则会自动调用invoke方法完成依赖注入的自动实例化。
invoke方法的参数是当前请求对象实例，例如：
```
namespace app\index\model;
use think\Model;
class User extends Model
{
	public static function invoke(Request $request)
    {
    	$id = $request->param('id');
        return User::get($id);
    }
}
```


  [1]: https://www.kancloud.cn/manual/thinkphp5/118044
  [2]: https://www.kancloud.cn/manual/thinkphp5/205109
  [3]: https://www.kancloud.cn/manual/thinkphp5/118045