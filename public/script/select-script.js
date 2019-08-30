function openWindow(){
    var sel = document.getElementById('select-template');
    var selected = sel.options[sel.selectedIndex];
    window.open(`./template/${selected.value}.html`,"", "width=500, height=500");
    console.log(selected.text);
}