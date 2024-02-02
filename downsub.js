function downloadSubtitle(onResult, onError) {
    _downloadSubtitle(onResult, onError); 
}

function _downloadSubtitle(onResult, onError) {
    const downloadButtons = document.getElementsByClassName("download-button");

    if (downloadButtons.length == 0) {
        setTimeout(() => {
            _downloadSubtitle(onResult, onError);
        }, 1000);
    } else {
        downloadButtons[0].click();

        onResult();
    }
}
