function a() {
    var a = [{ "A":"b" }];
    setTimeout(function (err, succ) {
        setTimeout(function (err, succ) {
            setTimeout(function (err, succ) {
                console.log("a =>  ", a);
            }, 500);
            console.log("a =>  ", a);
        }, 500);
        console.log("a =>  ", a);
    }, 500);
    console.log("a =>  ", a);
}

a();