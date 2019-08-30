console.log("received");

function swap(referTo) {
    try {
        if (referTo.getAttribute('data-tab') == 'login') {
            document.getElementById('form-body').classList.remove('active');
            referTo.parentNode.classList.remove('signup');
        } else {
            document.getElementById('form-body').classList.add('active');
            referTo.parentNode.classList.add('signup');
        }
    } catch(msg) {
        console.log(msg);
    }
}