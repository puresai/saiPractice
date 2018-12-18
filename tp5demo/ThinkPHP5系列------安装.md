# ThinkPHP5系列------安装
---

## 一、官网下载安装
获取ThinkPHP的方式很多，官方网站（http://thinkphp.cn）提供了稳定版本或者带扩展完整版本的下载。
官网的下载版本不一定是最新版本，GIT版本获取的才是保持更新的版本。
## 二、Composer安装
ThinkPHP5支持使用Composer安装，如果还没有安装 Composer，你可以按 Composer安装 中的方法安装。在 Linux 和 Mac OS X 中可以运行如下命令：
> curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

在 Windows 中，你需要下载并运行 Composer-Setup.exe。
如果遇到任何问题或者想更深入地学习 Composer，请参考 Composer 文档（英文），Composer 中文。

如果你已经安装有 Composer 请确保使用的是最新版本，你可以用 composer self-update 命令更新 Composer 为最新版本。
然后在命令行下面，切换到你的web根目录下面并执行下面的命令：

composer create-project topthink/think tp5  --prefer-dist
如果出现错误提示，请根据提示操作或者参考Composer中文文档。
如果国内访问composer的速度比较慢，可以参考这里的说明使用国内镜像




