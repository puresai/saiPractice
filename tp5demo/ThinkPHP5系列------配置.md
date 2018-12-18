# ThinkPHP5系列------配置
---
> 相比3.x版本，tp5的配置更加灵活，也相对更复杂，但只要抓住重点，其实就比较好理解了。

## 一. 配置目录
系统默认的配置文件目录就是应用目录（APP_PATH），也就是默认的application下面，并分为应用配置（整个应用有效）和模块配置（仅针对该模块有效）。
├─application         应用目录
│  ├─config.php       应用配置文件
│  ├─database.php     数据库配置文件
│  ├─route.php        路由配置文件
│  ├─index            index模块配置文件目录
│  │  ├─config.php    index模块配置文件
│  │  └─database.php  index模块数据库配置文件

如果不希望配置文件放到应用目录下面，可以在入口文件中定义独立的配置目录，添加CONF_PATH常量定义即可，例如：
// 定义配置文件目录和应用目录同级
define('CONF_PATH', __DIR__.'/../config/');
配置目录下面的结构类似如下：

├─application         应用目录
├─config              配置目录
│  ├─config.php       应用配置文件
│  ├─database.php     数据库配置文件
│  ├─route.php        路由配置文件
│  ├─index            index模块配置文件目录
│  │  ├─config.php    index模块配置文件
│  │  └─database.php  index模块数据库配置文件

## 扩展配置目录（V5.0.1）
5.0.1开始增加了扩展配置目录的概念，在应用配置目录或者模块配置目录下面增加extra子目录，下面的配置文件都会自动加载，无需任何配置。
如果你定义了CONF_PATH常量为config目录为例，扩展配置目录如下：
├─application         应用目录
├─config              配置目录
│  ├─config.php       应用配置文件
│  ├─database.php     数据库配置文件
│  ├─route.php        路由配置文件
│  ├─extra            应用扩展配置目录
│  ├─index            index模块配置文件目录
│  │  ├─extra         index模块扩展配置目录
│  │  ├─config.php    index模块配置文件
│  │  └─database.php  index模块数据库配置文件
扩展配置文件的文件名（不含后缀）就是配置参数名，并且会和应用配置文件中的参数进行合并。

---
## 二.配置加载顺序
在ThinkPHP中，一般来说应用的配置文件是自动加载的，加载的顺序是：

> 惯例配置->应用配置->扩展配置->场景配置->模块配置->动态配置

以上是配置文件的加载顺序，因为后面的配置会覆盖之前的同名配置（在没有生效的前提下），所以配置的优先顺序从右到左。

---
## 三.多种配置
下面说明下不同的配置文件的区别和位置：

### 1.惯例配置

惯例重于配置是系统遵循的一个重要思想，框架内置有一个惯例配置文件（位于thinkphp/convention.php），按照大多数的使用对常用参数进行了默认配置。所以，对于应用的配置文件，往往只需要配置和惯例配置不同的或者新增的配置参数，如果你完全采用默认配置，甚至可以不需要定义任何配置文件。
### 2.应用配置
应用配置文件是应用初始化的时候首先加载的公共配置文件，默认位于application/config.php。
### 3.扩展配置
扩展配置文件是由extra_config_list配置参数定义的额外的配置文件，默认会加载database和validate两个扩展配置文件。
V5.0.1开始，取消了该配置参数，扩展配置文件直接放入application/extra目录会自动加载。
### 4.场景配置
每个应用都可以在不同的情况下设置自己的状态（或者称之为应用场景），并且加载不同的配置文件。

举个例子，你需要在公司和家里分别设置不同的数据库测试环境。那么可以这样处理，在公司环境中，我们在应用配置文件中配置：

>'app_status'=>'office'
那么就会自动加载该状态对应的配置文件（默认位于application/office.php）。
如果我们回家后，我们修改定义为：

>'app_status'=>'home'
那么就会自动加载该状态对应的配置文件（位于application/home.php）。
状态配置文件是可选的
模块配置
每个模块会自动加载自己的配置文件（位于application/当前模块名/config.php）。
模块还可以支持独立的状态配置文件，命名规范为：application/当前模块名/应用状态.php。
模块配置文件是可选的
如果你的应用的配置文件比较大，想分成几个单独的配置文件或者需要加载额外的配置文件的话，可以考虑采用扩展配置或者动态配置（参考后面的描述）。

### 5.动态配置
使用set方法动态设置参数，例如：
>Config::set('配置参数','配置值');
// 或者使用助手函数
config('配置参数','配置值');

也可以批量设置，例如：

>Config::set([
    '配置参数1'=>'配置值',
    '配置参数2'=>'配置值'
]);
// 或者使用助手函数
config([
    '配置参数1'=>'配置值',
    '配置参数2'=>'配置值'
]);


### 6.独立配置
独立配置文件
配置文件支持分离（也称为扩展配置），只需要在公共配置文件配置extra_config_list参数(V5.0.1版本已经废除该写法）。
例如，不使用独立配置文件的话，数据库配置信息应该是在config.php中配置如下：
>/* 数据库设置 */
'database'              => [
    // 数据库类型
    'type'        => 'mysql',
    // 服务器地址
    'hostname'    => '127.0.0.1',
    // 数据库名
    'database'    => 'thinkphp',
    // 数据库用户名
    'username'    => 'root',
    // 数据库密码
    'password'    => '',
    // 数据库连接端口
    'hostport'    => '',
    // 数据库连接参数
    'params'      => [],
    // 数据库编码默认采用utf8
    'charset'     => 'utf8',
    // 数据库表前缀
    'prefix'      => '',
    // 数据库调试模式
    'debug'       => false,
],
如果需要使用独立配置文件的话，则首先在config.php中添加配置：

>'extra_config_list'     => ['database'],
定义之后，数据库配置就可以独立使用database.php文件，配置内容如下：
/* 数据库设置 */
return [
    // 数据库类型
    'type'        => 'mysql',
    // 服务器地址
    'hostname'    => '127.0.0.1',
    // 数据库名
    'database'    => 'thinkphp',
    // 数据库用户名
    'username'    => 'root',
    // 数据库密码
    'password'    => '',
    // 数据库连接端口
    'hostport'    => '',
    // 数据库连接参数
    'params'      => [],
    // 数据库编码默认采用utf8
    'charset'     => 'utf8',
    // 数据库表前缀
    'prefix'      => '',
    // 数据库调试模式
    'debug'       => false,
],

如果配置了extra_config_list参数，并同时在config.php和database.php文件中都配置的话，则database.php文件的配置会覆盖config.php中的设置。
独立配置文件的参数获取都是二维配置方式，例如，要获取database独立配置文件的type参数，应该是：
> Config::get('database.type');

要获取完整的独立配置文件的参数，则使用：

> Config::get('database');

系统默认设置了2个独立配置文件，包括database和validate，分别用于设置数据库配置和验证规则定义。


---
## 四.加载配置文件
Config::load('配置文件名');
配置文件一般位于APP_PATH目录下面，如果需要加载其它位置的配置文件，需要使用完整路径，例如：
>Config::load(APP_PATH.'config/config.php');
系统默认的配置定义格式是PHP返回数组的方式，例如：

>return [
    '配置参数1'=>'配置值',
    '配置参数1'=>'配置值',
    // ... 更多配置
 ];
如果你定义格式是其他格式的话，可以使用parse方法来导入，例如：
>Config::parse(APP_PATH.'my_config.ini','ini');
Config::parse(APP_PATH.'my_config.xml','xml');

parse方法的第一个参数需要传入完整的文件名或者配置内容。

如果不传入第二个参数的话，系统会根据配置文件名自动识别配置类型，所以下面的写法仍然是支持的：

>Config::parse('my_config.ini');

parse方法除了支持读取配置文件外，也支持直接传入配置内容，例如：

>$config = 'var1=val
var2=val';
Config::parse($config,'ini');

支持传入配置文件内容的时候 第二个参数必须显式指定。

标准的ini格式文件定义：

配置参数1=配置值
配置参数2=配置值
标准的xml格式文件定义：

><config>
 <var1>val1</var1>
 <var2>val2</var2>
 </config>
配置类采用驱动方式支持各种不同的配置文件类型，因此可以根据需要随意扩展。


---

> PS:自动读取扩展配置版本要求V5.0.1
5.0.1以上版本支持自动读取扩展配置文件（extra_config_list配置参数废弃），只需要将扩展配置文件放入application/extra目录，即可自动读取。
自动读取的配置文件都是二级配置参数，一级配置名称就是扩展配置的文件名。
模块也可以支持自己的扩展配置文件，只需要放入 application/模块名/extra下面就可以自动加载。
系统默认加载的独立配置文件不在此列，包括：

文件名	描述
config	应用或者模块配置文件
database	数据库配置文件
tags	行为定义文件
场景名	应用场景配置文件
如果你更改了CONF_PATH，那么扩展配置文件目录应该是CONF_PATH/extra，模块配置目录则变成 CONF_PATH/module/，模块的扩展配置目录则变成CONF_PATH/module/extra。

---
## 五.读取配置参数
设置完配置参数后，就可以使用get方法读取配置了，例如：

>echo Config::get('配置参数1');

系统定义了一个助手函数config，以上可以简化为：
>echo config('配置参数1');

读取所有的配置参数：

>dump(Config::get());
 // 或者 dump(config());
 
或者你需要判断是否存在某个设置参数：

>Config::has('配置参数2');
// 或者 config('?配置参数2');

如果需要读取二级配置，可以使用：

>echo Config::get('配置参数.二级参数');
echo config('配置参数.二级参数');

---
## 六.环境变量配置
ThinkPHP5.0支持使用环境变量配置。
在开发过程中，可以在应用根目录下面的.env来模拟环境变量配置，.env文件中的配置参数定义格式采用ini方式，例如：
>app_debug =  true
app_trace =  true

如果你的部署环境单独配置了环境变量，那么请删除.env配置文件，避免冲突。
环境变量配置的参数会全部转换为大写，值为 null，no 和 false 等效于 ""，值为 yes 和 true 等效于 "1"。
ThinkPHP5.0默认的环境变量前缀是PHP_，也可以通过改变ENV_PREFIX常量来重新设置。
注意，环境变量不支持数组参数，如果需要使用数组参数可以，使用下划线分割定义配置参数名：

>database_username =  root
database_password =  123456

或者使用

>[database]
username =  root
password =  123456

获取环境变量的值可以使用下面的两种方式获取：
>Env::get('database.username');
Env::get('database.password');

// 同时下面的方式也可以获取
>Env::get('database_username');
Env::get('database_password');

可以支持默认值，例如：

>// 获取环境变量 如果不存在则使用默认值root
Env::get('database.username','root');

可以直接在应用配置中使用环境变量，例如：

>return [
    'hostname'  =>  Env::get('hostname','127.0.0.1'),
];

环境变量中设置的app_debug和app_trace参数会自动生效（优先于应用的配置文件），其它参数则必须通过Env::get方法才能读取。

---
## 七.作用域
配置参数支持作用域的概念，默认情况下，所有参数都在同一个系统默认作用域下面。如果你的配置参数需要用于不同的项目或者相互隔离，那么就可以使用作用域功能，作用域的作用好比是配置参数的命名空间一样。

>// 导入my_config.php中的配置参数，并纳入user作用域
Config::load('my_config.php','','user'); 
// 解析并导入my_config.ini 中的配置参数，读入test作用域
Config::parse('my_config.ini','ini','test'); 
// 设置user_type参数，并纳入user作用域
Config::set('user_type',1,'user'); 
// 批量设置配置参数，并纳入test作用域
Config::set($config,'test'); 
// 读取user作用域的user_type配置参数
echo Config::get('user_type','user'); 
// 读取user作用域下面的所有配置参数
dump(Config::get('','user')); 
dump(config('',null,'user')); // 同上
// 判断在test作用域下面是否存在user_type参数
Config::has('user_type','test'); 
可以使用range方法切换当前配置文件的作用域，例如：
Config::range('test');