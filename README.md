# 1，thread

用于测试 node.js 的子进程程和线程

父进程可以将一些参数发送给子进程，子进程计算后再发送给父进程。

因为父子进程分别跑在不同的 CPU 上，就能够最大限度的利用 CPU 资源。