### iOS 适配https（AFNetworking3.0为例）

1.准备证书

首先找后台要一个证书（SSL证书,一般你跟后台说要弄https，然后让他给你个证书，他就知道了），我们需要的是.cer的证书。但是后台可能给我们的是.crt的证书。我们需要转换一下：打开终端 -> cd到.crt证书路径 -> 输入openssl x509 -in 你的证书.crt -out 你的证书.cer -outform der，证书就准备好了，拖入工程，记得选copy。

2.新建一个类或者类方法

以下代码借鉴的，楼主自己是放在一个叫FactoryUI的类中

//支持https
```
+ (AFSecurityPolicy *)customSecurityPolicy
{
    //先导入证书，找到证书的路径
    NSString *cerPath = [[NSBundle mainBundle] pathForResource:@"你的证书名字" ofType:@"cer"];
    NSData *certData = [NSData dataWithContentsOfFile:cerPath];

    //AFSSLPinningModeCertificate 使用证书验证模式
    AFSecurityPolicy *securityPolicy = [AFSecurityPolicy policyWithPinningMode:AFSSLPinningModeCertificate];

    //allowInvalidCertificates 是否允许无效证书（也就是自建的证书），默认为NO
    //如果是需要验证自建证书，需要设置为YES
    securityPolicy.allowInvalidCertificates = YES;

    //validatesDomainName 是否需要验证域名，默认为YES；
    //假如证书的域名与你请求的域名不一致，需把该项设置为NO；如设成NO的话，即服务器使用其他可信任机构颁发的证书，也可以建立连接，这个非常危险，建议打开。
    //置为NO，主要用于这种情况：客户端请求的是子域名，而证书上的是另外一个域名。因为SSL证书上的域名是独立的，假如证书上注册的域名是www.google.com，那么mail.google.com是无法验证通过的；当然，有钱可以注册通配符的域名*.google.com，但这个还是比较贵的。
    //如置为NO，建议自己添加对应域名的校验逻辑。
    securityPolicy.validatesDomainName = NO;
    NSSet *set = [[NSSet alloc] initWithObjects:certData, nil];
    securityPolicy.pinnedCertificates = set;

    return securityPolicy;
}
```
3.修改AFNetWorking的请求（AFNetworking3.0为例）

```

    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    manager.responseSerializer = [AFHTTPResponseSerializer serializer];
    manager.requestSerializer.timeoutInterval = 5.0;
    [manager setSecurityPolicy:[FactoryUI customSecurityPolicy]];//如2若提到的FactoryUI的类方法
    ···后面的就还是一样了
```
4.打开ATS（默认是开启的，手动屏蔽了的记得开启）

NO：表示开启了 （默认）
YES：表示屏蔽了ATS


开启ATS.png