


async function aa() {
    for (var i = 0; i < 100; i++) {
        let result = await some_slow_async_function();
        do_something_with_result();
    }
}

function aa() {
    return new Promise(function(resolve) {
        var i = 0;

        __();

        function __() {
            if (i < 10) {
                some_slow_async_function().then(function() {
                    console.log('123');
                    __();
                });
                i++;
            } else {
                console.log('done');
                resolve();
            }
        }
    });
}



function some_slow_async_function() {
    return new Promise(function(resolve) {
        setTimeout(resolve, 1000);
    })
}

