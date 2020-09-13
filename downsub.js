function downloadSubtitle(onResult, onError) {
    __downloadSubtitle(onResult, onError)   
}

function __downloadSubtitle(onResult, onError) {
    var downloadButtons = document.getElementsByClassName('download-button')

    if (downloadButtons.length == 0) {
        setTimeout(function() {
            __downloadSubtitle(onResult, onError)
        }, 1000)
    } else {
        downloadButtons[0].click()

        onResult()
    }
}
