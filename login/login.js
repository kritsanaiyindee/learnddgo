import "../vendors/@progress/kendo-ui/2020.3.1118/js/kendo.all.min.js"

async function init(){
    await initLanguage();
    initKendoUI();
}

async function initLanguage() {
    await i18nLoader(i18nUrl, ["en", "th"]);
    //alert(i18nUrl);
    bindDropdownLanguage(currentLang);
    bindI18n(currentLang);
}

document.addEventListener("DOMContentLoaded", function (event) {
    //initial section
    setTimeout(function () {
        document.body.classList.remove('c-no-layout-transition')
    }, 2000);

    createCookie("current_language", currentLang, 30);
    fetchI18nLabel(i18nUrl, currentLang);
    dropdownLangBinding(i18nUrl, currentLang);

    //initial kendoui component ******
    
});
